using System;
using System.Collections.Generic;
//using System.Drawing;
using System.IO;
using System.IO.Enumeration;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Tensorflow;

using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using Tensorflow.Keras.Engine;
using Microsoft.ML;
using System.Data.Common;



namespace ImgNET // Note: actual namespace depends on the project name.
{
    internal class Server
    {

        MlModel mlModel;//= new MlModel ();
        ML_Dicom dicoM;// = new Dicom();

        SortedList<string, Thread> imgThread = new SortedList<string, Thread>();

        string mlInputDataFolder = "";
        public Server()
        {

            mlModel = new MlModel();

            const string dicomData = @"..\..\..\dicomData";

            dicoM = new ML_Dicom();

            //dicoM.ImportImage();
            dicoM.dcmFileData = mlModel.GetAbsolutePath(dicomData);

            mlInputDataFolder = mlModel.MlInputDataFilePath;

        }

        public void makeServer(string localIp)
        {
            string ip = "0.0.0.0";
            int port = 9000;
            var server = new TcpListener(IPAddress.Parse(ip), port);

            server.Start();
            Console.WriteLine("Server has started on {0}:{1} -- {2}\nWaiting for a connection…\n", ip, port, localIp);


            while (true)
            {
                if (server.Pending())
                {
                    TcpClient client = server.AcceptTcpClient();
                    string clientIP = client.Client.RemoteEndPoint.ToString();
                    Console.WriteLine("A client connected -- " + clientIP);
                    Thread thread = new Thread(ListenClient);
                    thread.Name = clientIP;
                    thread.Start(client);
                    imgThread.Add(clientIP, thread);
                }
                Thread.Sleep(300);
                var inactive = imgThread.Values.Where(t => !t.IsAlive).Select(s => s).ToList();
                while (inactive.Count > 0)
                {
                    string? thKey = inactive[0].Name;
                    var strKey = imgThread.Remove(thKey);
                    inactive.RemoveAt(0);
                }
            }
        }

        private void ListenClient(object obj)
        {
            TcpClient client = (TcpClient)obj;
            NetworkStream stream = client.GetStream();

            var clientIP = client.Client.RemoteEndPoint.ToString();

            var action = "NoAction";
            bool runFlag = true;
            //bool imageFlag = false;
            bool rxFileFlag = false;
            //bool predictFlag = false;
            bool dicomParserFlag = false;
            string? filePath = "";
            ulong fileChunck = 0;
            int wImage = 0;
            int hImage = 0;
            //List<BsonValue> models = new List<BsonValue>();
            string usedDataset = "";
            List<byte> chunks = new List<byte>();
            List<byte[]> rxBytes = new List<byte[]>();
            // enter to an infinite cycle to be able to handle every change in stream
            while (runFlag)
            {
                while (!stream.DataAvailable && runFlag) ;
                while (client.Available < 3) ; // match against "get"

                while (stream.DataAvailable)
                {
                    byte[] temp = new byte[client.Available];
                    stream.Read(temp, 0, temp.Length);
                    rxBytes.Add(temp);
                    Thread.Sleep(10);
                }

                byte[] bytes = rxBytes.SelectMany(i => i).ToArray();

                string s = Encoding.UTF8.GetString(bytes);
                rxBytes.Clear();

                if (Regex.IsMatch(s, "^GET", RegexOptions.IgnoreCase))
                {
                    Console.WriteLine("=====Handshaking from client=====\n{0}", s);

                    // 1. Obtain the value of the "Sec-WebSocket-Key" request header without any leading or trailing whitespace
                    // 2. Concatenate it with "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" (a special GUID specified by RFC 6455)
                    // 3. Compute SHA-1 and Base64 hash of the new value
                    // 4. Write the hash back as the value of "Sec-WebSocket-Accept" response header in an HTTP response
                    string swk = Regex.Match(s, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
                    string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                    byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
                    string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);

                    // HTTP/1.1 defines the sequence CR LF as the end-of-line marker
                    byte[] response = Encoding.UTF8.GetBytes(
                        "HTTP/1.1 101 Switching Protocols\r\n" +
                        "Connection: Upgrade\r\n" +
                        "Upgrade: websocket\r\n" +
                        "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n");

                    stream.Write(response, 0, response.Length);
                }
                else
                {
                    bool fin = (bytes[0] & 0b10000000) != 0,
                        mask = (bytes[1] & 0b10000000) != 0; // must be true, "All messages from the client to the server have this bit set"
                    int opcode = bytes[0] & 0b00001111, // expecting 1 - text message
                        offset = 2;
                    ulong msglen = (ulong)(bytes[1] & 0b01111111);

                    if (msglen == 126)
                    {
                        // bytes are reversed because websocket will print them in Big-Endian, whereas
                        // BitConverter will want them arranged in little-endian on windows
                        msglen = BitConverter.ToUInt16(new byte[] { bytes[3], bytes[2] }, 0);
                        offset = 4;
                    }
                    else if (msglen == 127)
                    {
                        // To test the below code, we need to manually buffer larger messages — since the NIC's autobuffering
                        // may be too latency-friendly for this code to run (that is, we may have only some of the bytes in this
                        // websocket frame available through client.Available).
                        msglen = BitConverter.ToUInt64(new byte[] { bytes[9], bytes[8], bytes[7], bytes[6], bytes[5], bytes[4], bytes[3], bytes[2] }, 0);
                        offset = 10;
                    }

                    if (msglen == 0)
                    {
                        Console.WriteLine("msglen == 0");
                    }
                    else if (mask)
                    {
                        byte[] decoded = new byte[msglen];

                        byte[] masks = new byte[4] { bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3] };
                        offset += 4;

                        for (ulong i = 0; i < msglen; ++i)
                            decoded[i] = (byte)(bytes[(ulong)offset + i] ^ masks[i % 4]);
                        if (decoded.Length == 2 && decoded[0] == 3 && decoded[1] == 233)
                        {
                            runFlag = false;
                            break;
                        }
                        List<byte> rxB = new List<byte>();
                        if (rxFileFlag)//|| imageFlag || predictFlag)
                        {

                            chunks.AddRange(decoded.ToList());
                            fileChunck--;
                            Console.WriteLine("{0} -- {1}", fileChunck, chunks.Count);
                            if (fileChunck != 0)
                            {
                                //
                                BsonDocument resData = new BsonDocument();
                                resData.Add("Action", "nextChunk");
                                resData.Add("Message", "send next");
                                txMessage(stream, resData.ToJson());
                                continue;
                            }
                            rxFileFlag = false;
                        }


                        string text = "";
                        switch (action)
                        {
                            case "File":
                                action = "NoAction";

                                saveFile(filePath, chunks.ToArray());

                                break;


                            case "DicomParser":
                                action = "NoAction";
                                // var imgRes = dicoM.builder(chunks.ToArray(), filePath);

                                // txMessage(stream, imgRes);
                                // Thread.Sleep(10);
                                break;

                            default:
                                var msg = "";
                                text = Encoding.UTF8.GetString(decoded);
                                // if (decoded[0] == 3 && decoded[1] == 233)
                                // {
                                //     runFlag = false;
                                //     break;
                                // }
                                Console.WriteLine("{0}", DateTime.Now.ToString("yyyy MM dd HH:mm:ss -- ") + text);
                                BsonDocument bson = new BsonDocument();

                                try
                                {
                                    bson = BsonSerializer.Deserialize<BsonDocument>(text);
                                    action = bson["Action"].ToString();
                                }
                                catch (Exception ex) { }

                                string? tempStr = "";
                                switch (action)
                                {
                                    case "savePrediction":
                                        var rs = savePrediction(bson);


                                        break;

                                    case "ProcessFiles":
                                        action = "NoAction";
                                        var imgs = processFiles(bson, dicoM._studyPath);
                                        BsonDocument imgData = new BsonDocument();
                                        imgData.Add("Action", "sImage");
                                        imgData.Add("Message", imgs);
                                        string rest = imgData.ToJson(new MongoDB.Bson.IO.JsonWriterSettings { OutputMode = MongoDB.Bson.IO.JsonOutputMode.Strict });

                                        txMessage(stream, rest);

                                        break;
                                    case "getPics":
                                        action = "NoAction";
                                        var nme = bson["Message"].ToString();
                                        var pth = dicoM._studyPath + "/ML_Data_" + nme;
                                        string[] files = Directory.GetFiles(pth)
                                            .Select(s => s.Split('/').Last())
                                            .Select(se => "/" + se)
                                            .ToArray();
                                        BsonDocument dcmData = new BsonDocument();
                                        BsonDocument dcmInfo = new BsonDocument();
                                        dcmInfo.Add("imagePath", "ML_Data/ML_Data_" + nme);
                                        dcmInfo.Add("filePath", dicoM._studyPath);
                                        dcmInfo.Add("dcmName", "Pending...");

                                        dcmInfo.Add("buffer", new BsonArray(files));


                                        dcmData.Add("Action", "sImage");
                                        dcmData.Add("Message", dcmInfo);

                                        string res = dcmData.ToJson(new MongoDB.Bson.IO.JsonWriterSettings { OutputMode = MongoDB.Bson.IO.JsonOutputMode.Strict });

                                        txMessage(stream, res);


                                        break;


                                    case "Predict":
                                        action = "NoAction";
                                        var predictResults = Predict(bson, stream);


                                        text = "";


                                        break;

                                    case "DicomParser":
                                    case "File":
                                        filePath = bson["FileName"].ToString();
                                        tempStr = bson["Chunk"].ToString();
                                        fileChunck = tempStr != null ? ulong.Parse(tempStr) : 0;
                                        chunks = new List<byte>();
                                        text = "";
                                        //imageFlag = true;
                                        rxFileFlag = true;

                                        break;
                                    case "PING":
                                        action = "NoAction";
                                        msg = clientIP + "\t" + "PING: " + DateTime.Now.ToString("yyyy MM dd HH:mm:ss");
                                        txMessage(stream, msg);
                                        break;

                                    case "Date":
                                        action = "NoAction";
                                        msg = clientIP + "\t" + DateTime.Now.ToString("yyyy MM dd HH:mm:ss");
                                        Console.WriteLine("{0}", msg);
                                        txMessage(stream, msg);
                                        break;
                                    case "Connect":
                                        action = "NoAction";
                                        tempStr = bson["Message"].ToString();
                                        msg = clientIP + "\t" + DateTime.Now.ToString("yyyy MM dd HH:mm:ss") + "\t -- " + tempStr;
                                        Console.WriteLine("{0}", msg);
                                        // txMessage(stream, msg);
                                        break;
                                    case "Train":
                                        action = "NoAction";
                                        msg = "Train Started: " + DateTime.Now.ToString("yyyy MM dd HH:mm:ss");
                                        txMessage(stream, msg);
                                        BsonDocument? pths = BsonSerializer.Deserialize<BsonDocument>(bson["Message"].ToString());
                                        mlModel.TrainModel(pths);

                                        msg = "Train End: " + DateTime.Now.ToString("yyyy MM dd HH:mm:ss");
                                        txMessage(stream, msg);
                                        break;

                                    case "GetModels":
                                        action = "NoAction";
                                        msg = getML_Models();
                                        txMessage(stream, msg);

                                        break;
                                    case "publicPath":
                                        action = "NoAction";
                                        msg = getML_Public();
                                        txMessage(stream, msg);

                                        break;

                                    case "Metrics":
                                        action = "NoAction";

                                        BsonDocument? metricPath = BsonSerializer.Deserialize<BsonDocument>(bson["Message"].ToString());
                                        string? modelPath = metricPath["Model"].ToString();
                                        string? dataPath = metricPath["Data"].ToString();
                                        var metrics = mlModel.getMetrics(modelPath, dataPath);

                                        msg = "MetricsData: " + DateTime.Now.ToString("yyyy MM dd HH:mm:ss");
                                        Console.WriteLine(msg);
                                        Console.WriteLine(metrics);
                                        txMessage(stream, metrics);
                                        break;


                                }

                                break;

                        }

                    }
                    else
                        Console.WriteLine("mask bit not set");

                    Console.WriteLine();
                }
            }


        }

        private object savePrediction(BsonDocument bson)
        {
            //var names = bson.Names;
            //var root = dicoM._studyPath;

            var folder = (string)bson["folder"];
            var file = (string)bson["file"];
            var dicomfile = (string)bson["dicomfile"];

            var bm2dcm = new BitmapToDicom();
            switch (dicomfile)
            {
                case "None":
                    bm2dcm.ImportImage(dicoM._studyPath, bson);

                    break;

                default:

                    break;

            }
            var data = bson["data"].AsBsonArray;
            foreach (var e in data)
            {
                var result = e["Result"].AsBsonDocument;
                var names = result.Names.ToList();
                var dset = e["Dataset"];
                var date = e["Date"];
                var model = e["Model"];
                var filename = e["FileName"];

            }


            return null;
        }

        private BsonDocument Predict(BsonDocument bson, NetworkStream stream)
        {

            var usedDataset = (string)bson["UseDataset"];
            var filePath = Path.Combine(dicoM._studyPath, (string)bson["folder"], (string)bson["file"]);

            var models = bson["Models"] as BsonArray;
            //var models = tmpA.ToList<BsonValue>();


            FileStream fileStream = File.OpenRead(filePath);

            MemoryStream memStream = new MemoryStream();
            memStream.SetLength(fileStream.Length);
            fileStream.Read(memStream.GetBuffer(), 0, (int)fileStream.Length);

            byte[] dataByte = memStream.ToArray();


            foreach (var m in models)
            {
                var model = m.ToString().Trim('/');
                var result = mlModel.predictFile(filePath, dataByte, model, usedDataset);
                BsonDocument resData = new BsonDocument();

                BsonDocument resTmp = new BsonDocument();

                resData.Add("Action", "mlPredicted");
                resTmp.Add("Result", result);
                resTmp.Add("Model", model.Trim('/'));
                resTmp.Add("FileName", bson["file"]);
                resTmp.Add("Date", DateTime.Now.ToString("yyyy MM dd HH:mm:ss.FFF"));
                var fsize = dataByte.Count() / 1000.0;
                resTmp.Add("FileSize", fsize + "kB");
                resTmp.Add("Dataset", usedDataset);
                //resTmp.Add("Size", "" + wImage + "x" + hImage + " pixels");
                resData.Add("Message", resTmp);

                var txMsg = resData.ToJson();
                txMessage(stream, txMsg);
                Thread.Sleep(10);

            }

            return null;

            //throw new NotImplementedException();
        }

        private BsonDocument processFiles(BsonDocument bson, string rootDir)
        {
            var olds = (bson["Message"]["old"].AsBsonArray).Distinct().ToList();

            var dicomFiles = new BsonArray();

            var files = new List<BsonDocument>();
            foreach (var fld in olds)
            {
                string? tempPath = mlInputDataFolder + (string)fld;
                string? fldrName = (string)fld;
                if (!Directory.Exists(tempPath))
                    continue;
                var filepath = Path.Combine(tempPath, "properties.txt");
                var filetxt = "";
                using (var sr = new StreamReader(filepath))
                {
                    // Read the stream as a string, and write the string to the console.
                    filetxt = sr.ReadToEnd();
                }
                var properties = BsonSerializer.Deserialize<BsonDocument>(filetxt);
                var mime = (string)properties["mimetype"];
                var fnme = (string)properties["filename"];
                if (mime.StartsWith("image/") ||  fnme.EndsWith(".dcm") )
                {
                    var wDir = Path.Combine(rootDir, fldrName);
                    if (!Directory.Exists(wDir))
                    {
                        Directory.CreateDirectory(wDir);
                    }
                    string? filename = (string)properties["filename"];
                    var sourcePath = Path.Combine(tempPath, filename);
                    var targetPath = Path.Combine(wDir, filename);
                    FileInfo fi = new FileInfo(targetPath);
                    if (!fi.Exists)
                        File.Copy(sourcePath, targetPath, true);

                    if ( fnme.EndsWith(".dcm"))
                    {
                        var imgFiles = processDicomFile(targetPath);
                        dicomFiles.add(imgFiles);
                        continue;
                    }

                    //dicoM.builder(targetPath);
                    BsonDocument tempDoc = new BsonDocument { { "folder", fldrName }, { "file", filename } };

                    files.Add(tempDoc);
                }

            }
            BsonDocument dcmInfo = new BsonDocument();

            dcmInfo.Add("buffer", new BsonArray(files));
            dcmInfo.Add("dicombuffer", dicomFiles);

            return dcmInfo;

        }

        private BsonDocument processDicomFile(string targetPath)
        {

            var imgFiles = dicoM.builderStr(targetPath);

            return imgFiles;
        }

        private string getML_Models()
        {
            var mdlPath = mlModel.ModelPath;

            var dsP = Path.Combine(mlModel.removeDirPath(mdlPath), "ML_Dataset");

            var exts = new[] { ".jpg", ".png", ".bmp", ".jpeg" };

            var datatrainPath = @"\Data\train";
            var i = 0;
            var dsFolders = Directory
                .GetDirectories(dsP)
                .Select(s => new
                {
                    id = "ds_" + i++,
                    name = splitDir(s), //s.Split('/').LastOrDefault(),
                    count = new DirectoryInfo(s + datatrainPath)
                                                .EnumerateFiles("*", SearchOption.AllDirectories)
                                                .Where(f => exts.Any(f => f.EndsWith(f, StringComparison.OrdinalIgnoreCase))).Count(),
                    path = Path.Combine(@"\", splitDir(s), datatrainPath),
                    tree = "dataset",
                    parent = "root"
                })
                .OrderBy(o => o.name)
                .Select(s => s.ToBsonDocument())
                .ToList();

            var root = new BsonDocument("id", "root");
            root.Add("name", "Dataset");

            dsFolders.Insert(0, root);

            string[] files = Directory.GetFiles(mdlPath, "*.zip");
            var fileName = files.Select(s => removeFileExtension(s)).ToList();
            fileName.Sort();

            i = 0;

            var mlFolders = fileName
                .Select(s => new
                {
                    id = "ml_" + i++,
                    name = s,
                    path = mdlPath,
                    tree = "model",
                    parent = "root"
                })
                .OrderBy(o => o.name)
                .Select(s => s.ToBsonDocument())
                .ToList();

            root = new BsonDocument("id", "root");
            root.Add("name", "Model");

            mlFolders.Insert(0, root);




            BsonDocument models = new BsonDocument();
            models.Add("Action", "setModels");


            BsonDocument dta = new BsonDocument();
            dta.Add("models", new BsonArray(fileName));
            dta.Add("modelTree", new BsonArray(mlFolders));

           
            var dcmBin = dicoM.dcmFileData
                    .Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries)
                    .TakeWhile(t => !t.Equals("bin"))
                    .Aggregate(Path.Combine);


            dta.Add("dcmData", dcmBin);// subS);
            dta.Add("datasetTree", new BsonArray(dsFolders));

            models.Add("Message", dta);

            var res = models.ToJson().Replace("_id", "id");

            return res;

        }

        private string splitDir(string s)
        {
            var dir = s.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
            return dir;
        }

        // private object makeBsonD(object s)
        // {

        //     // var bson = new  BsonDocument();
        //     // foreach(var e in s){
        //     //     var l = e
        //     // }
        // }


        private string getML_Public()
        {
            var publicPath = dicoM._studyPath;


            var ds = new DirectoryInfo(publicPath)
                .GetFiles("*", SearchOption.AllDirectories)
                .GroupBy(g => g.DirectoryName.Split(Path.DirectorySeparatorChar).LastOrDefault())
                .Select(s => makeBson(s))
                .ToList();

            BsonDocument pPath = new BsonDocument();
            pPath.Add("Action", "publicPath");


            BsonDocument dirPath = new BsonDocument();
            dirPath.Add("data", new BsonArray(ds));
            dirPath.Add("path", publicPath);

            pPath.Add("Message", dirPath);

            return pPath.ToJson();

        }

        private object makeBson(IGrouping<string, FileInfo> s)
        {
            var b = new BsonDocument("folder", s.Key);
            var a = new BsonArray();
            foreach (var f in s)
            {
                a.Add(f.Name);


            }
            b.Add("files", a);

            return b;
        }


        private string removeFileExtension(string filename)
        {
            string name = "";
            FileInfo fi = new FileInfo(filename);
            name = fi.Name.Replace(fi.Extension, "");
            return name;
        }
        public static void saveFile(string fileName, byte[] data)
        {
            string fPath = "/home/mrod/ML_Data/" + fileName;
            using var writer = new BinaryWriter(File.OpenWrite(fPath));
            writer.Write(data);
        }
        public void byteArrayToImage(string fileName, byte[] byteArrayIn)
        {

            string fPath = "/home/mrod/development/" + fileName;
            var image = Image.Load<Rgba32>(byteArrayIn);
            image.Mutate(x => x.Grayscale());

            image.SaveAsJpeg(fPath);
            //var image = System.Drawing.Image.(new MemoryStream(byteArrayIn));

            var w = image.Width;
            var h = image.Height;

            var sum = w + h;

        }
        private void txMessage(NetworkStream stream, string msg)
        {
            var ms = sendWebSocketMessage(msg);
            stream.Write(ms, 0, ms.Length);
        }

        //function call from websocket server request
        public byte[] sendWebSocketMessage(string mess)
        {
            byte[] rawData = Encoding.ASCII.GetBytes(mess); //mess.getBytes();

            int frameCount = 0;
            byte[] frame = new byte[10];

            frame[0] = (byte)129;

            if (rawData.Length <= 125)
            {
                frame[1] = (byte)rawData.Length;
                frameCount = 2;
            }
            else if (rawData.Length >= 126 && rawData.Length <= 65535)
            {
                frame[1] = (byte)126;
                int len = rawData.Length;
                frame[2] = (byte)((len >> 8) & (byte)255);
                frame[3] = (byte)(len & (byte)255);
                frameCount = 4;
            }
            else
            {
                frame[1] = (byte)127;
                int len = rawData.Length;
                frame[2] = (byte)((len >> 56) & (byte)255);
                frame[3] = (byte)((len >> 48) & (byte)255);
                frame[4] = (byte)((len >> 40) & (byte)255);
                frame[5] = (byte)((len >> 32) & (byte)255);
                frame[6] = (byte)((len >> 24) & (byte)255);
                frame[7] = (byte)((len >> 16) & (byte)255);
                frame[8] = (byte)((len >> 8) & (byte)255);
                frame[9] = (byte)(len & (byte)255);
                frameCount = 10;
            }

            int bLength = frameCount + rawData.Length;

            byte[] reply = new byte[bLength];

            int bLim = 0;
            for (int i = 0; i < frameCount; i++)
            {
                reply[bLim] = frame[i];
                bLim++;
            }
            for (int i = 0; i < rawData.Length; i++)
            {
                reply[bLim] = rawData[i];
                bLim++;
            }

            //out.write(reply);
            //out.flush();

            return reply;
        }
    }
}
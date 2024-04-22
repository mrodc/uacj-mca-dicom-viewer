using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.Enumeration;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using FellowOakDicom;
using FellowOakDicom.Imaging;
using FellowOakDicom.IO.Buffer;

using System.Drawing.Imaging;


// using SixLabors.ImageSharp.Advanced;
// using SixLabors.ImageSharp.Formats;
// using SixLabors.ImageSharp.Memory;
// using SixLabors.ImageSharp.Metadata;
// using SixLabors.ImageSharp.PixelFormats;
// using SixLabors.ImageSharp;
// using SixLabors.ImageSharp;
// using SixLabors.ImageSharp.Advanced;
// using SixLabors.ImageSharp.PixelFormats;
// using SixLabors.ImageSharp.Processing;
//using Tensorflow;
//using SixLabors.ImageSharp.ColorSpaces;
//using FellowOakDicom.Imaging.ImageSharp;
using System.Collections.Immutable;
using MongoDB.Bson;
using Dicom.Imaging.Render;

using Dicom.IO;
using SixLabors.ImageSharp;
//using Dicom.Imaging;

// using SixLabors.ImageSharp.Formats.Jpeg;
// using SixLabors.ImageSharp.Formats.Png;

//using Google.Protobuf.WellKnownTypes;
//using System.

namespace ImgNET // Note: actual namespace depends on the project name.
{

    internal class ML_Dicom
    {
        string imageFolder = @"\development\uacjDicom\public\";
        string userDirectory = "";

        string studyPath = "";
        public string _studyPath
        {
            get
            {
                return studyPath + "ML_Data";
            }
        }

        //default group and element values
        //these are to create the visualizer private tags
        ushort dicomGroupTag = 0x0055;
        ushort dicomElement = 0x0010;
        string version = "uacj.v";
        string machineId = "ML.NET_UACJ_IIT_MCA";

        public string dcmFileData { get; internal set; }

        public ML_Dicom()
        {


            //             Configuration.Default.ImageFormatsManager.SetEncoder( PngFormat.Instance, new  PngEncoder() //  JpegFormat.Instance, new JpegEncoder()
            // {
            //      ChunkFilter
            //     });

            // Configuration.Default.ImageFormatsManager.SetEncoder(  JpegFormat.Instance, new JpegEncoder()
            // {
            //     Quality = 90
            // });
            var year = DateTime.Now.Year;
            var month = DateTime.Now.Month;
            version = "uacj.v" + year + "." + month;

            userDirectory = new DirectoryInfo(Environment.GetFolderPath(System.Environment.SpecialFolder.UserProfile)).FullName;

            studyPath = userDirectory + imageFolder;

            new DicomSetupBuilder()
                .RegisterServices(s => s.AddFellowOakDicom().AddTranscoderManager<FellowOakDicom.Imaging.NativeCodec.NativeTranscoderManager>())
                .SkipValidation()
                .Build();

            new DicomSetupBuilder()
                   .RegisterServices(s =>
                        s.AddFellowOakDicom()
                          .AddTranscoderManager<FellowOakDicom.Imaging.NativeCodec.NativeTranscoderManager>()
                          .AddImageManager<ImageSharpImageManager>())
                   .SkipValidation()
                   .Build();



        }

        private void parseDicomInfo(DicomDataset ds, out int imageFrames)
        {

            imageFrames = 0;
            var alltags = ds.Select(s => s).GroupBy(g => g.Tag.Group).ToList();

            var tags = ds.Where(w => w.Tag.ToString().EndsWith(machineId)).Select(s => s).ToList();
            var cnt = tags.Count;

            var framesTag = new DicomTag(0x0028, 0x0008);
            imageFrames = ds.Contains(framesTag) ? ds.GetSingleValue<int>(framesTag) : 1;

            // //var privTag = DicomTag.Parse("0081,1013");
            // if (ds.Contains(tg))
            // {

            //     var pValue = ds.GetValues<byte>(tg).ToArray();
            // }


        }
        public string builder(byte[] dataFile, string dcmFilePath)
        {
            MemoryStream memStream = new MemoryStream(dataFile);
            DicomFile? dicomFile = null;
            try
            {
                dicomFile = DicomFile.Open(memStream);
            }
            catch (Exception x)
            {
                var ex = x.Message;
            }
            var dataSet = dicomFile.Dataset;
            //var dicomImage = new DicomImage(dicomFile.Dataset);
            int imageFrames = 0;
            parseDicomInfo(dataSet, out imageFrames);
            List<string> frames = new List<string>();
            var guiPath = Guid.NewGuid().ToString().Split('-')[1];
            var framePath = "ML_Data/ML_Data_" + guiPath;


            //save to server directory
            var filePath = userDirectory + imageFolder;//+ framePath;

            while (Directory.Exists(filePath + framePath))
            {
                guiPath = Guid.NewGuid().ToString().Split('-')[1];
                framePath = "ML_Data/ML_Data_" + guiPath;

            }

            Directory.CreateDirectory(filePath + framePath);
            DicomPixelData pxd = DicomPixelData.Create(dicomFile.Dataset);

            for (int i = 0; i < imageFrames; i++)
            {
                IByteBuffer buffer = pxd.GetFrame(i);
                var bStream = new MemoryStream();
                buffer.CopyToStream(bStream);

                var imgBuffer = bStream.ToArray();
                int size = imgBuffer.Length;

                string fImg = "/frame_" + i + ".jpg";
                frames.Add(fImg);

                var thePath = filePath + framePath + "/frame_" + i + ".jpg";


                CopyStream(bStream, thePath);

                //thePath = filePath + framePath + "/frame_" + i + ".png";
                //CopyStream(bStream, thePath);


            }




            var globalPath = dcmFileData + "/" + guiPath;
            if (!Directory.Exists(globalPath))
                Directory.CreateDirectory(globalPath);

            globalPath += "/" + dcmFilePath;



            dicomFile.Save(globalPath);


            BsonDocument dcmData = new BsonDocument();
            BsonDocument dcmInfo = new BsonDocument();
            dcmInfo.Add("imagePath", framePath);
            dcmInfo.Add("filePath", filePath);
            dcmInfo.Add("dcmName", dcmFilePath);

            dcmInfo.Add("buffer", new BsonArray(frames));


            dcmData.Add("Action", "sImage");
            dcmData.Add("Message", dcmInfo);

            //string res = dcmData.ToJson(new MongoDB.Bson.IO.JsonWriterSettings { OutputMode = MongoDB.Bson.IO.JsonOutputMode.Strict });

            string res = visorRegister(dicomFile, globalPath, dcmData);

            return res;
        }

        private string visorRegister(DicomFile dicomFile, string globalPath, BsonDocument dcmData)
        {
            var group = dicomGroupTag;
            var element = dicomElement;

            var ds = dicomFile.Dataset;
            //var alltags = ds.Select(s => s).GroupBy(g => g.Tag.Group).ToList();
            //var alltags = ds.Select(s => s).ToList();


            var privItem = ds.Where(w => w.Tag.ToString().EndsWith(machineId)).Select(s => s).FirstOrDefault();

            DicomTag privateTag = new DicomTag(0, 0);
            if (privItem == null)
            {
                var tempTag = new DicomTag(group, element);

                var intent = 10;
                while (ds.Contains(tempTag) && intent > 0)
                {
                    group += 2;
                    tempTag = new DicomTag(group, element);
                    intent--;
                }
                if (intent > 0)
                {
                    var privTag = new DicomTag(group, element, machineId);

                    DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag, "uacjVisor", "uacj_root_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
                    ds.AddOrUpdate<string>(DicomVR.LO, privTag, version);

                    var privateCreator = DicomDictionary.Default.GetPrivateCreator(machineId);
                    var privTag1 = new DicomTag(group, 0x0020, privateCreator);
                    DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag1, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
                    var regDate = DateTime.Now.ToString("yyyy MM dd HH:mm:ss");

                    byte[] bytes = Encoding.ASCII.GetBytes(regDate);
                    ds.AddOrUpdate(DicomVR.LO, privTag1, regDate);


                }
            }

            var done = dcmData.ToJson(new MongoDB.Bson.IO.JsonWriterSettings { OutputMode = MongoDB.Bson.IO.JsonOutputMode.Strict });
            /*
            var privTag = privItem.Tag;
            privTag = new DicomTag(group, element);
            vvar privTag = privItem.Tag;
            privTag = new DicomTag(group, element);ar privTag = privItem.Tag;
            privTag = new DicomTag(group, element);
            //var framesTag = new DicomTag(0x0028, 0x0008);
            //imageFrames = ds.Contains(framesTag) ? ds.GetSingleValue<int>(framesTag) : 1;


            var privTag = new DicomTag(0x0081, 0x0010, "UACJ_VISOR");
 : 
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag : 
            var privateCreator = DicomDictionary.Default.GetPrivateCreator("UACJ_VISOR");
            var privTag1 = new DicomTag(0x0081, 0x0020, privateCreator);
            var privTag2 = new DicomTag(0x0081, 0x0021, privateCreator);
            Dicovar privTag = privItem.Tag;
            privTag = new DicomTag(group, element);mDictionary.Default.Add(new DicomDictionaryEntry(privTag1, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag2, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));


            byte[] bytes = Encoding.ASCII.GetBytes(priTag.ToJson());
            ds.AddOrUpdate(DicomVR.OB, privTag1, bytes);
            ds.AddOrUpdate(DicomVR.OB, privTag2, bytes);
*/
            dicomFile.Save(globalPath);
            return done;
        }
        public void CopyStream(Stream stream, string destPath)
        {
            stream.Seek(0, SeekOrigin.Begin);
            using (var fileStream = new FileStream(destPath, FileMode.Create, FileAccess.Write))
            {
                stream.CopyTo(fileStream);
            }
        }

        public BsonDocument builderStr(string filePath)
        {

            //var tpth = filePath.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries).TakeWhile(t=> t.Equals("ML_Data")).ToList();
            
            var dirs = filePath.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries).TakeLast(3).ToList();//= new FileInfo (targetPath);
            
            var pth = dirs[0];
            var fldr = dirs[1];
            var fileP = dirs[2];
            
            var dcFile = File.ReadAllBytes(filePath);

            MemoryStream memStream = new MemoryStream(dcFile);


            var dicomF = DicomFile.Open(memStream);

            // if( DicomFile.HasValidHeader(dicomF)){

            // }
            var dset = dicomF.Dataset;

            //var jsonData = dset.ToBsonDocument();
            var alltags = dset.Select(s => s).GroupBy(g => g.Tag.Group).ToList();



            //parseDicomInfo(dset);

            var images = new DicomImage(dset);


            var imageFiles = new List<string>();
            FileInfo fi = new FileInfo(filePath);
            var tempPath = fi.DirectoryName;
            var imgCnt = images.NumberOfFrames;

            BsonDocument tempDoc = new BsonDocument { {"path",pth},{ "folder", fldr }, { "dicomfile", fileP } };

            for (int i = 0; i < imgCnt; i++)
            {
                var sharpimage = images.RenderImage(i).AsSharpImage();
                //var bmp = (Image)images.RenderImage(i);

                ///var pixels = sharpimage.Pixels;// AsBytes();//)sSharpImage();//AsSharpImage();
                //var w = bmp.Width;
                //var h = bmp.Height;

                //var newname = fileP.Replace(fi.Extension, "_p_" + (i + 1) + ".jpg");
                var newname = fileP.Replace(fi.Extension, ".jpg");

                string outPath = Path.Combine(tempPath, newname);

                sharpimage.SaveAsJpeg(outPath);
                imageFiles.Add(newname);

                break;//take just one image
            }

            tempDoc.Add("images", new BsonArray(imageFiles));

            return tempDoc;

        }


        public void builder(string filePath)
        {

            var images = new DicomImage(filePath);
            FileInfo fi = new FileInfo(filePath);
            var imgCnt = images.NumberOfFrames;
            for (int i = 0; i < imgCnt; i++)
            {
                var sharpimage = images.RenderImage(i).AsSharpImage();

                ///var pixels = sharpimage.Pixels;// AsBytes();//)sSharpImage();//AsSharpImage();
                var w = sharpimage.Width;
                var h = sharpimage.Height;


                string outPath = filePath.Replace(fi.Extension, "_" + (i + 1) + ".jpg");

                //sharpimage.SaveAsJpeg(outPath);
            }
        }
        public DicomDataset CreateMultiFrameDataset_(int columns, int rows, byte[] image)
        {
            var dataset = new DicomDataset(DicomTransferSyntax.JPEGProcess1);

            dataset.Add(DicomTag.Columns, (ushort)columns);
            dataset.Add(DicomTag.Rows, (ushort)rows);

            dataset.Add(DicomTag.BitsAllocated, (ushort)8);
            dataset.Add(DicomTag.LossyImageCompression, "01");
            dataset.Add(DicomTag.LossyImageCompressionMethod, "ISO_10918_1");
            dataset.Add(DicomTag.PhotometricInterpretation, PhotometricInterpretation.YbrFull422.Value);
            //YbrFull.Value);//YbrFull422.Value);
            dataset.Add(DicomTag.SOPClassUID, DicomUID.MultiFrameGrayscaleByteSecondaryCaptureImageStorage);
            dataset.Add(DicomTag.SOPInstanceUID, "1.2.840.10008.5.1.4.1.1.2.202009290000000001"); //GenerateUid()


            var pixelData = DicomPixelData.Create(dataset, true);
            pixelData.BitsStored = 8;
            pixelData.SamplesPerPixel = 3;
            pixelData.HighBit = 7;
            pixelData.PixelRepresentation = PixelRepresentation.Unsigned;
            pixelData.PhotometricInterpretation = PhotometricInterpretation.YbrFull422;
            //pixelData.PlanarConfiguration = PlanarConfiguration.Interleaved;

            //pixelData.AddFrame(new MemoryByteBuffer(image));
            //pixelData.AddFrame();

            //foreach (var image in images)

            // var fragment = new DicomOtherByteFragment(DicomTag.PixelData);
            // fragment.Fragments.Add(EvenLengthBuffer.Create(new MemoryByteBuffer(image)));
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));

            var buf = new MemoryByteBuffer(image);
            pixelData.AddFrame(buf);
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));

            // byte[] bytes = Encoding.ASCII.GetBytes(priTag.ToJson());
            // privTag = new DicomTag(0x0081, 0x1011, "uacj_Prev_Session");
            // DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag, "uacj_Prev_Session", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));

            // dataset.AddOrUpdate(DicomVR.OB, privTag, bytes);



            // priTag.Add("HelloNow", "this is a test");
            // priTag.Add("DateNow", DateTime.Now.ToString("yyyy MM dd HH:mm:ss.FFF"));
            // bytes = Encoding.ASCII.GetBytes(priTag.ToJson());

            // privTag = new DicomTag(0x0081, 0x1013, "uacj_Today_Session");
            // DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag, "uacj_Today_Session", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));

            // dataset.AddOrUpdate(DicomVR.OB, privTag, bytes);

            // var tCount = dataset.GetValueCount(privTag);

            // var pValue = dataset.GetValues<byte>(privTag).ToArray();

            // var dicomList = dataset.Where(w => w.Tag.DictionaryEntry.Keyword.StartsWith("uacj_")).Select(s => s).ToList();

            var privateTag = new DicomTag(dicomGroupTag, dicomElement, "UACJ_VISOR");

            DicomDictionary.Default.Add(new DicomDictionaryEntry(privateTag, "uacjVisor", "uacj_root_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            dataset.AddOrUpdate<string>(DicomVR.LO, privateTag, version);


            var privateCreator = DicomDictionary.Default.GetPrivateCreator("UACJ_VISOR");
            var privTag1 = new DicomTag(dicomGroupTag, 0x0010, privateCreator);
            var privTag2 = new DicomTag(dicomGroupTag, 0x0011, privateCreator);
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag1, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag2, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));

            // dataset.AddOrUpdate(DicomVR.LO, privTag1, "This is a test","uacj");
            // dataset.AddOrUpdate(DicomVR.LO, privTag2, "InceptionV3","ittmca");
            dataset.AddOrUpdate(privTag1, "This is a test", "uacj");
            dataset.AddOrUpdate(privTag2, "InceptionV3", "ittmca");
            // byte[] bytes = Encoding.ASCII.GetBytes(privateTag.ToJson());
            // dataset.AddOrUpdate(DicomVR.OB, privTag1, bytes);
            // dataset.AddOrUpdate(DicomVR.OB, privTag2, bytes);

            // ushort index = 0x0030;
            // for (ushort i = 0; i < 10; i++)
            // {
            //     ushort element = (ushort)(index + i);
            //     var privTagX = new DicomTag(0x0081, element, privateCreator);
            //     DicomDictionary.Default.Add(new DicomDictionaryEntry(privTagX, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            //     dataset.AddOrUpdate(DicomVR.OB, privTagX, bytes);

            // }
            return dataset;
        }
        // public bool ImportImage(BsonDocument bson)

        // public DicomDataset readImage(BsonDocument bson)
        // {
        //     var imagePath = Path.Combine(_studyPath, (string)bson["folder"], (string)bson["file"]);

        //     //var imageFile = @"C:\cppDevelopment\imgNET6\imgNET6\lenna.jpg";//Path.Combine(_studyPath, folder, file);"C:\cppDevelopment\imgNET6\imgNET6\lenna.jpg"
        //     var imageFile = imagePath;//"C:/cppDevelopment/imgNET6/imgNET6/lenna.jpg";//Path.Combine(_studyPath, folder, file);"C:\cppDevelopment\imgNET6\imgNET6\lenna.jpg"
        //     var b = File.ReadAllBytes(imageFile);//.Select(s=>s);
        //     FileStream fileStream = File.OpenRead(imageFile);
        //     var size = GetImageSize(File.ReadAllBytes(imageFile));
        //     var ds = CreateMultiFrameDataset(size.Width, size.Height, b);


        //     var newFilePah = getSaveFilePath(imageFile);

        //     DicomFile dicomfile = new DicomFile(ds);
        //     dicomfile.Save(newFilePah);

        //     return ds;

        // }
        // public Size GetImageSize(byte[] image)
        // {
        //     using (var buffer = new MemoryStream(image))
        //     {
        //         using (var bitmap = Image.FromStream(buffer))
        //         {
        //             return bitmap.Size;
        //         }
        //     }
        // }
        public DicomDataset CreateMultiFrameDataset(int columns, int rows, byte[] images)
        {
            var dataset = new DicomDataset(DicomTransferSyntax.JPEGProcess1);

            dataset.Add(DicomTag.Columns, (ushort)columns);
            dataset.Add(DicomTag.Rows, (ushort)rows);

            dataset.Add(DicomTag.BitsAllocated, (ushort)8);
            dataset.Add(DicomTag.LossyImageCompression, "01");
            dataset.Add(DicomTag.LossyImageCompressionMethod, "ISO_10918_1");
            dataset.Add(DicomTag.PhotometricInterpretation, PhotometricInterpretation.YbrFull422.Value);
            dataset.Add(DicomTag.SOPClassUID, DicomUID.MultiFrameTrueColorSecondaryCaptureImageStorage);
            dataset.Add(DicomTag.SOPInstanceUID, "1.2.840.10008.5.1.4.1.1.2.202009290000000001");

            var pixelData = DicomPixelData.Create(dataset, true);
            pixelData.BitsStored = 8;

            pixelData.SamplesPerPixel = 3;
            pixelData.HighBit = 7;
            pixelData.PixelRepresentation = PixelRepresentation.Unsigned;
            pixelData.PlanarConfiguration = PlanarConfiguration.Planar;//Interleaved;

            //foreach (var image in images)
            {
                var fragment = new DicomOtherByteFragment(DicomTag.PixelData);
                fragment.Fragments.Add(EvenLengthBuffer.Create(new MemoryByteBuffer(images)));
                pixelData.AddFrame(new CompositeByteBuffer(fragment));
            }

            // var fragment = new DicomOtherByteFragment(DicomTag.PixelData);
            // fragment.Fragments.Add(EvenLengthBuffer.Create(new MemoryByteBuffer(images)));
            // pixelData.AddFrame(new CompositeByteBuffer(fragment));

            return dataset;
        }



        public DicomDataset CreateMultiFrameDataset__(int columns, int rows, byte[] image)
        {
            var dataset = new DicomDataset(DicomTransferSyntax.JPEGProcess1);





            dataset.Add(DicomTag.Columns, (ushort)columns);
            dataset.Add(DicomTag.Rows, (ushort)rows);

            dataset.Add(DicomTag.BitsAllocated, (ushort)8);
            dataset.Add(DicomTag.LossyImageCompression, "01");
            dataset.Add(DicomTag.LossyImageCompressionMethod, "ISO_10918_1");
            dataset.Add(DicomTag.PhotometricInterpretation, PhotometricInterpretation.YbrFull422.Value);
            //YbrFull.Value);//YbrFull422.Value);
            dataset.Add(DicomTag.SOPClassUID, DicomUID.MultiFrameTrueColorSecondaryCaptureImageStorage);
            dataset.Add(DicomTag.SOPInstanceUID, "1.2.840.10008.5.1.4.1.1.2.202009290000000001");


            var pixelData = DicomPixelData.Create(dataset, true);
            pixelData.BitsStored = 8;
            pixelData.SamplesPerPixel = 3;
            pixelData.HighBit = 7;
            pixelData.PixelRepresentation = PixelRepresentation.Unsigned;
            //pixelData.PlanarConfiguration = PlanarConfiguration.Interleaved;

            //pixelData.AddFrame(new MemoryByteBuffer(image));
            //pixelData.AddFrame();

            //foreach (var image in images)

            var fragment = new DicomOtherByteFragment(DicomTag.PixelData);
            fragment.Fragments.Add(EvenLengthBuffer.Create(new MemoryByteBuffer(image)));
            pixelData.AddFrame(new CompositeByteBuffer(fragment));
            pixelData.AddFrame(new CompositeByteBuffer(fragment));
            pixelData.AddFrame(new CompositeByteBuffer(fragment));
            pixelData.AddFrame(new CompositeByteBuffer(fragment));
            pixelData.AddFrame(new CompositeByteBuffer(fragment));
            pixelData.AddFrame(new CompositeByteBuffer(fragment));


            BsonDocument priTag = new BsonDocument();
            priTag.Add("Hello", "this is a test");
            priTag.Add("Date", DateTime.Now.ToString("yyyy MM dd HH:mm:ss.FFF"));





            // byte[] bytes = Encoding.ASCII.GetBytes(priTag.ToJson());
            // privTag = new DicomTag(0x0081, 0x1011, "uacj_Prev_Session");
            // DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag, "uacj_Prev_Session", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));

            // dataset.AddOrUpdate(DicomVR.OB, privTag, bytes);



            // priTag.Add("HelloNow", "this is a test");
            // priTag.Add("DateNow", DateTime.Now.ToString("yyyy MM dd HH:mm:ss.FFF"));
            // bytes = Encoding.ASCII.GetBytes(priTag.ToJson());

            // privTag = new DicomTag(0x0081, 0x1013, "uacj_Today_Session");
            // DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag, "uacj_Today_Session", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));

            // dataset.AddOrUpdate(DicomVR.OB, privTag, bytes);

            // var tCount = dataset.GetValueCount(privTag);

            // var pValue = dataset.GetValues<byte>(privTag).ToArray();

            // var dicomList = dataset.Where(w => w.Tag.DictionaryEntry.Keyword.StartsWith("uacj_")).Select(s => s).ToList();



            var privTag = new DicomTag(0x0081, 0x0010, "UACJ_VISOR");

            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag, "uacjVisor", "uacj_root_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            dataset.AddOrUpdate<string>(DicomVR.LO, privTag, "uacj.v2023.11.20");


            var privateCreator = DicomDictionary.Default.GetPrivateCreator("UACJ_VISOR");
            var privTag1 = new DicomTag(0x0081, 0x0020, privateCreator);
            var privTag2 = new DicomTag(0x0081, 0x0021, privateCreator);
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag1, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag2, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));


            byte[] bytes = Encoding.ASCII.GetBytes(priTag.ToJson());
            dataset.AddOrUpdate(DicomVR.OB, privTag1, bytes);
            dataset.AddOrUpdate(DicomVR.OB, privTag2, bytes);

            ushort index = 0x0030;
            for (ushort i = 0; i < 10; i++)
            {
                ushort element = (ushort)(index + i);
                var privTagX = new DicomTag(0x0081, element, privateCreator);
                DicomDictionary.Default.Add(new DicomDictionaryEntry(privTagX, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
                dataset.AddOrUpdate(DicomVR.OB, privTagX, bytes);

            }
            return dataset;
        }
        private string getSaveFilePath(string fileName)
        {
            FileInfo fi = new FileInfo(fileName);

            string path = fi.FullName.Replace(fi.Extension, ".dcm");

            return path;

        }

        private DicomUID GenerateUid()
        {
            StringBuilder uid = new StringBuilder();//1.2.840.10008.5.1.4.1.1.4
                                                    //uid.Append("1.08.1982.10121984.2.0.07").Append('.').Append(DateTime.UtcNow.Ticks);
            uid.Append("1.2.840.10008.5.1.4.1.1.4").Append('.').Append(DateTime.UtcNow.Ticks);
            return new DicomUID(uid.ToString(), "SOP Instance UID", DicomUidType.SOPInstance);
        }

    }
}
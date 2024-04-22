// using System.IO;
// using System.Collections.Generic;
// using System.Linq;
// using System.Net.Http;
// using System.Threading;
// using System.Threading.Tasks;

using Common;
using ImageClassification;
using ImageClassification.DataModels;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

using System.Net.WebSockets;

using static Microsoft.ML.DataOperationsCatalog;
using static Microsoft.ML.Transforms.ValueToKeyMappingEstimator;
using System.Text.RegularExpressions;
using System.Threading;
using Tensorflow;
using Microsoft.ML.Trainers;

namespace ImgNET // Note: actual namespace depends on the project name.
{
    internal class Program
    {
        // private static string outputMlNetModelFilePath,outputMlNetModelFilePathZip, imagesFolderPathForPredictions, fullImagesetFolderPath;
        // private static string imageClassifierModelZipFilePath;

        // private static IDataView trainDataView, testDataView;
        // private static MLContext mlContext;

        static Server? server;

        //     static Socket listener = new(
        // IPEndPoint.AddressFamily,
        // SocketType.Stream,
        // ProtocolType.Tcp);

        //static IPEndPoint ipEndPoint = new IPEndPoint(0,9000);

        static void Main(string[] args)
        {
            //BitmapToDicom bdcm = new BitmapToDicom ();
            //ReadImage readImage = new ReadImage();
            //var dirPath = userDir.Root.FullName;

            //ML_Dicom dc = new ML_Dicom();
            //dc.builderStr("/home/mrod/Pictures/ID_0000_AGE_0060_CONTRAST_1_CT.dcm");
            //dc.builderStr("/home/mrod/Pictures/1-023.dcm");


            //dc.ImportImage("/home/mrod/Pictures/000114.jpg");
            //dc.ImportImage("/home/mrod/Pictures/images/lenna.jpg");
            //dc.builderStr("/home/mrod/Pictures/images/lenna.dcm");

            //dc.ImportImage("/home/mrod/Pictures/images/Large 000115.png");

            //dc.builderStr("/home/mrod/ML_Data/6154_Out3.dcm");
            //dc.builder("/home/mrod/Pictures/000114_MultiFrame.dcm");
            //


            var ip = GetLocalIPAddress();

            server = new Server();
            server.makeServer(ip);

        }
        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());

            var ips = host.AddressList
                .Where(w => w.AddressFamily == AddressFamily.InterNetwork)
                .Select(s => s.ToString())
                .ToList();

            var ip = Environment.NewLine
                + "  ========= "
                + Environment.NewLine
                + String.Join(Environment.NewLine, ips)
                + Environment.NewLine;

            return ip;


        }

    }
}

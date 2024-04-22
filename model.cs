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
using Microsoft.ML.Vision;
using MongoDB.Bson;
using DnsClient.Protocol;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using NumSharp.Utilities;

namespace ImgNET // Note: actual namespace depends on the project name.
{
    internal class MlModel
    {
        private static string? outputMlNetModelFilePath,
        outputMlNetModelFilePathZip,
        imagesFolderPathForPredictions, mlInputDataFilePath,
        fullImagesetFolderPath;

        //private static string? ;

        public string ModelPath   // property
        {
            get { return outputMlNetModelFilePath; }

        }
        public string MlInputDataFilePath   // property
        {
            get { return mlInputDataFilePath; }

        }
        private static string imageClassifierModelZipFilePath;

        private static IDataView trainDataView, testDataView;
        private static MLContext mlContext;
        static List<ImageClassificationTrainer.ImageClassificationMetrics> metricsStr =
            new List<ImageClassificationTrainer.ImageClassificationMetrics>();

        static BsonArray bsonMetrics = new BsonArray();

        public MlModel()
        {
            UseLocalDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);
        }
        FileStream ostrm;
        StreamWriter writer;
        TextWriter oldOut;
        private void openConsoleToFile(string outFile)
        {
            oldOut = Console.Out;
            try
            {
                //ostrm = new FileStream("./Redirect.txt", FileMode.OpenOrCreate, FileAccess.Write);
                ostrm = new FileStream(outFile, FileMode.OpenOrCreate, FileAccess.Write);
                writer = new StreamWriter(ostrm);
                Console.SetOut(writer);
            }
            catch (Exception e)
            {
                Console.WriteLine("Cannot open Redirect.txt for writing");
                Console.WriteLine(e.Message);
                return;
            }
        }

        private void closeConsoleToFile()
        {
            Console.SetOut(oldOut);
            writer.Close();
            ostrm.Close();
        }
        public string getMetrics(string? modelFile, string dataFile)
        {

            var modelName = modelFile;
            string metricsFile = Path.Combine(outputMlNetModelFilePath, dataFile, modelFile) + ".json.dat";

            FileInfo fi = new FileInfo(metricsFile);

            if (!fi.Exists)
                return "Error. Metrics file: " + metricsFile;

            using (StreamReader r = new StreamReader(metricsFile))
            {
                string json = r.ReadToEnd().Trim();
                var bson = BsonSerializer.Deserialize<BsonArray>(json);

                var best = bson.Where(w => (w as BsonDocument).Contains("BestMicroA")).Select(s => s).FirstOrDefault();

                if (best == null)
                    return "Error. Element ==> bestMicroA does not exist...";

                //var clsReport = (best as BsonDocument)["Classification Report"] as ;
                //var clsNames = clsReport.

                var result = (best as BsonDocument).Add("model", modelName);

                var tA = (result["Train Accuracy"] as BsonArray).Select(s => Math.Round(s.ToDouble(), 3)).ToList();
                result["Train Accuracy"] = new BsonArray(tA);

                result["TrainAccuracy"] = tA.Max();

                var vA = (result["Validation Accuracy"] as BsonArray).Select(s => Math.Round(s.ToDouble(), 3)).ToList();
                result["Validation Accuracy"] = new BsonArray(vA);

                result["ValidationAccuracy"] = vA.Max();


                var lR = (result["Learning Rate"] as BsonArray).Select(s => Math.Round(s.ToDouble(), 6)).ToList();
                result["Learning Rate"] = new BsonArray(lR);

                var tE = (result["TrainCrossEntropy"] as BsonArray).Select(s => Math.Round(s.ToDouble(), 3)).ToList();
                result["TrainCrossEntropy"] = new BsonArray(tE);

                var vE = (result["ValidationCrossEntropy"] as BsonArray).Select(s => Math.Round(s.ToDouble(), 3)).ToList();
                result["ValidationCrossEntropy"] = new BsonArray(vE);





                var lloss = (result["perclassLogLoss"] as BsonArray).Select(s => cutS(s.ToString())).ToList();

                result["perclassLogLoss"] = new BsonArray(lloss);



                char[] splits = new char[] { '\r', '\n' };
                var m = result["confusionMatrix"].ToString().Replace("||", "|")
                    .Split(splits, StringSplitOptions.RemoveEmptyEntries)
                    .Skip(1)
                    .Where(w => w.ToString().Contains("==") == false)
                    .Select(s => makeBson(s)).ToList();

                //var vls = m.Select(s=> s as BsonDocument)
                var header = m.FirstOrDefault().ToList();
                header.Add("LogLoss");


                int nmb = 0;

                var precision = m.LastOrDefault().ToArray();
                var vs = m.Take(m.Count - 1);
                var classes = vs.Skip(1).Select(s => s.FirstOrDefault().ToString()).ToList();
                var recall = vs.Skip(1).Select(s => s.LastOrDefault().ToString()).ToList();

                var clsVals = vs.Skip(1).Select(s => makeClassValues(s)).ToList();
                var maxmax = clsVals.Select(s => s["max"]).Max().ToInt32();

                var grdValues = clsVals.Select(s => makeGradient(s, maxmax)).ToList();

                var cfm = new BsonDocument();
                cfm.Add("header", new BsonArray(header));
                cfm.Add("classes", new BsonArray(classes));

                cfm.Add("recall", new BsonArray(recall));
                cfm.Add("precision", new BsonArray(precision));
                cfm.Add("data", new BsonArray(grdValues));


                result["confusionMatrix"] = cfm;


                BsonDocument models = new BsonDocument();
                models.Add("Action", "setMetrics");


                models.Add("Message", result);

                var strJ = result.ToJson();

                return models.ToJson();




            }

        }

        private BsonArray makeGradient(BsonDocument sData, int maxmax)
        {
            double den = (double)maxmax;
            var vls = (sData["data"] as BsonArray)
                .Select(ss => (ss.ToString() + "-" + Math.Round(ss.ToDouble() / den, 2))).ToList();

            return new BsonArray(vls);
        }

        private BsonDocument makeClassValues(BsonArray s)
        {
            int n = 0;
            var valA = s.Skip(1).Where(w => int.TryParse(w.ToString(), out n))
            .Select(s => int.Parse(s.ToString()))
            .ToList();
            var max = valA.Max();

            var r = new BsonDocument();
            r.Add("max", max);
            r.Add("data", new BsonArray(valA));

            return r;
        }

        private BsonArray makeBson(string dataStr)
        {

            var s = dataStr.Replace("PREDICTED", "Class").Split('|', StringSplitOptions.RemoveEmptyEntries);
            var data = s.Select(s => cutS(s)).ToList();
            return new BsonArray(data);

        }

        private string cutS(string s)
        {
            s = s.Trim();
            if (s.StartsWith("0.") && s.Length >= 6)
            {

                var p = double.TryParse(s, out var v);
                if (p)
                    s = Math.Round(v, 3).ToString();
            }
            return s;
        }


        public void TrainModel(BsonDocument paths)
        {

            metricsStr.Clear();


            //trainDataView = null;

            string? dataSetPath = paths["Data"].ToString();
            string? modelPath = paths["Model"].ToString();

            var dte = DateTime.Now.ToString("yyyy MM dd HH:mm:ss");

            string zPath = Path.Combine(outputMlNetModelFilePath, dataSetPath);

            if (!Directory.Exists(zPath))
            {
                Directory.CreateDirectory(zPath);
            }
            var commP = Path.Combine(zPath, modelPath);
            var zipPath = commP + ".zip";
            var pbPath = commP + ".pb";

            var tempFldr = removeDirPath(outputMlNetModelFilePath);
            var dsetP = Path.Combine(tempFldr, "ML_Dataset", dataSetPath, @"Data\train");


            var dss = outputMlNetModelFilePath.Split('/');
            var sp = dss.Take(dss.Length - 1).ToList();
            sp.AddRange(new string[] { "ML_Dataset", dataSetPath, @"Data\train" });

            var dsetPath = String.Join(@"\", sp);

            var writePath = Path.Combine(outputMlNetModelFilePath, modelPath) + " - " + dte.Replace(":", "_") + ".log";
            //var writePath = tmpW + ".log";//fi.FullName.Replace(fi.Extension, tmpW);

            openConsoleToFile(writePath);
            Console.WriteLine("Train Started: {0}", dte);

            //Console.WriteLine("Hello, World!");
            Console.OutputEncoding = Encoding.UTF8;

            //DownloadDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);
            //UseLocalDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);

            mlContext = new MLContext(seed: null);

            // Specify MLContext Filter to only show feedback log/traces about ImageClassification
            // This is not needed for feedback output if using the explicit MetricsCallback parameter
            mlContext.Log += FilterMLContextLog;

            var localFolds = 10;
            var Epoch = 100;
            var testFraction = 0.3;
            List<TrainedData> trainData = new List<TrainedData>();
            int iteration = 0;
            do
            {

                var dataSet = PrepareDataset_(dsetP, testFraction, iteration);
                var tst = dataSet["Test"].ToBsonDocument();
                var strDS = dataSet.ToJson();
                bsonMetrics.Clear();

                var pipeline = CreatePipeline(modelPath, Epoch);

                // 6. Train/create the ML model
                Console.WriteLine("***");
                Console.WriteLine("*** Training the image classification model with DNN Transfer Learning on top of the selected pre-trained model/architecture ***");

                // Measuring training time
                Stopwatch watch = Stopwatch.StartNew();

                //Train
                ITransformer trnedModel = pipeline.Fit(trainDataView);


                watch.Stop();


                long elapsedMs = watch.ElapsedMilliseconds;

                Console.WriteLine($"Training with transfer learning took: {elapsedMs / 1000} seconds");
                //trainedModel.
                // 7. Get the quality metrics (accuracy, etc.)

                var bson = bsonMetrics.Count;
                //bsonMetrics.Reverse();
                var valBson = bsonMetrics
                    .Where(w => w["Train"]["DatasetUsed"] == 1)
                    .Select(s => s)
                    .LastOrDefault();



                //var maxBson = trainData.MaxBy(m => m.Accuracy);


                //$$$$$$
                var mts = EvaluateModel(mlContext, testDataView, trnedModel, tst);


                var rst = new TrainedData(iteration, new BsonArray(bsonMetrics), trnedModel);
                //rst.TrainDatasetCount = GetSizeIDataView(trainDataView).Count;
                //rst.TestDatasetCount = GetSizeIDataView(testDataView).Count;
                rst.TestFraction = testFraction;
                rst.Metrics = new BsonDocument(mts);
                rst.DataSet = dataSet;

                //maxBson.Data.Add(mts);
                trainData.Add(rst);
                iteration++;

            } while (--localFolds > 0);

            //ITransformer trainedModel = maxBson.Model;
            var bestMicroA = trainData.MaxBy(m => m.Metrics["microA"]);

            bestMicroA.Metrics.Add("BestMicroA", true);

            ITransformer trainedModel = bestMicroA.Model;



            // Extract trained model parameters

            // 8. Save the model to assets/outputs (You get ML.NET .zip model file and TensorFlow .pb model file)
            // if (!Directory.Exists(outputMlNetModelFilePath))
            // {
            //     Directory.CreateDirectory(outputMlNetModelFilePath);
            // }

            mlContext.Model.Save(trainedModel, trainDataView.Schema, pbPath);
            mlContext.Model.Save(trainedModel, trainDataView.Schema, zipPath);
            Console.WriteLine($"Model saved to: {pbPath}");

            // 9. Try a single prediction simulating an end-user app
            //TrySinglePrediction(imagesFolderPathForPredictions, mlContext, trainedModel);

            //Console.WriteLine("Press any key to finish");
            Console.WriteLine("Train END: {0}", DateTime.Now.ToString("yyyy MM dd HH:mm:ss"));
            var cnt = metricsStr.Count;
            closeConsoleToFile();
            Console.WriteLine("");
            Console.WriteLine("*******");
            Console.WriteLine("Train END: {0}", DateTime.Now.ToString("yyyy MM dd HH:mm:ss"));

            Console.WriteLine("*******");
            Console.WriteLine("");
            cnt = bsonMetrics.Count;

            PrintJson(trainData, pbPath);
        }

        public string removeDirPath(string path, int cnt = 1)
        {
            var directorySeparatorChar = Path.DirectorySeparatorChar;

            var dirs = path
                    .Split(directorySeparatorChar, StringSplitOptions.RemoveEmptyEntries);

            var dp = dirs.Take(dirs.Count() - cnt).Aggregate(Path.Combine);

            return dp;
        }
        public void PrintJson(List<TrainedData> data, string jsonFile)
        {

            FileInfo fi = new FileInfo(jsonFile);
            var jsonPath = jsonFile.Replace(fi.Extension, ".json.dat");

            var bsonResults = new BsonArray();
            foreach (var e in data)
            {
                var index = e.Iteration;


                var dataArray = e.Data;

                var Epoch = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 0)
                    .Select(s => s["Train"]["Epoch"]).ToList();


                var Learning = e.Data
                     .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 0)
                     .Select(s => s["Train"]["LearningRate"]).ToList();

                var TrainCross = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 0)
                    .Select(s => s["Train"]["CrossEntropy"]).ToList();
                var TrainAccuracy = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 0)
                    .Select(s => s["Train"]["Accuracy"]).ToList();

                var TrainBatch = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 0)
                    .Select(s => s["Train"]["BatchProcessedCount"]).Distinct().ToList();

                var ValCross = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 1)
                    .Select(s => s["Train"]["CrossEntropy"]).ToList();

                var ValAccuracy = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 1)
                    .Select(s => s["Train"]["Accuracy"]).ToList();

                var ValBatch = e.Data
                    .Where(w => (w as BsonDocument).Contains("Train") && w["Train"]["DatasetUsed"] == 1)
                    .Select(s => s["Train"]["BatchProcessedCount"]).Distinct().ToList();

                var trainAccuracy = TrainAccuracy.Max().ToDouble();
                var valAccuracy = ValAccuracy.Max().ToDouble();

                var bResults = new BsonDocument();
                bResults.Add("Iteration", index);

                bResults.Add("TrainAccuracy", trainAccuracy);
                bResults.Add("ValidationAccuracy", valAccuracy);
                //bResults.Add("TrainDatasetCount", e.TrainDatasetCount);
                //bResults.Add("TestDatasetCount", e.TestDatasetCount);
                bResults.Add("TestFraction", e.TestFraction);
                bResults.Add("EpochCount", Epoch.Count);
                bResults.Add("DataSet", e.DataSet);


                bResults.Add("Epoch", new BsonArray(Epoch));
                bResults.Add("Learning Rate", new BsonArray(Learning));
                bResults.Add("Train Accuracy", new BsonArray(TrainAccuracy));
                bResults.Add("TrainCrossEntropy", new BsonArray(TrainCross));
                bResults.Add("Training Batch", TrainBatch[0]);


                bResults.Add("Validation Accuracy", new BsonArray(ValAccuracy));
                bResults.Add("ValidationCrossEntropy", new BsonArray(ValCross));
                bResults.Add("Validation Batch", ValBatch[0]);

                var metrics = e.Metrics;
                // e.Data
                // .Where(w => (w as BsonDocument).Contains("metrics"))
                // .Select(s => s["metrics"] as BsonDocument).FirstOrDefault();

                if (metrics != null)
                {
                    var names = metrics.Names;
                    foreach (var n in names)
                    {
                        bResults.Add(n, metrics[n]);
                    }
                }

                bsonResults.add(bResults);
            }

            var json = bsonResults.ToJson();



            using (StreamWriter writer = new StreamWriter(jsonPath))
            {
                writer.WriteLine(json);

            }

            Console.WriteLine("^^");
            Console.WriteLine("*******");
            Console.WriteLine("JSON Data saved: {0}", DateTime.Now.ToString("yyyy MM dd HH:mm:ss"));

            Console.WriteLine("*******");
            Console.WriteLine("^^");

        }

        // public void TrainModel_(BsonDocument paths)
        // {

        //     metricsStr.Clear();
        //     //trainDataView = null;

        //     string? dataSetPath = paths["Data"].ToString();
        //     string? modelPath = paths["Model"].ToString();

        //     var dte = DateTime.Now.ToString("yyyy MM dd HH:mm:ss");
        //     string pbPath = outputMlNetModelFilePath + modelPath;
        //     FileInfo fi = new FileInfo(pbPath);
        //     string zipPath = fi.FullName.Replace(fi.Extension, ".zip");

        //     //cacheFilePath = fi.FullName.Replace(fi.Extension, ".csv");
        //     var tmpW = " - " + dte.Replace(":", "_") + ".log";
        //     var writePath = fi.FullName.Replace(fi.Extension, tmpW);

        //     openConsoleToFile(writePath);
        //     Console.WriteLine("Train Started: {0}", dte);

        //     //Console.WriteLine("Hello, World!");
        //     Console.OutputEncoding = Encoding.UTF8;

        //     //DownloadDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);
        //     UseLocalDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);

        //     mlContext = new MLContext(seed: null);

        //     // Specify MLContext Filter to only show feedback log/traces about ImageClassification
        //     // This is not needed for feedback output if using the explicit MetricsCallback parameter
        //     mlContext.Log += FilterMLContextLog;

        //     trainDataView = PrepareDataset(dataSetPath);

        //     var trainCnt = GetSizeIDataView(trainDataView);
        //     //var testCnt = (int)(trainCnt * 0.1) + 1;

        //     var tstPath = dataSetPath.Replace("/train", "/test");

        //     //testDataView = PrepareDataset(tstPath, testCnt);

        //     //var tstC = GetSizeIDataView(testDataView);


        //     var pipeline = CreatePipeline(modelPath, 0);

        //     // 6. Train/create the ML model
        //     Console.WriteLine("*** Training the image classification model with DNN Transfer Learning on top of the selected pre-trained model/architecture ***");

        //     // Measuring training time
        //     Stopwatch watch = Stopwatch.StartNew();

        //     //Train
        //     ITransformer trainedModel = pipeline.Fit(trainDataView);


        //     //    ImageClassificationModelParameters originalParameters = ((ISingleFeaturePredictionTransformer<object>)trainedModel).Model as ImageClassificationModelParameters;

        //     watch.Stop();

        //     //$$$$$$$$$$
        //     //var crossV = mlContext.MulticlassClassification.CrossValidate(trainDataView, pipeline);

        //     // Select all models
        //     // ITransformer[] models = ////$$$$$
        //     //     crossV
        //     //         .OrderByDescending(fold => fold.Metrics.MicroAccuracy)
        //     //         .Select(fold => fold.Model)
        //     //         .ToArray();

        //     // trainedModel = models[0];

        //     long elapsedMs = watch.ElapsedMilliseconds;

        //     Console.WriteLine($"Training with transfer learning took: {elapsedMs / 1000} seconds");

        //     // 7. Get the quality metrics (accuracy, etc.)


        //     //EvaluateModel(mlContext, testDataView, trainedModel);

        //     // Extract trained model parameters

        //     // 8. Save the model to assets/outputs (You get ML.NET .zip model file and TensorFlow .pb model file)
        //     if (!Directory.Exists(outputMlNetModelFilePath))
        //     {
        //         Directory.CreateDirectory(outputMlNetModelFilePath);
        //     }


        //     mlContext.Model.Save(trainedModel, trainDataView.Schema, pbPath);
        //     mlContext.Model.Save(trainedModel, trainDataView.Schema, zipPath);
        //     Console.WriteLine($"Model saved to: {pbPath}");

        //     // 9. Try a single prediction simulating an end-user app
        //     //TrySinglePrediction(imagesFolderPathForPredictions, mlContext, trainedModel);

        //     //Console.WriteLine("Press any key to finish");
        //     Console.WriteLine("Train END: {0}", DateTime.Now.ToString("yyyy MM dd HH:mm:ss"));
        //     var cnt = metricsStr.Count;
        //     closeConsoleToFile();
        // }


        public string GetAbsolutePath(string relativePath)
            => FileUtils.GetAbsolutePath(typeof(Program).Assembly, relativePath);

        private static IEnumerable<ImageData> LoadImagesFromDirectory(string folder, bool useFolderNameAsLabel = true)
            => FileUtils.LoadImagesFromDirectory(folder, useFolderNameAsLabel)
                .Select(x => new ImageData(x.imagePath, x.label));

        private IEnumerable<ImageData2> LoadImagesFromDirectory2(string folder, bool useFolderNameAsLabel = true)
            => FileUtils.LoadImagesFromDirectory(folder, useFolderNameAsLabel)
                .Select(x => new ImageData2(x.imagePath, x.label));


        private void UseLocalDataset_(out string outputMlNetModelFilePath, out string imagesFolderPathForPredictions, out string fullImagesetFolderPath)
        {
            const string assetsRelativePath = @"..\..\assets";
            string assetsPath = GetAbsolutePath(assetsRelativePath);//.Replace("..\..\..\","");
            outputMlNetModelFilePath = Path.Combine(assetsPath, "outputs", "imageClassifier_New.pb");
            outputMlNetModelFilePathZip = Path.Combine(assetsPath, "outputs", "imageClassifier_New.zip");
            imagesFolderPathForPredictions = Path.Combine(assetsPath, "inputs", "predictions");
            fullImagesetFolderPath = Path.Combine(assetsPath, "inputs", "img");
            imageClassifierModelZipFilePath = outputMlNetModelFilePathZip;
        }
        private void UseLocalDataset(out string outputMlNetModelFilePath, out string imagesFolderPathForPredictions, out string fullImagesetFolderPath)
        {
            const string assetsRelativePath = @"..\..\..\assets";
            string assetsPath = GetAbsolutePath(assetsRelativePath);//.Replace("..\..\..\","");
            outputMlNetModelFilePath = Path.Combine(assetsPath, "ML_Model");
            //outputMlNetModelFilePathZip = Path.Combine(assetsPath, "ML_Model");
            imagesFolderPathForPredictions = Path.Combine(assetsPath, "inputs", "predictions");
            fullImagesetFolderPath = Path.Combine(assetsPath, "inputs", "img");
            imageClassifierModelZipFilePath = outputMlNetModelFilePath;
            mlInputDataFilePath = Path.Combine(assetsPath, @"ML_InputData\");
        }

        private static void FilterMLContextLog(object sender, LoggingEventArgs e)
        {
            if (e.Message.StartsWith("[Source=ImageClassificationTrainer;"))
            {

                Console.WriteLine(e.Message);
            }
            if (e.Message.StartsWith("Phase: Training"))
            {

                var vl = e.Message;
            }

            if (e.Message.Contains("Accuracy:"))
            {
                Console.WriteLine(e.Message);
            }
            //Phase: Training
        }


        // private IDataView PrepareDataset(string? lastPath, int count)
        // {
        //     string finalPath = fullImagesetFolderPath + lastPath;



        //     // 2. Load the initial full image-set into an IDataView and shuffle so it'll be better balanced
        //     //IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: fullImagesetFolderPath, useFolderNameAsLabel: true);
        //     IEnumerable<ImageData> imgs = LoadImagesFromDirectory(folder: finalPath, useFolderNameAsLabel: true);

        //     Random r = new Random();
        //     var images = imgs.OrderBy(item => r.Next()).ToList();



        //     var grpImage = images.GroupBy(g => g.Label).ToList();

        //     var gCnt = grpImage.Count;
        //     var batch = (int)(count / gCnt);

        //     images.Clear();

        //     foreach (var grp in grpImage)
        //     {

        //         if (grp.Count() >= batch)
        //             images.AddRange(grp.Take(batch).ToList());
        //         else
        //             images.AddRange(grp);
        //     }



        //     // if (images.Count > count)
        //     //     images = images.Take(count).ToList();


        //     IDataView fullImagesDataset = mlContext.Data.LoadFromEnumerable(images);
        //     IDataView shuffledFullImageFilePathsDataset = mlContext.Data.ShuffleRows(fullImagesDataset);



        //     // 3. Load Images with in-memory type within the IDataView and Transform Labels to Keys (Categorical)

        //     //Action<InputData, OutputData> mapping =
        //     //    (input, output) => output.Image = input.Image1;

        //     // 3.1. Convert dataset to grayscale
        //     //IDataView grayScaleDataset = mlContext.Transforms.LoadImages(
        //     //                                    outputColumnName: "RawImage",
        //     //                                    imageFolder: fullImagesetFolderPath,
        //     //                                    inputColumnName: "ImagePath")
        //     //    .Append(mlContext.Transforms.ConvertToGrayscale("GrayImage", "RawImage"))
        //     //    .Append(mlContext.Transforms.ResizeImages(outputColumnName: "ResizedImage", inputColumnName: "GrayImage", imageHeight: 500, imageWidth: 500))
        //     //    .Append(mlContext.Transforms.ExtractPixels("Image", "ResizedImage"))
        //     //    .Fit(shuffledFullImageFilePathsDataset)
        //     //    .Transform(shuffledFullImageFilePathsDataset);

        //     //var _1 = mlContext.Data.CreateEnumerable<IDataViewClass2>(grayScaleDataset, false);
        //     //PrintEnumerable(_1);
        //     //SaveToFiles(_1, "_");

        //     // 3.2. Load original dataset
        //     IDataView dataset = mlContext.Transforms.LoadRawImageBytes(
        //                                         outputColumnName: "Image",
        //                                         //imageFolder: fullImagesetFolderPath,
        //                                         imageFolder: finalPath,
        //                                         inputColumnName: "ImagePath")
        //         .Fit(shuffledFullImageFilePathsDataset)
        //         .Transform(shuffledFullImageFilePathsDataset);

        //     //var _2 = mlContext.Data.CreateEnumerable<IDataViewClass>(dataset, false);
        //     //PrintEnumerable(_2);

        //     var shuffledFullImagesDataset = mlContext.Transforms.Conversion
        //         .MapValueToKey(outputColumnName: "LabelAsKey", inputColumnName: "Label", keyOrdinality: KeyOrdinality.ByValue)
        //         .Fit(dataset)
        //         .Transform(dataset);

        //     //int size = GetSizeIDataView(shuffledFullImagesDataset);

        //     // 4. Split the data 80:20 into train and test sets, train and evaluate.
        //     //TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: 0.2);

        //     Console.WriteLine("Split the data 70:30 into train and test sets, train and evaluate");

        //     TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: 0.001);

        //     //trainDataView = shuffledFullImagesDataset;

        //     /*trainDataView = trainTestData.TrainSet;
        //     testDataView = trainTestData.TestSet;


        //     var all = trainDataView.Schema.Append(testDataView.Schema.FirstOrDefault());

        //     var trnCount = trainDataView.Schema.Count;
        //     var tstCount = testDataView.Schema.Count;


        //     var fullSize = GetSizeIDataView(shuffledFullImagesDataset);
        //     var trainSize = GetSizeIDataView(trainDataView);
        //     var testSize = GetSizeIDataView(testDataView);

        //     */



        //     Console.WriteLine("ImgsCount--> " + images.Count());
        //     return trainTestData.TrainSet;
        // }
        // private IDataView PrepareDataset(string? lastPath)
        // {
        //     string finalPath = fullImagesetFolderPath + lastPath;


        //     // 2. Load the initial full image-set into an IDataView and shuffle so it'll be better balanced
        //     //IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: fullImagesetFolderPath, useFolderNameAsLabel: true);
        //     IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: finalPath, useFolderNameAsLabel: true);
        //     IDataView fullImagesDataset = mlContext.Data.LoadFromEnumerable(images);
        //     IDataView shuffledFullImageFilePathsDataset = mlContext.Data.ShuffleRows(fullImagesDataset);


        //     // 3. Load Images with in-memory type within the IDataView and Transform Labels to Keys (Categorical)

        //     //Action<InputData, OutputData> mapping =
        //     //    (input, output) => output.Image = input.Image1;

        //     // 3.1. Convert dataset to grayscale
        //     //IDataView grayScaleDataset = mlContext.Transforms.LoadImages(
        //     //                                    outputColumnName: "RawImage",
        //     //                                    imageFolder: fullImagesetFolderPath,
        //     //                                    inputColumnName: "ImagePath")
        //     //    .Append(mlContext.Transforms.ConvertToGrayscale("GrayImage", "RawImage"))
        //     //    .Append(mlContext.Transforms.ResizeImages(outputColumnName: "ResizedImage", inputColumnName: "GrayImage", imageHeight: 500, imageWidth: 500))
        //     //    .Append(mlContext.Transforms.ExtractPixels("Image", "ResizedImage"))
        //     //    .Fit(shuffledFullImageFilePathsDataset)
        //     //    .Transform(shuffledFullImageFilePathsDataset);

        //     //var _1 = mlContext.Data.CreateEnumerable<IDataViewClass2>(grayScaleDataset, false);
        //     //PrintEnumerable(_1);
        //     //SaveToFiles(_1, "_");

        //     // 3.2. Load original dataset
        //     IDataView dataset = mlContext.Transforms.LoadRawImageBytes(
        //                                         outputColumnName: "Image",
        //                                         //imageFolder: fullImagesetFolderPath,
        //                                         imageFolder: finalPath,
        //                                         inputColumnName: "ImagePath")
        //         .Fit(shuffledFullImageFilePathsDataset)
        //         .Transform(shuffledFullImageFilePathsDataset);

        //     //var _2 = mlContext.Data.CreateEnumerable<IDataViewClass>(dataset, false);
        //     //PrintEnumerable(_2);

        //     var shuffledFullImagesDataset = mlContext.Transforms.Conversion
        //         .MapValueToKey(outputColumnName: "LabelAsKey", inputColumnName: "Label", keyOrdinality: KeyOrdinality.ByValue)
        //         .Fit(dataset)
        //         .Transform(dataset);

        //     //int size = GetSizeIDataView(shuffledFullImagesDataset);

        //     // 4. Split the data 80:20 into train and test sets, train and evaluate.
        //     //TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: 0.2);

        //     Console.WriteLine("Split the data 70:30 into train and test sets, train and evaluate");

        //     TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: 0.001);

        //     //trainDataView = shuffledFullImagesDataset;
        //     /*
        //     trainDataView = trainTestData.TrainSet;
        //     testDataView = trainTestData.TestSet;


        //     var trnCount = trainDataView.Schema.Count;
        //     var tstCount = testDataView.Schema.Count;


        //     var fullSize = GetSizeIDataView(shuffledFullImagesDataset);
        //     var trainSize = GetSizeIDataView(trainDataView);
        //     var testSize = GetSizeIDataView(testDataView);

        //     */
        //     Console.WriteLine("ImgsCount--> " + images.Count());

        //     return trainTestData.TrainSet;
        // }

        private BsonDocument PrepareDataset_(string? lastPath, double testfraction, int iteration)
        {
            // string finalPath = fullImagesetFolderPath + lastPath;
            string finalPath = lastPath;


            // 2. Load the initial full image-set into an IDataView and shuffle so it'll be better balanced
            //IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: fullImagesetFolderPath, useFolderNameAsLabel: true);
            IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: finalPath, useFolderNameAsLabel: true);
            IDataView fullImagesDataset = mlContext.Data.LoadFromEnumerable(images);
            IDataView shuffledFullImageFilePathsDataset = mlContext.Data.ShuffleRows(fullImagesDataset);


            // 3. Load Images with in-memory type within the IDataView and Transform Labels to Keys (Categorical)

            //Action<InputData, OutputData> mapping =
            //    (input, output) => output.Image = input.Image1;

            // 3.1. Convert dataset to grayscale
            //IDataView grayScaleDataset = mlContext.Transforms.LoadImages(
            //                                    outputColumnName: "RawImage",
            //                                    imageFolder: fullImagesetFolderPath,
            //                                    inputColumnName: "ImagePath")
            //    .Append(mlContext.Transforms.ConvertToGrayscale("GrayImage", "RawImage"))
            //    .Append(mlContext.Transforms.ResizeImages(outputColumnName: "ResizedImage", inputColumnName: "GrayImage", imageHeight: 500, imageWidth: 500))
            //    .Append(mlContext.Transforms.ExtractPixels("Image", "ResizedImage"))
            //    .Fit(shuffledFullImageFilePathsDataset)
            //    .Transform(shuffledFullImageFilePathsDataset);

            //var _1 = mlContext.Data.CreateEnumerable<IDataViewClass2>(grayScaleDataset, false);
            //PrintEnumerable(_1);
            //SaveToFiles(_1, "_");

            // 3.2. Load original dataset
            IDataView dataset = mlContext.Transforms.LoadRawImageBytes(
                                                outputColumnName: "Image",
                                                //imageFolder: fullImagesetFolderPath,
                                                imageFolder: finalPath,
                                                inputColumnName: "ImagePath")
                .Fit(shuffledFullImageFilePathsDataset)
                .Transform(shuffledFullImageFilePathsDataset);

            //var _2 = mlContext.Data.CreateEnumerable<IDataViewClass>(dataset, false);
            //PrintEnumerable(_2);

            var shuffledFullImagesDataset = mlContext.Transforms.Conversion
                    .MapValueToKey(outputColumnName: "LabelAsKey", inputColumnName: "Label", keyOrdinality: KeyOrdinality.ByValue)
                    .Fit(dataset)
                    .Transform(dataset);


            var dsetname = lastPath.Split(Path.DirectorySeparatorChar).TakeLast(3).FirstOrDefault();

            long allSize = 0;
            var labll = dsetname + " All Dataset Images";

            if (iteration > 0)
                labll = "";
            var allA = parseClasses(shuffledFullImagesDataset, out allSize, labll);

            //all.Add("size", cntt);


            // 4. Split the data 80:20 into train and test sets, train and evaluate.
            //TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: 0.2);

            Console.WriteLine("Split the data 70:30 into train and test sets, train and evaluate");

            TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: testfraction);

            //trainDataView = shuffledFullImagesDataset;

            trainDataView = trainTestData.TrainSet;
            testDataView = trainTestData.TestSet;

            long trainSize = 0;
            long testSize = 0;
            var trainS = parseClasses(trainDataView, out trainSize, dsetname + " TRAIN Dataset Images");

            var testS = parseClasses(testDataView, out testSize, dsetname + " TEST Dataset Images");


            BsonDocument dset = new BsonDocument();

            dset.Add("Train", trainS);
            dset.Add("Test", testS);
            dset.Add("Total", allA);
            // dset.Add("AllSize", (int) allSize);
            // dset.Add("TrainSize", (int)trainSize);
            // dset.Add("TestSize", (int)testSize);


            // var trnCount = trainDataView.Schema.Count;
            // var tstCount = testDataView.Schema.Count;


            // var fullSize = GetSizeIDataView(shuffledFullImagesDataset);
            // var trainSize = GetSizeIDataView(trainDataView);
            // var testSize = GetSizeIDataView(testDataView);


            Console.WriteLine("ImgsCount--> " + images.Count());

            return dset;
        }

        private BsonDocument parseClasses(IDataView dataSet, out long size, string dataSetName)
        {
            size = 0;

            var allData = GetSizeIDataView(dataSet, out size)
                .Select(s => new { name = s.Split(':').FirstOrDefault(), path = s.Split(':').LastOrDefault() })
                .GroupBy(g => g.name)
                .OrderBy(o => o.Key);

            int cnt = allData.Select(s => s.Count()).Sum();

            var bSonDoc = new BsonDocument();

            foreach (var v in allData)
                bSonDoc.Add(v.Key, v.Count());

            bSonDoc.Add("Total", cnt);
            var ss = Math.Round((double)(size / 1000000.0), 2);
            bSonDoc.Add("Size", ss);

            var t1 = "     ";

            if (dataSetName.Length > 0)
            {
                Console.WriteLine(dataSetName);
                foreach (var v in allData)
                {
                    Console.WriteLine("\n" + t1 + v.Key + " (" + v.Count() + ")");
                    foreach (var p in v)
                        Console.WriteLine(t1 + t1 + p.path);
                }
            }
            //allData.Select(s=> writeLine(s));

            return bSonDoc;
        }

        // private object writeLine(IGrouping<string, object> s)
        // {
        //      Console.WriteLine("\t" + s.Key);
        //      foreach( var v in s){
        //         Console.WriteLine("\t\t" + s);
        //      }
        //        Select(w=> Console.WriteLine("\t" + w));
        // }


        private void PrepareDataset()
        {
            // 2. Load the initial full image-set into an IDataView and shuffle so it'll be better balanced
            IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: fullImagesetFolderPath, useFolderNameAsLabel: true);
            IDataView fullImagesDataset = mlContext.Data.LoadFromEnumerable(images);
            IDataView shuffledFullImageFilePathsDataset = mlContext.Data.ShuffleRows(fullImagesDataset);

            // 3. Load Images with in-memory type within the IDataView and Transform Labels to Keys (Categorical)

            //Action<InputData, OutputData> mapping =
            //    (input, output) => output.Image = input.Image1;

            // 3.1. Convert dataset to grayscale
            //IDataView grayScaleDataset = mlContext.Transforms.LoadImages(
            //                                    outputColumnName: "RawImage",
            //                                    imageFolder: fullImagesetFolderPath,
            //                                    inputColumnName: "ImagePath")
            //    .Append(mlContext.Transforms.ConvertToGrayscale("GrayImage", "RawImage"))
            //    .Append(mlContext.Transforms.ResizeImages(outputColumnName: "ResizedImage", inputColumnName: "GrayImage", imageHeight: 500, imageWidth: 500))
            //    .Append(mlContext.Transforms.ExtractPixels("Image", "ResizedImage"))
            //    .Fit(shuffledFullImageFilePathsDataset)
            //    .Transform(shuffledFullImageFilePathsDataset);

            //var _1 = mlContext.Data.CreateEnumerable<IDataViewClass2>(grayScaleDataset, false);
            //PrintEnumerable(_1);
            //SaveToFiles(_1, "_");

            // 3.2. Load original dataset
            IDataView dataset = mlContext.Transforms.LoadRawImageBytes(
                                                outputColumnName: "Image",
                                                imageFolder: fullImagesetFolderPath,
                                                inputColumnName: "ImagePath")
                .Fit(shuffledFullImageFilePathsDataset)
                .Transform(shuffledFullImageFilePathsDataset);

            //var _2 = mlContext.Data.CreateEnumerable<IDataViewClass>(dataset, false);
            //PrintEnumerable(_2);

            var shuffledFullImagesDataset = mlContext.Transforms.Conversion
                .MapValueToKey(outputColumnName: "LabelAsKey", inputColumnName: "Label", keyOrdinality: KeyOrdinality.ByValue)
                .Fit(dataset)
                .Transform(dataset);

            //int size = GetSizeIDataView(shuffledFullImagesDataset);

            // 4. Split the data 80:20 into train and test sets, train and evaluate.
            TrainTestData trainTestData = mlContext.Data.TrainTestSplit(shuffledFullImagesDataset, testFraction: 0.2);
            trainDataView = trainTestData.TrainSet;
            testDataView = trainTestData.TestSet;

            Console.WriteLine("ImgsCount--> " + images.Count());

        }

        private static EstimatorChain<KeyToValueMappingTransformer> CreatePipeline(string? model, int epochs)
        {

            var arquitecture = Microsoft.ML.Vision.ImageClassificationTrainer.Architecture.InceptionV3;

            switch (model)
            {
                case "ResnetV250":
                    arquitecture = Microsoft.ML.Vision.ImageClassificationTrainer.Architecture.ResnetV250;
                    break;
                case "InceptionV3":
                    arquitecture = Microsoft.ML.Vision.ImageClassificationTrainer.Architecture.InceptionV3;
                    break;
                case "ResnetV2101":
                    arquitecture = Microsoft.ML.Vision.ImageClassificationTrainer.Architecture.ResnetV2101;
                    break;
                case "MobilenetV2":
                    arquitecture = Microsoft.ML.Vision.ImageClassificationTrainer.Architecture.MobilenetV2;
                    break;

            }
            // 5. Define the model's training pipeline using DNN default values
            //
            // EstimatorChain<KeyToValueMappingTransformer> pipeline = mlContext.MulticlassClassification.Trainers
            //     .ImageClassification(featureColumnName: "Image",
            //                              labelColumnName: "LabelAsKey",
            //                              validationSet: testDataView)
            //     .Append(mlContext.Transforms.Conversion.MapKeyToValue(outputColumnName: "PredictedLabel",
            //                                                           inputColumnName: "PredictedLabel"));

            // 5.1 (OPTIONAL) Define the model's training pipeline by using explicit hyper-parameters
            //
            var options = new Microsoft.ML.Vision.ImageClassificationTrainer.Options()
            {
                FeatureColumnName = "Image",
                LabelColumnName = "LabelAsKey",
                // Just by changing/selecting InceptionV3/MobilenetV2/ResnetV250  
                // you can try a different DNN architecture (TensorFlow pre-trained model). 
                //Arch = Microsoft.ML.Vision.ImageClassificationTrainer.Architecture.InceptionV3,
                Arch = arquitecture,
                Epoch = epochs,       //100
                EarlyStoppingCriteria = null,
                BatchSize = 10,//was 10
                LearningRate = 0.005f, //default is 0.01
                //MetricsCallback = (metrics) => Console.WriteLine(metrics),
                MetricsCallback = (metrics) => writeMetrics(metrics),//Console.WriteLine(metrics),
                ValidationSet = testDataView
                //TrainSetBottleneckCachedValuesFileName = cacheFilePath
            };

            // var pat = options.EarlyStoppingCriteria.Patience;
            // var pat1 = options.EarlyStoppingCriteria.MinDelta;
            // var pat2 = options.LearningRate ;//= 20;


            var pipeline = mlContext.MulticlassClassification.Trainers.ImageClassification(options)
                   .Append(mlContext.Transforms.Conversion.MapKeyToValue(
                       outputColumnName: "PredictedLabel",
                       inputColumnName: "PredictedLabel"));



            return pipeline;
        }

        private static void writeMetrics(ImageClassificationTrainer.ImageClassificationMetrics metrics)
        {
            var mBson = metrics.ToBsonDocument();

            if (mBson["Train"] != BsonNull.Value)
                bsonMetrics.Add(mBson);

            Console.WriteLine(metrics);
            //metricsStr.Add(metrics);
            var jsonTrain = metrics.Train.ToJson();//.LearningRate = 0.5f;
            var jsonBottle = metrics.Bottleneck.ToJson();

            var name = metrics.ToJson();

        }

        private BsonDocument EvaluateModel(MLContext mlContext, IDataView testDataset, ITransformer trainedModel, BsonDocument testDS)
        {
            Console.WriteLine("Making predictions in bulk for evaluating model's quality...");

            //mlContext.MulticlassClassification.CrossValidate()
            // Measuring time
            Stopwatch watch = Stopwatch.StartNew();

            IDataView predictionsDataView = trainedModel.Transform(testDataset);


            //         var someRows = mlContext.Data
            // // Convert to an enumerable of user-defined type. 
            // .CreateEnumerable<IDataView>(predictionsDataView, reuseRowObject: false)
            // // Take a couple values as an array.
            // .Take(4).ToArray();

            Microsoft.ML.Data.MulticlassClassificationMetrics metrics = mlContext.MulticlassClassification.Evaluate(predictionsDataView, labelColumnName: "LabelAsKey", predictedLabelColumnName: "PredictedLabel");
            var mts = PrintMultiClassClassificationMetrics("TensorFlow DNN Transfer Learning", metrics, testDS);



            // var bsonMetrics = new BsonDocument();
            // bsonMetrics.Add("metrics", mts);

            //var json = metrics.ToJson();

            //metrics.
            //metrics.ConfusionMatrix.
            watch.Stop();
            long elapsed2Ms = watch.ElapsedMilliseconds;

            Console.WriteLine($"Predicting and Evaluation took: {elapsed2Ms / 1000} seconds");

            return mts;
        }

        private void TrySinglePrediction(string imagesFolderPathForPredictions, MLContext mlContext, ITransformer trainedModel)
        {
            // Create prediction function to try one prediction
            PredictionEngine<InMemoryImageData, ImagePrediction> predictionEngine = mlContext.Model
                .CreatePredictionEngine<InMemoryImageData, ImagePrediction>(trainedModel);

            IEnumerable<InMemoryImageData> testImages = FileUtils.LoadInMemoryImagesFromDirectory(
                imagesFolderPathForPredictions, false);
            Console.WriteLine();
            Console.WriteLine();
            foreach (InMemoryImageData imageToPredict in testImages)
            {
                showPredictionResults(predictionEngine, imageToPredict);

                // var labelBuffer = new VBuffer<ReadOnlyMemory<char>>();

                // predictionEngine.OutputSchema["Score"].Annotations.GetValue("SlotNames", ref labelBuffer);

                // var labels = labelBuffer.DenseValues().Select(l => l.ToString()).ToArray();


                // ImagePrediction prediction = predictionEngine.Predict(imageToPredict);


                // var classScores = labels.ToDictionary(
                //             l => l,
                //             l => (decimal)prediction.Score[Array.IndexOf(labels, l)]
                //             )
                //             .OrderByDescending(kv => kv.Value)
                //             .ToList();


                // Console.WriteLine(
                //     $"Image Filename : [{imageToPredict.ImageFileName}], " +
                //     $"Scores : [{string.Join(",", prediction.Score)}], " +
                //     $"Predicted Label : {prediction.PredictedLabel}");


            }
        }

        private BsonDocument showPredictionResults(PredictionEngine<InMemoryImageData, ImagePrediction> predictionEngine, InMemoryImageData imageToPredict)
        {
            var labelBuffer = new VBuffer<ReadOnlyMemory<char>>();
            predictionEngine.OutputSchema["Score"].Annotations.GetValue("SlotNames", ref labelBuffer);
            var labels = labelBuffer.DenseValues().Select(l => l.ToString()).ToArray();
            ImagePrediction prediction = predictionEngine.Predict(imageToPredict);
            var classScores = labels.ToDictionary(
                        l => l,
                        l => (decimal)prediction.Score[Array.IndexOf(labels, l)]
                        )
                        .OrderByDescending(kv => kv.Value)
                        //.Select(s=> new BsonDocument(s.Key, s.Value))
                        .ToList();
            var nBson = new BsonDocument("Class", "Prediction(%)");
            Console.WriteLine("== Model Results ==");
            Console.WriteLine("File Name: " + imageToPredict.ImageFileName);
            foreach (var result in classScores)
            {
                nBson.Add(result.Key, (double)result.Value);
                Console.WriteLine("\t% " + result.Value + ", ClassName: " + result.Key);
            }



            return nBson;//classScores.ToBsonDocument();//.ToJson();
            // Console.WriteLine(
            //     $"Image Filename : [{imageToPredict.ImageFileName}], " +
            //     $"Scores : [{string.Join(",", prediction.Score)}], " +
            //     $"Predicted Label : {prediction.PredictedLabel}");
        }

        public void predictFile()
        {
            //UseLocalDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);
            try
            {
                MLContext mlContext = new MLContext(seed: 1);

                Console.WriteLine($"Loading model from: {imageClassifierModelZipFilePath}");

                // Load the model
                ITransformer loadedModel = mlContext.Model.Load(imageClassifierModelZipFilePath, out DataViewSchema modelInputSchema);


                // Create prediction engine to try a single prediction (input = ImageData, output = ImagePrediction)
                PredictionEngine<InMemoryImageData, ImagePrediction> predictionEngine = mlContext.Model.CreatePredictionEngine<InMemoryImageData, ImagePrediction>(loadedModel);

                //Predict the first image in the folder
                System.Collections.Generic.IEnumerable<InMemoryImageData> imagesToPredict = FileUtils.LoadInMemoryImagesFromDirectory(imagesFolderPathForPredictions, false);

                InMemoryImageData imageToPredict = imagesToPredict.First();

                // Measure #1 prediction execution time.
                System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

                ImagePrediction prediction = predictionEngine.Predict(imageToPredict);

                // Stop measuring time.
                watch.Stop();
                long elapsedMs = watch.ElapsedMilliseconds;
                Console.WriteLine("First Prediction took: " + elapsedMs + "mlSecs");

                // Measure #2 prediction execution time.
                System.Diagnostics.Stopwatch watch2 = System.Diagnostics.Stopwatch.StartNew();

                ImagePrediction prediction2 = predictionEngine.Predict(imageToPredict);

                // Stop measuring time.
                watch2.Stop();
                long elapsedMs2 = watch2.ElapsedMilliseconds;
                Console.WriteLine("Second Prediction took: " + elapsedMs2 + "mlSecs");

                // Get the highest score and its index
                float maxScore = prediction.Score.Max();

                ////////
                // Double-check using the index
                int maxIndex = prediction.Score.ToList().IndexOf(maxScore);
                VBuffer<ReadOnlyMemory<char>> keys = default;
                predictionEngine.OutputSchema[3].GetKeyValues(ref keys);
                ReadOnlyMemory<char>[] keysArray = keys.DenseValues().ToArray();
                ReadOnlyMemory<char> predictedLabelString = keysArray[maxIndex];
                ////////

                showPredictionResults(predictionEngine, imageToPredict);

                // Console.WriteLine($"Image Filename : [{imageToPredict.ImageFileName}], " +
                //                   $"Predicted Label : [{prediction.PredictedLabel}], " +
                //                   $"Probability : [{maxScore}] "
                //                   );

                // //Predict all images in the folder
                // //
                // Console.WriteLine("");
                // Console.WriteLine("Predicting several images...");

                // foreach (InMemoryImageData currentImageToPredict in imagesToPredict)
                // {
                //     ImagePrediction currentPrediction = predictionEngine.Predict(currentImageToPredict);

                //     Console.WriteLine(
                //         $"Image Filename : [{currentImageToPredict.ImageFileName}], " +
                //         $"Predicted Label : [{currentPrediction.PredictedLabel}], " +
                //         $"Probability : [{currentPrediction.Score.Max()}]");
                // }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

        }


        public BsonDocument predictFile(string FileName, byte[] data, string model, string useDataSet)
        {
            var result = new BsonDocument();//= "Error";
            //UseLocalDataset(out outputMlNetModelFilePath, out imagesFolderPathForPredictions, out fullImagesetFolderPath);
            try
            {
                MLContext mlContext = new MLContext(seed: 1);
                InMemoryImageData imageToPredict = new InMemoryImageData(
                                    image: data,
                                    label: "ImageLabel",
                                    imageFileName: FileName);

                string trainedModelPath = Path.Combine(imageClassifierModelZipFilePath, useDataSet, model);

                Console.WriteLine($"Loading model from: {trainedModelPath}");

                // Load the model
                ITransformer loadedModel = mlContext.Model.Load(trainedModelPath, out DataViewSchema modelInputSchema);

                // var originalModelParameters =((ISingleFeaturePredictionTransformer<object>) loadedModel)   $$$$$$$
                //             .Model as LinearMulticlassModelParameters;

                // Create prediction engine to try a single prediction (input = ImageData, output = ImagePrediction)
                PredictionEngine<InMemoryImageData, ImagePrediction> predictionEngine = mlContext.Model.CreatePredictionEngine<InMemoryImageData, ImagePrediction>(loadedModel);

                //Predict the first image in the folder
                //System.Collections.Generic.IEnumerable<InMemoryImageData> imagesToPredict = FileUtils.LoadInMemoryImagesFromDirectory(imagesFolderPathForPredictions, false);

                //var imgP = imagesToPredict.First();
                // InMemoryImageData imageToPredict = imagesToPredict.First();

                // InMemoryImageData imageToPredict = new InMemoryImageData(
                //                     image: data,
                //                     label: "ImageLabel",
                //                     imageFileName: FileName);

                // Measure #1 prediction execution time.
                System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

                // ImagePrediction prediction = predictionEngine.Predict(imageToPredict);

                // // Stop measuring time.
                // watch.Stop();
                // long elapsedMs = watch.ElapsedMilliseconds;
                // Console.WriteLine("First Prediction took: " + elapsedMs + "mlSecs");

                // // Measure #2 prediction execution time.
                // System.Diagnostics.Stopwatch watch2 = System.Diagnostics.Stopwatch.StartNew();

                // ImagePrediction prediction2 = predictionEngine.Predict(imageToPredict);

                // // Stop measuring time.
                // watch2.Stop();
                // long elapsedMs2 = watch2.ElapsedMilliseconds;
                // Console.WriteLine("Second Prediction took: " + elapsedMs2 + "mlSecs");

                // // Get the highest score and its index
                // float maxScore = prediction.Score.Max();

                // ////////
                // // Double-check using the index
                // int maxIndex = prediction.Score.ToList().IndexOf(maxScore);
                // VBuffer<ReadOnlyMemory<char>> keys = default;
                // predictionEngine.OutputSchema[3].GetKeyValues(ref keys);
                // ReadOnlyMemory<char>[] keysArray = keys.DenseValues().ToArray();
                // ReadOnlyMemory<char> predictedLabelString = keysArray[maxIndex];
                // ////////

                result = showPredictionResults(predictionEngine, imageToPredict);



            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return result;
        }


        public List<string> GetSizeIDataView(IDataView idv, out long dataSetSize)
        {

            dataSetSize = 0;
            var elements = idv.Schema.Select(s => s).ToList();
            var labelColumn = idv.Schema["Label"];
            var imgPathColumn = idv.Schema["ImagePath"];
            var schema = idv.Schema;
            int rows = 0;
            var classes = new List<string>();
            using (var cursor = idv.GetRowCursor(schema))
            {
                ReadOnlyMemory<char> labelValue = default;
                ReadOnlyMemory<char> imgValue = default;

                var labelGetter = cursor
                    .GetGetter<ReadOnlyMemory<char>>(labelColumn);
                var pathGetter = cursor
                    .GetGetter<ReadOnlyMemory<char>>(imgPathColumn);

                //labelGetter(ref labelValue);//ToArray().ToList();
                while (cursor.MoveNext())
                {
                    labelGetter(ref labelValue);

                    pathGetter(ref imgValue);
                    var imgP = string.Join("", imgValue);
                    dataSetSize += getFileSize(imgP);

                    var name = imgP.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
                    var strV = string.Join("", labelValue);
                    strV += ":" + name;
                    classes.Add(strV);

                    rows++;

                }

            }

            return classes;
        }

        public BsonDocument PrintMultiClassClassificationMetrics(string name, MulticlassClassificationMetrics metrics, BsonDocument testDS)
        {
            Console.WriteLine($"************************************************************");
            Console.WriteLine($"*    Metrics for {name} multi-class classification model   ");
            Console.WriteLine($"*-----------------------------------------------------------");
            Console.WriteLine($"    AccuracyMacro = {metrics.MacroAccuracy:0.####}, a value between 0 and 1, the closer to 1, the better");
            Console.WriteLine($"    AccuracyMicro = {metrics.MicroAccuracy:0.####}, a value between 0 and 1, the closer to 1, the better");
            Console.WriteLine($"    LogLossReduction = {metrics.LogLossReduction:0.####}, the closer to 0, the better");
            Console.WriteLine($"    LogLoss = {metrics.LogLoss:0.####}, the closer to 0, the better");




            int i = 0;
            foreach (double classLogLoss in metrics.PerClassLogLoss)
            {
                i++;
                Console.WriteLine($"    LogLoss for class {i} = {classLogLoss:0.####}, the closer to 0, the better");
            }

            Console.WriteLine(metrics.ConfusionMatrix.GetFormattedConfusionTable());
            Console.WriteLine("ConfusionMatrix JSON");
            Console.WriteLine(metrics.ConfusionMatrix.ToJson());


            Console.WriteLine($"************************************************************");

            var formatedCM = metrics.ConfusionMatrix.GetFormattedConfusionTable();



            var mts = new BsonDocument();

            mts.Add("confusionMatrix", formatedCM);
            mts.Add("microA", Math.Round(metrics.MicroAccuracy, 3));
            mts.Add("macroA", Math.Round(metrics.MacroAccuracy, 3));
            mts.Add("perclassLogLoss", new BsonArray(metrics.PerClassLogLoss));
            mts.Add("logLoss", Math.Round(metrics.LogLoss, 3));
            mts.Add("logLossRed", Math.Round(metrics.LogLossReduction, 3));

            var prec = metrics.ConfusionMatrix.PerClassPrecision;
            var recall = metrics.ConfusionMatrix.PerClassRecall;

            var cnts = metrics.ConfusionMatrix.Counts;
            var clsCnt = metrics.ConfusionMatrix.NumberOfClasses;

            var enumX = Enumerable.Range(0, clsCnt);
            var enumY = Enumerable.Range(0, clsCnt);

            var rowPrecision = enumX.Select(x => enumY.Select(y => metrics.ConfusionMatrix.GetCountForClassPair(x, y)).Sum()).ToList();
            var sumRowPrecision = rowPrecision.Sum();
            var Support = enumX.Select(x => enumY.Select(y => metrics.ConfusionMatrix.GetCountForClassPair(y, x)).Sum()).ToList();

            var sumSupport = Support.Sum();

            //var rowPrecision = enumX.Zip(enumY,(x,y)=>metrics.ConfusionMatrix.GetCountForClassPair(x,y)).ToList();
            //var colRecall = enumX.Zip(enumY,(x,y)=>metrics.ConfusionMatrix.GetCountForClassPair(y,x)).ToList();

            var maxTP = enumX.Select(x => metrics.ConfusionMatrix.GetCountForClassPair(x, x)).ToList();
            var maxSum = maxTP.Sum();

            //var support = cnts.Select(s=> s.Sum()).ToList();
            //var supportSum = support.Sum();
            var accU = (double)convertV(maxSum / sumSupport);



            var Precision = metrics.ConfusionMatrix.PerClassPrecision;
            var Recall = metrics.ConfusionMatrix.PerClassRecall;

            var F1Score = Precision.Zip(Recall, (P, R) => 2 * P * R / (P + R)).ToList();


            var weightF1Score = F1Score.Zip(Support, (F, S) => S * F).Sum();
            var wF1 = (double)convertV(weightF1Score / sumRowPrecision);

            var weightPrecision = Precision.Zip(Support, (first, second) => first * second).Sum();
            var wPrecision = (double)convertV(weightPrecision / sumRowPrecision);


            var weightRecall = Recall.Zip(Support, (first, second) => first * second).Sum();
            var wRecall = (double)convertV(weightRecall / sumRowPrecision);

            var macroP = (double)convertV(Precision.Average());
            var macroR = (double)convertV(Recall.Average());
            var macroF = (double)convertV(F1Score.Average());

            //var report = new List<List<double>> ();
            var clsNames = testDS.Names.Take(clsCnt).ToList();
            var report = new List<BsonArray>();

            report.Add(new BsonArray(clsNames));
            report.Add(new BsonArray(Precision.Select(s => convertV(s))));
            report.Add(new BsonArray(Recall.Select(s => convertV(s))));
            report.Add(new BsonArray(F1Score.Select(s => convertV(s))));
            report.Add(new BsonArray(Support.Select(s => convertV(s))));

            var repX = Enumerable.Range(0, report.Count);

            //            var reportT = enumY.Select(y=> report.Select(r=> r[y]).ToList()).ToList();
            var reportT = enumY.Select(y => new BsonArray(report.Select(r => r[y]))).ToList();
            reportT.Add(new BsonArray { "" });
            reportT.Add(new BsonArray { "accuracy", "", "", accU, sumSupport });
            reportT.Add(new BsonArray { "macro avg", macroP, macroR, macroF, sumSupport });
            reportT.Add(new BsonArray { "weighted avg", wPrecision, wRecall, wF1, sumSupport });
            reportT.Insert(0, new BsonArray { "", "precision", "recall", "f1-score", "support" });


            //var pre = Precision.Select(c=> convertV(c)).ToList();

            //var converted = reportT.Select(s=> s.Select(c=> convertV(c)).ToList()).ToList();

            //var sorted = new Has<string, List<double>> ();

            var cR = new BsonDocument("Classification Report", new BsonArray(reportT));






            mts.Add(cR);


            return mts;
        }

        private double convertV(BsonValue c)
        {
            var v = c.ToString();

            var vv = double.TryParse(v, out double val);

            var result = vv == true ? fRound(c.ToDouble()) : c;
            var bsnV = (double)result;

            return bsnV;
        }

        private double fRound(double value, int digits = 3)
        {
            //value = (decimal)value;
            var v = Math.Round(value, digits);

            return v;
        }



        private long getFileSize(string s)
        {
            FileInfo fi = new FileInfo(s);
            var size = fi.Length;
            return size;
        }




    }

}

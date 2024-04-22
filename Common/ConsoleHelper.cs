using Microsoft.ML;
using Microsoft.ML.Data;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing.Drawing2D;
using System.Linq;
using Tensorflow;
using static Microsoft.ML.TrainCatalogBase;

namespace Common
{
    public  class ConsoleHelper
    {
        public  void PrintPrediction(string prediction)
        {
            Console.WriteLine($"*************************************************");
            Console.WriteLine($"Predicted : {prediction}");
            Console.WriteLine($"*************************************************");
        }

        public  void PrintRegressionPredictionVersusObserved(string predictionCount, string observedCount)
        {
            Console.WriteLine($"-------------------------------------------------");
            Console.WriteLine($"Predicted : {predictionCount}");
            Console.WriteLine($"Actual:     {observedCount}");
            Console.WriteLine($"-------------------------------------------------");
        }

        public  void PrintRegressionMetrics(string name, RegressionMetrics metrics)
        {
            Console.WriteLine($"*************************************************");
            Console.WriteLine($"*       Metrics for {name} regression model      ");
            Console.WriteLine($"*------------------------------------------------");
            Console.WriteLine($"*       LossFn:        {metrics.LossFunction:0.##}");
            Console.WriteLine($"*       R2 Score:      {metrics.RSquared:0.##}");
            Console.WriteLine($"*       Absolute loss: {metrics.MeanAbsoluteError:#.##}");
            Console.WriteLine($"*       Squared loss:  {metrics.MeanSquaredError:#.##}");
            Console.WriteLine($"*       RMS loss:      {metrics.RootMeanSquaredError:#.##}");
            Console.WriteLine($"*************************************************");
        }

        public  void PrintBinaryClassificationMetrics(string name, CalibratedBinaryClassificationMetrics metrics)
        {
            Console.WriteLine($"************************************************************");
            Console.WriteLine($"*       Metrics for {name} binary classification model      ");
            Console.WriteLine($"*-----------------------------------------------------------");
            Console.WriteLine($"*       Accuracy: {metrics.Accuracy:P2}");
            Console.WriteLine($"*       Area Under Curve:      {metrics.AreaUnderRocCurve:P2}");
            Console.WriteLine($"*       Area under Precision recall Curve:  {metrics.AreaUnderPrecisionRecallCurve:P2}");
            Console.WriteLine($"*       F1Score:  {metrics.F1Score:P2}");
            Console.WriteLine($"*       LogLoss:  {metrics.LogLoss:#.##}");
            Console.WriteLine($"*       LogLossReduction:  {metrics.LogLossReduction:#.##}");
            Console.WriteLine($"*       PositivePrecision:  {metrics.PositivePrecision:#.##}");
            Console.WriteLine($"*       PositiveRecall:  {metrics.PositiveRecall:#.##}");
            Console.WriteLine($"*       NegativePrecision:  {metrics.NegativePrecision:#.##}");
            Console.WriteLine($"*       NegativeRecall:  {metrics.NegativeRecall:P2}");
            Console.WriteLine($"************************************************************");
        }

        public  void PrintAnomalyDetectionMetrics(string name, AnomalyDetectionMetrics metrics)
        {
            Console.WriteLine($"************************************************************");
            Console.WriteLine($"*       Metrics for {name} anomaly detection model      ");
            Console.WriteLine($"*-----------------------------------------------------------");
            Console.WriteLine($"*       Area Under ROC Curve:                       {metrics.AreaUnderRocCurve:P2}");
            Console.WriteLine($"*       Detection rate at false positive count: {metrics.DetectionRateAtFalsePositiveCount}");
            Console.WriteLine($"************************************************************");
        }

        public  BsonDocument PrintMultiClassClassificationMetrics(string name, MulticlassClassificationMetrics metrics)
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
            mts.Add("microA", Math.Round(metrics.MicroAccuracy, 4));
            mts.Add("macroA", Math.Round(metrics.MacroAccuracy, 4));
            mts.Add("perclassLogLoss", new BsonArray(metrics.PerClassLogLoss));
            mts.Add("logLoss", Math.Round(metrics.LogLoss, 4));
            mts.Add("logLossRed", Math.Round(metrics.LogLossReduction, 4));

            var prec = metrics.ConfusionMatrix.PerClassPrecision;
            var recall = metrics.ConfusionMatrix.PerClassRecall;
                        
            var cnts = metrics.ConfusionMatrix.Counts;
            var clsCnt = metrics.ConfusionMatrix.NumberOfClasses;

            var enumX = Enumerable.Range(0, clsCnt);
            var enumY = Enumerable.Range(0, clsCnt);

            var rowPrecision = enumX.Select(x=> enumY.Select(y=> metrics.ConfusionMatrix.GetCountForClassPair(x,y)).Sum()).ToList();
            var sumRowPrecision = rowPrecision.Sum();
            var Support = enumX.Select(x=> enumY.Select(y=> metrics.ConfusionMatrix.GetCountForClassPair(y,x)).Sum()).ToList();
            
            var sumSupport = Support.Sum();
            
            //var rowPrecision = enumX.Zip(enumY,(x,y)=>metrics.ConfusionMatrix.GetCountForClassPair(x,y)).ToList();
            //var colRecall = enumX.Zip(enumY,(x,y)=>metrics.ConfusionMatrix.GetCountForClassPair(y,x)).ToList();

            var maxTP = enumX.Select(x => metrics.ConfusionMatrix.GetCountForClassPair(x,x)).ToList();
            var maxSum = maxTP.Sum();

            //var support = cnts.Select(s=> s.Sum()).ToList();
            //var supportSum = support.Sum();
            var accU = maxSum/sumSupport;

            
            
            var Precision = metrics.ConfusionMatrix.PerClassPrecision;
            var Recall = metrics.ConfusionMatrix.PerClassRecall;

            var F1Score = Precision.Zip(Recall, (P,R)=> 2*P*R/(P+R)).ToList();
            

            var weightF1Score = F1Score.Zip(Support,(F,S)=> S*F).Sum();
            var wF1 = fRound(weightF1Score/sumRowPrecision);

            var weightPrecision = Precision.Zip(Support, (first, second) => first * second).Sum();
            var wPrecision = fRound(weightPrecision/sumRowPrecision);

            
            var weightRecall = Recall.Zip(Support, (first, second) => first * second).Sum();
            var wRecall = fRound(weightRecall/sumRowPrecision);

            var macroP = fRound(Precision.Average());
            var macroR = fRound(Recall.Average());
            var macroF = fRound(F1Score.Average());

            var report = new List<List<double>> ();
            report.Add(Precision.Select(s=>fRound(s)).ToList());
            report.Add(Recall.Select(s=>fRound(s)).ToList());
            report.Add(F1Score.Select(s=>fRound(s)).ToList());
            report.Add(Support);

            var repX = Enumerable.Range(0,4);
            
            var reportT = enumY.Select(y=> report.Select(r=> r[y]).ToList()).ToList();
            return mts;
        }

        private  double fRound(double value, int digits = 4)
        {
            var v = Math.Round(value, digits);

            return v;
        }

        public  void PrintRegressionFoldsAverageMetrics(string algorithmName, IReadOnlyList<CrossValidationResult<RegressionMetrics>> crossValidationResults)
        {
            IEnumerable<double> L1 = crossValidationResults.Select(r => r.Metrics.MeanAbsoluteError);
            IEnumerable<double> L2 = crossValidationResults.Select(r => r.Metrics.MeanSquaredError);
            IEnumerable<double> RMS = crossValidationResults.Select(r => r.Metrics.RootMeanSquaredError);
            IEnumerable<double> lossFunction = crossValidationResults.Select(r => r.Metrics.LossFunction);
            IEnumerable<double> R2 = crossValidationResults.Select(r => r.Metrics.RSquared);

            Console.WriteLine($"*************************************************************************************************************");
            Console.WriteLine($"*       Metrics for {algorithmName} Regression model      ");
            Console.WriteLine($"*------------------------------------------------------------------------------------------------------------");
            Console.WriteLine($"*       Average L1 Loss:    {L1.Average():0.###} ");
            Console.WriteLine($"*       Average L2 Loss:    {L2.Average():0.###}  ");
            Console.WriteLine($"*       Average RMS:          {RMS.Average():0.###}  ");
            Console.WriteLine($"*       Average Loss Function: {lossFunction.Average():0.###}  ");
            Console.WriteLine($"*       Average R-squared: {R2.Average():0.###}  ");
            Console.WriteLine($"*************************************************************************************************************");
        }

        public  void PrintMulticlassClassificationFoldsAverageMetrics(
                                         string algorithmName,
                                       IReadOnlyList<CrossValidationResult<MulticlassClassificationMetrics>> crossValResults
                                                                           )
        {
            IEnumerable<MulticlassClassificationMetrics> metricsInMultipleFolds = crossValResults.Select(r => r.Metrics);

            IEnumerable<double> microAccuracyValues = metricsInMultipleFolds.Select(m => m.MicroAccuracy);
            double microAccuracyAverage = microAccuracyValues.Average();
            double microAccuraciesStdDeviation = CalculateStandardDeviation(microAccuracyValues);
            double microAccuraciesConfidenceInterval95 = CalculateConfidenceInterval95(microAccuracyValues);

            IEnumerable<double> macroAccuracyValues = metricsInMultipleFolds.Select(m => m.MacroAccuracy);
            double macroAccuracyAverage = macroAccuracyValues.Average();
            double macroAccuraciesStdDeviation = CalculateStandardDeviation(macroAccuracyValues);
            double macroAccuraciesConfidenceInterval95 = CalculateConfidenceInterval95(macroAccuracyValues);

            IEnumerable<double> logLossValues = metricsInMultipleFolds.Select(m => m.LogLoss);
            double logLossAverage = logLossValues.Average();
            double logLossStdDeviation = CalculateStandardDeviation(logLossValues);
            double logLossConfidenceInterval95 = CalculateConfidenceInterval95(logLossValues);

            IEnumerable<double> logLossReductionValues = metricsInMultipleFolds.Select(m => m.LogLossReduction);
            double logLossReductionAverage = logLossReductionValues.Average();
            double logLossReductionStdDeviation = CalculateStandardDeviation(logLossReductionValues);
            double logLossReductionConfidenceInterval95 = CalculateConfidenceInterval95(logLossReductionValues);

            Console.WriteLine($"*************************************************************************************************************");
            Console.WriteLine($"*       Metrics for {algorithmName} Multi-class Classification model      ");
            Console.WriteLine($"*------------------------------------------------------------------------------------------------------------");
            Console.WriteLine($"*       Average MicroAccuracy:    {microAccuracyAverage:0.###}  - Standard deviation: ({microAccuraciesStdDeviation:#.###})  - Confidence Interval 95%: ({microAccuraciesConfidenceInterval95:#.###})");
            Console.WriteLine($"*       Average MacroAccuracy:    {macroAccuracyAverage:0.###}  - Standard deviation: ({macroAccuraciesStdDeviation:#.###})  - Confidence Interval 95%: ({macroAccuraciesConfidenceInterval95:#.###})");
            Console.WriteLine($"*       Average LogLoss:          {logLossAverage:#.###}  - Standard deviation: ({logLossStdDeviation:#.###})  - Confidence Interval 95%: ({logLossConfidenceInterval95:#.###})");
            Console.WriteLine($"*       Average LogLossReduction: {logLossReductionAverage:#.###}  - Standard deviation: ({logLossReductionStdDeviation:#.###})  - Confidence Interval 95%: ({logLossReductionConfidenceInterval95:#.###})");
            Console.WriteLine($"*************************************************************************************************************");

        }

        public  double CalculateStandardDeviation(IEnumerable<double> values)
        {
            double average = values.Average();
            double sumOfSquaresOfDifferences = values.Select(val => (val - average) * (val - average)).Sum();
            double standardDeviation = Math.Sqrt(sumOfSquaresOfDifferences / (values.Count() - 1));
            return standardDeviation;
        }

        public  double CalculateConfidenceInterval95(IEnumerable<double> values)
        {
            double confidenceInterval95 = 1.96 * CalculateStandardDeviation(values) / Math.Sqrt((values.Count() - 1));
            return confidenceInterval95;
        }

        public  void PrintClusteringMetrics(string name, ClusteringMetrics metrics)
        {
            Console.WriteLine($"*************************************************");
            Console.WriteLine($"*       Metrics for {name} clustering model      ");
            Console.WriteLine($"*------------------------------------------------");
            Console.WriteLine($"*       Average Distance: {metrics.AverageDistance}");
            Console.WriteLine($"*       Davies Bouldin Index is: {metrics.DaviesBouldinIndex}");
            Console.WriteLine($"*************************************************");
        }

        public  void ShowDataViewInConsole(MLContext mlContext, IDataView dataView, int numberOfRows = 4)
        {
            string msg = string.Format("Show data in DataView: Showing {0} rows with the columns", numberOfRows.ToString());
            ConsoleWriteHeader(msg);

            DataDebuggerPreview preViewTransformedData = dataView.Preview(maxRows: numberOfRows);

            foreach (DataDebuggerPreview.RowInfo row in preViewTransformedData.RowView)
            {
                KeyValuePair<string, object>[] ColumnCollection = row.Values;
                string lineToPrint = "Row--> ";
                foreach (KeyValuePair<string, object> column in ColumnCollection)
                {
                    lineToPrint += $"| {column.Key}:{column.Value}";
                }
                Console.WriteLine(lineToPrint + "\n");
            }
        }

        [Conditional("DEBUG")]
        // This method using 'DebuggerExtensions.Preview()' should only be used when debugging/developing, not for release/production trainings
        public  void PeekDataViewInConsole(MLContext mlContext, IDataView dataView, IEstimator<ITransformer> pipeline, int numberOfRows = 4)
        {
            string msg = string.Format("Peek data in DataView: Showing {0} rows with the columns", numberOfRows.ToString());
            ConsoleWriteHeader(msg);

            //https://github.com/dotnet/machinelearning/blob/master/docs/code/MlNetCookBook.md#how-do-i-look-at-the-intermediate-data
            ITransformer transformer = pipeline.Fit(dataView);
            IDataView transformedData = transformer.Transform(dataView);

            // 'transformedData' is a 'promise' of data, lazy-loading. call Preview  
            //and iterate through the returned collection from preview.

            DataDebuggerPreview preViewTransformedData = transformedData.Preview(maxRows: numberOfRows);

            foreach (DataDebuggerPreview.RowInfo row in preViewTransformedData.RowView)
            {
                KeyValuePair<string, object>[] ColumnCollection = row.Values;
                string lineToPrint = "Row--> ";
                foreach (KeyValuePair<string, object> column in ColumnCollection)
                {
                    lineToPrint += $"| {column.Key}:{column.Value}";
                }
                Console.WriteLine(lineToPrint + "\n");
            }
        }

        [Conditional("DEBUG")]
        // This method using 'DebuggerExtensions.Preview()' should only be used when debugging/developing, not for release/production trainings
        public  void PeekVectorColumnDataInConsole(MLContext mlContext, string columnName, IDataView dataView, IEstimator<ITransformer> pipeline, int numberOfRows = 4)
        {
            string msg = string.Format("Peek data in DataView: : Show {0} rows with just the '{1}' column", numberOfRows, columnName);
            ConsoleWriteHeader(msg);

            ITransformer transformer = pipeline.Fit(dataView);
            IDataView transformedData = transformer.Transform(dataView);

            // Extract the 'Features' column.
            List<float[]> someColumnData = transformedData.GetColumn<float[]>(columnName)
                                                        .Take(numberOfRows).ToList();

            // print to console the peeked rows

            int currentRow = 0;
            someColumnData.ForEach(row =>
            {
                currentRow++;
                String concatColumn = String.Empty;
                foreach (float f in row)
                {
                    concatColumn += f.ToString();
                }

                Console.WriteLine();
                string rowMsg = string.Format("**** Row {0} with '{1}' field value ****", currentRow, columnName);
                Console.WriteLine(rowMsg);
                Console.WriteLine(concatColumn);
                Console.WriteLine();
            });
        }

        public  void ConsoleWriteHeader(params string[] lines)
        {
            ConsoleColor defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(" ");
            foreach (string line in lines)
            {
                Console.WriteLine(line);
            }
            int maxLength = lines.Select(x => x.Length).Max();
            Console.WriteLine(new string('#', maxLength));
            Console.ForegroundColor = defaultColor;
        }

        public  void ConsoleWriterSection(params string[] lines)
        {
            ConsoleColor defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Blue;
            Console.WriteLine(" ");
            foreach (string line in lines)
            {
                Console.WriteLine(line);
            }
            int maxLength = lines.Select(x => x.Length).Max();
            Console.WriteLine(new string('-', maxLength));
            Console.ForegroundColor = defaultColor;
        }

        public  void ConsolePressAnyKey()
        {
            ConsoleColor defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(" ");
            Console.WriteLine("Press any key to finish.");
            Console.ReadKey();
        }

        public  void ConsoleWriteException(params string[] lines)
        {
            ConsoleColor defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Red;
            const string exceptionTitle = "EXCEPTION";
            Console.WriteLine(" ");
            Console.WriteLine(exceptionTitle);
            Console.WriteLine(new string('#', exceptionTitle.Length));
            Console.ForegroundColor = defaultColor;
            foreach (string line in lines)
            {
                Console.WriteLine(line);
            }
        }

        public  void ConsoleWriteWarning(params string[] lines)
        {
            ConsoleColor defaultColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkMagenta;
            const string warningTitle = "WARNING";
            Console.WriteLine(" ");
            Console.WriteLine(warningTitle);
            Console.WriteLine(new string('#', warningTitle.Length));
            Console.ForegroundColor = defaultColor;
            foreach (string line in lines)
            {
                Console.WriteLine(line);
            }
        }
    }
}

using Microsoft.ML;
using Microsoft.ML.Transforms.Image;
using MongoDB.Bson;
using System.ComponentModel;
using System.Drawing;


namespace ImageClassification.DataModels
{
    public class ImageData
    {
        public ImageData(string imagePath, string label)
        {
            ImagePath = imagePath;
            Label = label;
        }

        public readonly string ImagePath;

        public readonly string Label;
    }

    public class ImageData2
    {
        [ImageType(3, 4)]
        public Bitmap Image { get; set; }
        [ImageType(3, 4)]
        public Bitmap GrayImage { get; set; }
        public string Label { get; set; }

        public ImageData2()
        {
            Image = null;
            GrayImage = null;
            Label = null;
        }

        public ImageData2(string imagePath, string label)
        {
            Image = new Bitmap(imagePath);
            Label = label;
        }

        
    }

    public class TrainedData{

        public  int  Iteration;
        
        public  BsonArray Data;
        public  ITransformer Model;
        public  int TrainDatasetCount;
        public  int TestDatasetCount;
        
       public double TestFraction;
       public BsonDocument Metrics;

       public BsonDocument DataSet;

        public TrainedData(int iteration,  BsonArray data, ITransformer model){
            Iteration = iteration;
            
            Data = data;
            Model = model;
        }



    }
}

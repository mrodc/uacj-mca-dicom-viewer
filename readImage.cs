using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using Dicom;
using Dicom.Imaging;
using Dicom.IO.Buffer;



namespace ImgNET // Note: actual namespace depends on the project name.
{
    internal class ReadImage
    {
        public ReadImage()
        {
            var imageFile = "/home/mrod/development/net/imgNET6/assets/ML_InputData/000114 (4).png";//Path.Combine(_studyPath, folder, file);
            //FileStream fileStream = File.OpenRead(imageFile);
            var size = GetImageSize(File.ReadAllBytes(imageFile));
        }

        public static Size GetImageSize(byte[] image)
        {
            using (var buffer = new MemoryStream(image))
            {
                using (var bitmap = Image.FromStream(buffer))
                {
                    return bitmap.Size;
                }
            }
        }
        public static DicomDataset CreateMultiFrameDataset(int columns, int rows, IEnumerable<byte[]> images)
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
            pixelData.PlanarConfiguration = PlanarConfiguration.Interleaved;

            foreach (var image in images)
            {
                var fragment = new DicomOtherByteFragment(DicomTag.PixelData);
                fragment.Fragments.Add(EvenLengthBuffer.Create(new MemoryByteBuffer(image)));
                pixelData.AddFrame(new CompositeByteBuffer(fragment));
            }

            return dataset;
        }
    }
}
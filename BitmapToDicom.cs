using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using Dicom;
using Dicom.Imaging;
using Dicom.IO.Buffer;
using MongoDB.Bson;

namespace ImgNET
{
    internal class BitmapToDicom
    {
        public BitmapToDicom()
        {
            // ImportImage(@"C:\development\person1_virus_6.jpeg");//"C:\mcaLocal\mlnet\archive\Data\test\large.cell.carcinoma\000158.png"
            //ImportImage(@"C:\mcaLocal\mlnet\archive\Data\test\large.cell.carcinoma\000158.png");//"C:\mcaLocal\mlnet\archive\Data\test\large.cell.carcinoma\000158.png"
        }
        public void ImportImage(string imagePath, BsonDocument bson)//"C:\development\person1_virus_6.jpeg"
        {
            var file = Path.Combine(imagePath, (string)bson["folder"], (string)bson["file"]);

            Bitmap bitmap = new Bitmap(file);
            bitmap = GetValidImage(bitmap);
            int rows, columns;
            byte[] pixels = GetPixels(bitmap, out rows, out columns);
            MemoryByteBuffer buffer = new MemoryByteBuffer(pixels);
            DicomDataset dataset = new DicomDataset();
            FillDataset(dataset, bson);
            dataset.Add(DicomTag.BitsAllocated, (ushort)8);
            dataset.Add(DicomTag.PhotometricInterpretation, PhotometricInterpretation.Rgb.Value);
            dataset.Add(DicomTag.Rows, (ushort)rows);
            dataset.Add(DicomTag.Columns, (ushort)columns);
            DicomPixelData pixelData = DicomPixelData.Create(dataset, true);
            pixelData.BitsStored = 8;
            //pixelData.BitsAllocated = 8;
            pixelData.SamplesPerPixel = 3;
            pixelData.HighBit = 7;
            pixelData.PixelRepresentation = 0;
            pixelData.PlanarConfiguration = 0;
            pixelData.AddFrame(buffer);

            DicomFile dicomfile = new DicomFile(dataset);

            FileInfo fi = new FileInfo(file);
            var pth = file.Replace(fi.Extension, ".dcm");
            //dicomfile.Save("dicomfile.dcm");
            dicomfile.Save(pth);
        }
        private void FillDataset(DicomDataset dataset, BsonDocument bson)
        {
            //var viewerName = "UACJ-Viewer";
            //type 1 attributes.
            dataset.Add(DicomTag.SOPClassUID, DicomUID.SecondaryCaptureImageStorage);
            dataset.Add(DicomTag.StudyInstanceUID, GenerateUid());
            dataset.Add(DicomTag.SeriesInstanceUID, GenerateUid());
            dataset.Add(DicomTag.SOPInstanceUID, GenerateUid());

            //type 2 attributes
            dataset.Add(DicomTag.PatientID, "12345");
            dataset.Add(DicomTag.PatientName, string.Empty);
            dataset.Add(DicomTag.PatientBirthDate, "00000000");
            dataset.Add(DicomTag.PatientSex, "M");
            dataset.Add(DicomTag.StudyDate, DateTime.Now);
            dataset.Add(DicomTag.StudyTime, DateTime.Now);
            dataset.Add(DicomTag.AccessionNumber, string.Empty);
            dataset.Add(DicomTag.ReferringPhysicianName, string.Empty);
            dataset.Add(DicomTag.StudyID, "1");
            dataset.Add(DicomTag.SeriesNumber, "1");
            dataset.Add(DicomTag.ModalitiesInStudy, "CR");
            dataset.Add(DicomTag.Modality, "CR");
            dataset.Add(DicomTag.NumberOfStudyRelatedInstances, "1");
            dataset.Add(DicomTag.NumberOfStudyRelatedSeries, "1");
            dataset.Add(DicomTag.NumberOfSeriesRelatedInstances, "1");
            dataset.Add(DicomTag.PatientOrientation, "F/A");
            dataset.Add(DicomTag.ImageLaterality, "U");


            ushort dicomGroupTag = 0x0055;
            ushort dicomElement = 0x0010;
            var privateTag = new DicomTag(dicomGroupTag, dicomElement, "UACJ_VISOR");

            DicomDictionary.Default.Add(new DicomDictionaryEntry(privateTag, "uacjVisor", "uacj_root_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            //dataset.AddOrUpdate<string>(DicomVR.LO, privateTag, version);
            var privateCreator = DicomDictionary.Default.GetPrivateCreator("UACJ_VISOR");
            var privTag1 = new DicomTag(dicomGroupTag, 0x0010, privateCreator);
            DicomDictionary.Default.Add(new DicomDictionaryEntry(privTag1, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            //var privTag2 = new DicomTag(dicomGroupTag, 0x0011, privateCreator);

            var data = bson["data"].AsBsonArray;
            foreach (var e in data)
            {
                var theDoc = e.AsBsonDocument;
                var nms = theDoc.Names.OrderBy(o => o).Select(s => new BsonDocument(s, theDoc[s])).Take(theDoc.Names.Count()-1);
                var ordered = new BsonArray(nms);
                var lst = ordered.LastOrDefault();
                ordered.Insert(0, lst);
                var desc = new BsonArray(ordered.Take(ordered.Count - 1));

                var r = e["Result"].AsBsonDocument;
                var rnames = r.Names.Select(s => new BsonDocument(s, r[s]));
                var res = new BsonArray(rnames);

                dicomElement = insertBsonData(desc, dicomGroupTag, dicomElement, dataset, privateCreator);
                dicomElement = insertBsonData(res, dicomGroupTag, dicomElement, dataset, privateCreator);


                // var result = e["Result"].AsBsonDocument;

                // var e_names = (e.AsBsonDocument).Names.OrderBy(o => o).ToList();
                // var r_names = result.Names.ToList();
                // var dset = e["Dataset"];
                // var date = e["Date"];
                // var model = e["Model"];
                // var filename = e["FileName"];

                // foreach (var en in e_names)
                // {
                //     var nme = en.ToString();
                //     var privTagE = new DicomTag(dicomGroupTag, dicomElement++, privateCreator);
                //     DicomDictionary.Default.Add(new DicomDictionaryEntry(privTagE, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
                //     var content = new BsonDocument(nme, e[nme]);
                //     dataset.AddOrUpdate(DicomVR.OB, privTagE, content);
                // }
                // foreach (var rn in r_names)
                // {
                //     var nme = rn.ToString();
                //     var privTagR = new DicomTag(dicomGroupTag, dicomElement++, privateCreator);
                //     DicomDictionary.Default.Add(new DicomDictionaryEntry(privTagR, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
                //     var content = new BsonDocument(nme, e[nme]);
                //     dataset.AddOrUpdate(DicomVR.OB, privTagR, content);
                // }


            }

            // ushort index = 0x0030;
            // for (ushort i = 0; i < 10; i++)
            // {
            //     ushort element = (ushort)(index + i);
            //     var privTagX = new DicomTag(0x0081, element, privateCreator);
            //     DicomDictionary.Default.Add(new DicomDictionaryEntry(privTagX, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
            //     dataset.AddOrUpdate(DicomVR.OB, privTagX, bytes);

            // }


        }

        private ushort insertBsonData(BsonArray bsonArray, ushort dicomGroupTag, ushort dicomElement, DicomDataset dataset, DicomPrivateCreator privateCreator)
        {
            //var names = bsonDoc.Names.ToList();
            foreach (var en in bsonArray)
            {
                var doc = en.AsBsonDocument;
                if (doc.Contains("Result"))
                    continue;
                var content = doc.ToJson().Replace("\"", "");
                var privTagE = new DicomTag(dicomGroupTag, dicomElement++, privateCreator);
                DicomDictionary.Default.Add(new DicomDictionaryEntry(privTagE, "uacjFollowUp", "uacj_medicalInfo", DicomVM.VM_1, false, DicomVR.CS));
                dataset.AddOrUpdate(privTagE, content);
            }
            return dicomElement;
        }

        private DicomUID GenerateUid()
        {
            StringBuilder uid = new StringBuilder();
            uid.Append("1.08.1982.10121984.2.0.07").Append('.').Append(DateTime.UtcNow.Ticks);
            return new DicomUID(uid.ToString(), "SOP Instance UID", DicomUidType.SOPInstance);
        }

        private static Bitmap GetValidImage(Bitmap bitmap)
        {
            if (bitmap.PixelFormat != PixelFormat.Format24bppRgb)
            {
                Bitmap old = bitmap;
                using (old)
                {
                    bitmap = new Bitmap(old.Width, old.Height, PixelFormat.Format24bppRgb);
                    using (System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitmap))
                    {
                        g.DrawImage(old, 0, 0, old.Width, old.Height);
                    }
                }
            }
            return bitmap;
        }
        private byte[] GetPixels(Bitmap image, out int rows, out int columns)
        {
            rows = image.Height;
            columns = image.Width;

            if (rows % 2 != 0 && columns % 2 != 0)
                --columns;

            BitmapData data = image.LockBits(new Rectangle(0, 0, columns, rows), ImageLockMode.ReadOnly, image.PixelFormat);
            IntPtr bmpData = data.Scan0;
            try
            {
                int stride = columns * 3;
                int size = rows * stride;
                byte[] pixelData = new byte[size];
                for (int i = 0; i < rows; ++i)
                    Marshal.Copy(new IntPtr(bmpData.ToInt64() + i * data.Stride), pixelData, i * stride, stride);

                //swap BGR to RGB
                SwapRedBlue(pixelData);
                return pixelData;
            }
            finally
            {
                image.UnlockBits(data);
            }
        }
        private void SwapRedBlue(byte[] pixels)
        {
            for (int i = 0; i < pixels.Length; i += 3)
            {
                byte temp = pixels[i];
                pixels[i] = pixels[i + 2];
                pixels[i + 2] = temp;
            }
        }
    }
}
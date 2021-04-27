using ReactNative.Bridge;
using ReactNative.UIManager;
using System;
using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace RNViewShot
{
    public class ViewShot : IUIBlock
    {
        public const string ErrorUnableToSnapshot = "E_UNABLE_TO_SNAPSHOT";
        private int tag;
        private string extension;
        private double quality;
        private int? width;
        private int? height;
        private string path;
        private string result;
        private IPromise promise;

        public ViewShot(
            int tag,
            string extension,
            double quality,
            int? width,
            int? height,
            string path,
            string result,
            IPromise promise)
        {
            this.tag = tag;
            this.extension = extension;
            this.quality = quality;
            this.width = width;
            this.height = height;
            this.path = path;
            this.result = result;
            this.promise = promise;
        }

        public void Execute(NativeViewHierarchyManager nvhm)
        {
            var view = nvhm.ResolveView(tag) as FrameworkElement;
            if (view == null)
            {
                promise.Reject(ErrorUnableToSnapshot, "No view found with reactTag: " + tag);
                return;
            }

            try
            {
                BitmapEncoder image = CaptureView(view);

                if ("file" == result)
                {
                    string filePath = GetFilePath();
                    Stream stream = File.Create(filePath);
                    image.Save(stream);
                    promise.Resolve(filePath);
                    stream.Close();
                }
                else if ("base64" == result)
                {
                    MemoryStream stream = new MemoryStream();
                    image.Save(stream);
                    byte[] imageBytes = stream.ToArray();
                    string data = Convert.ToBase64String(imageBytes);
                    promise.Resolve(data);
                    stream.Close();
                }
                else if ("data-uri" == result)
                {
                    MemoryStream stream = new MemoryStream();
                    image.Save(stream);
                    byte[] imageBytes = stream.ToArray();
                    string data = Convert.ToBase64String(imageBytes);
                    data = "data:image/" + extension + ";base64," + data;
                    promise.Resolve(data);
                    stream.Close();
                }
                else
                {
                    promise.Reject(ErrorUnableToSnapshot, "Unsupported result: " + result + ". Try one of: file | base64 | data-uri");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                promise.Reject(ErrorUnableToSnapshot, "Failed to capture view snapshot");
            }
        }

        private BitmapEncoder CaptureView(FrameworkElement view)
        {
            int w = (int)view.ActualWidth;
            int h = (int)view.ActualHeight;

            if (w <= 0 || h <= 0)
            {
                throw new InvalidOperationException("Impossible to snapshot the view: view is invalid");
            }

            RenderTargetBitmap targetBitmap = new RenderTargetBitmap(w, h, 96, 96, PixelFormats.Default);
            targetBitmap.Render(view);

            BitmapSource bitmap;
            if (width != null && height != null && (width != w || height != h))
            {
                double scaleX = (double)width / targetBitmap.PixelWidth;
                double scaleY = (double)height / targetBitmap.PixelHeight;
                bitmap = new TransformedBitmap(targetBitmap, new ScaleTransform(scaleX, scaleY));
            }
            else
            {
                bitmap = targetBitmap;
            }

            if (bitmap == null)
            {
                throw new InvalidOperationException("Impossible to snapshot the view");
            }

            if (extension == "png")
            {
                PngBitmapEncoder image = new PngBitmapEncoder();
                image.Frames.Add(BitmapFrame.Create(bitmap));
                return image;
            }
            else
            {
                JpegBitmapEncoder image = new JpegBitmapEncoder();
                image.QualityLevel = (int)(100.0 * quality);
                image.Frames.Add(BitmapFrame.Create(bitmap));
                return image;
            }
        }

        private string GetFilePath()
        {
            if (string.IsNullOrEmpty(path)) 
            {
                string tmpFilePath = Path.GetTempPath();
                string fileName = Guid.NewGuid().ToString();
                fileName = Path.ChangeExtension(fileName, extension);
                return Path.Combine(tmpFilePath, fileName);
            }
            else
            {
                return path;
            }
        }
    }
}

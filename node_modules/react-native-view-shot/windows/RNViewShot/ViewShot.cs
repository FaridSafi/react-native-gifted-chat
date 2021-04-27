using ReactNative.Bridge;
using ReactNative.UIManager;
using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Graphics.Display;
using Windows.Graphics.Imaging;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Media.Imaging;

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

        public async void Execute(NativeViewHierarchyManager nvhm)
        {
            var view = nvhm.ResolveView(tag) as FrameworkElement;
            if (view == null)
            {
                promise.Reject(ErrorUnableToSnapshot, "No view found with reactTag: " + tag);
                return;
            }

            try
            {
                if ("file" == result)
                {
                    using (var ras = new InMemoryRandomAccessStream())
                    {
                        await CaptureView(view, ras);
                        var file = await GetStorageFile();
                        using (var fileStream = await file.OpenAsync(FileAccessMode.ReadWrite))
                        {
                            await RandomAccessStream.CopyAndCloseAsync(ras.GetInputStreamAt(0), fileStream.GetOutputStreamAt(0));
                            promise.Resolve(file.Path);
                        }
                    }
                }
                else if ("base64" == result)
                {
                    using (var ras = new InMemoryRandomAccessStream())
                    {
                        await CaptureView(view, ras);
                        var imageBytes = new byte[ras.Size];
                        await ras.AsStream().ReadAsync(imageBytes, 0, imageBytes.Length);
                        string data = Convert.ToBase64String(imageBytes);
                        promise.Resolve(data);
                    }
                }
                else if ("data-uri" == result)
                {
                    using (var ras = new InMemoryRandomAccessStream())
                    {
                        await CaptureView(view, ras);
                        var imageBytes = new byte[ras.Size];
                        await ras.AsStream().ReadAsync(imageBytes, 0, imageBytes.Length);
                        string data = Convert.ToBase64String(imageBytes);
                        data = "data:image/" + extension + ";base64," + data;
                        promise.Resolve(data);
                    }
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

        private async Task<BitmapEncoder> CaptureView(FrameworkElement view, IRandomAccessStream stream)
        {
            int w = (int)view.ActualWidth;
            int h = (int)view.ActualHeight;

            if (w <= 0 || h <= 0)
            {
                throw new InvalidOperationException("Impossible to snapshot the view: view is invalid");
            }

            RenderTargetBitmap targetBitmap = new RenderTargetBitmap();
            await targetBitmap.RenderAsync(view, w, h);

            BitmapEncoder encoder;
            if (extension != "png")
            {
                var propertySet = new BitmapPropertySet();
                var qualityValue = new BitmapTypedValue(quality, Windows.Foundation.PropertyType.Single);
                propertySet.Add("ImageQuality", qualityValue);
                encoder = await BitmapEncoder.CreateAsync(BitmapEncoder.JpegEncoderId, stream, propertySet);
            }
            else
            {
                encoder = await BitmapEncoder.CreateAsync(BitmapEncoder.PngEncoderId, stream);
            }

            var displayInformation = DisplayInformation.GetForCurrentView();
            var pixelBuffer = await targetBitmap.GetPixelsAsync();

            encoder.SetPixelData(
                BitmapPixelFormat.Bgra8,
                BitmapAlphaMode.Ignore,
                (uint)targetBitmap.PixelWidth,
                (uint)targetBitmap.PixelHeight,
                displayInformation.LogicalDpi,
                displayInformation.LogicalDpi,
                pixelBuffer.ToArray());                


            if (width != null && height != null && (width != w || height != h))
            {
                encoder.BitmapTransform.ScaledWidth = (uint)width;
                encoder.BitmapTransform.ScaledWidth = (uint)height;
            }

            if (encoder == null)
            {
                throw new InvalidOperationException("Impossible to snapshot the view");
            }

            await encoder.FlushAsync();

            return encoder;            
        }

        private async Task<StorageFile> GetStorageFile()
        {
            var storageFolder = ApplicationData.Current.LocalFolder;
            var fileName = string.IsNullOrEmpty(path) ? path : Path.ChangeExtension(Guid.NewGuid().ToString(), extension);                
            return await storageFolder.CreateFileAsync(fileName, CreationCollisionOption.ReplaceExisting);
        }
    }
}

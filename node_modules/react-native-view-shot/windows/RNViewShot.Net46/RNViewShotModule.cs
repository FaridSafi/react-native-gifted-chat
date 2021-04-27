using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.UIManager;
using System;
using System.IO;
using System.Collections.Generic;

namespace RNViewShot
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNViewShotModule : ReactContextNativeModuleBase
    {
        private const string ErrorUnableToSnapshot = "E_UNABLE_TO_SNAPSHOT";
        private readonly ReactContext _reactContext;

        /// <summary>
        /// Instantiates the <see cref="RNViewShotModule"/>.
        /// </summary>
        public RNViewShotModule(ReactContext reactContext) : base(reactContext)
        {
            this._reactContext = reactContext;
        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNViewShot";
            }
        }

        [ReactMethod]
        public void takeSnapshot(int tag, JObject options, IPromise promise)
        {
            string format = options["format"] != null ? options.Value<string>("format") : "png";
            double quality = options["quality"] != null ? options.Value<double>("quality") : 1.0;
            int? width = options["width"] != null ? options.Value<int?>("width") : null;
            int? height = options["height"] != null ? options.Value<int?>("height") : null;
            string result = options["result"] != null ? options.Value<string>("result") : "file";
            string path = options["path"] != null ? options.Value<string>("path") : null;

            if (format != "png" && format != "jpg" && format != "jpeg")
            {
                promise.Reject(ViewShot.ErrorUnableToSnapshot, "Unsupported image format: " + format + ". Try one of: png | jpg | jpeg");
                return;
            }

            UIManagerModule uiManager = this._reactContext.GetNativeModule<UIManagerModule>();
            var viewShot = new ViewShot(tag, format, quality, width, height, path, result, promise);
            uiManager.AddUIBlock(viewShot);
        }
    }
}

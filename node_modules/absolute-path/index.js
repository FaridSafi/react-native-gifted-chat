var currentPlatform = process !== void 0 ? process.platform : '';

function isAbsolute (path) {
  if (currentPlatform === 'win32') {
    // Regex to split a windows path into three parts: [*, device, slash,
    // tail] windows-only
    var splitDeviceRe =
      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      
    var result = splitDeviceRe.exec(path),
        device = result[1] || '',
        isUnc = device && device.charAt(1) !== ':';
    // UNC paths are always absolute
    return !!result[2] || isUnc;
  } else {
    return path.charAt(0) === '/';
  }
}

module.exports = isAbsolute;

isAbsolute.setPlatform = function (platform) {
  currentPlatform = platform;
};


const { existsSync, readFileSync, readdirSync, statSync, lstatSync } = require('fs');
const { join } = require('path');

const chunk = (array, chunkSize) => {
  const size = Math.ceil(array.length / chunkSize);
  const result = [];
  while (array.length) {
    result.push(array.splice(0, size));
  }
  return result;
};

const readDir = (dir, filesList = []) => {
  const files = readdirSync(dir);
  for (let file of files) {
    const filePath = join(dir, file);
    if (lstatSync(filePath).isSymbolicLink()) {
      continue;
    }
    if (existsSync(filePath)) {
      if (statSync(filePath).isDirectory()) {
        filesList = readDir(filePath, filesList);
      }
      else {
        if (file.endsWith('.java') || file.endsWith('.xml') || file.endsWith('.kt')) {
          filesList.push(filePath);
        }
      }
    }
  }
  return filesList;
};

const loadCSVFile = () => {
  const csvFilePath = join(__dirname, '..', 'mapping', 'androidx-class-mapping.csv');
  const lines = readFileSync(csvFilePath, { encoding: 'utf8' }).split(/\r?\n/);

  // Remove redundant "Support Library class,Android X class" from array
  lines.shift();

  // last element will always be an empty line so removing it from the array
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }

  // Some mappings are substrings of other mappings, transform longest mappings first
  lines.sort(function(a, b){
    return b.length - a.length;
  });

  return lines;
};

const getClassesMapping = () => {
  const csv = loadCSVFile();
  const result = [];
  for (let line of csv) {
    const oldValue = line.split(',')[0];
    const newValue = line.split(',')[1];
    result.push([oldValue, newValue]);
  }

  // renderscript must be added to the canonical androidx-class-mapping.csv - it is not upstream
  result.push(['android.support.v8.renderscript', 'android.renderscript']);

  return result;
};

module.exports = {
  getClassesMapping,
  readDir,
  chunk
};

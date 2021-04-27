const bplistParser = require('bplist-parser')
const bplistCreator = require('bplist-creator')
const plist = require('plist')
const fs = require('fs')

function parse(aStringOrBuffer, aFile) {
  const firstByte = aStringOrBuffer[0]
  let results
  try {
    if (firstByte === 60 || firstByte === '<') {
      results = plist.parse(aStringOrBuffer.toString())
    } else if (firstByte === 98) {
      ;[results] = bplistParser.parseBuffer(aStringOrBuffer)
    } else if (aFile != null) {
      throw new Error(`Unable to determine format for '${aFile}'`)
    } else {
      throw new Error('Unable to determine format for plist aStringOrBuffer')
    }
  } catch (error) {
    throw new Error(error)
  }
  return results
}

function readFileSync(aFile) {
  const contents = fs.readFileSync(aFile)
  if (contents.length === 0) {
    return {}
  }
  return parse(contents, aFile)
}

function readFile(aFile, callback) {
  fs.readFile(aFile, (err, contents) => {
    let results
    if (err) {
      callback(err)
    }
    try {
      results = parse(contents, aFile)
      callback(null, results)
    } catch (error) {
      callback(error)
    }
  })
}

function writeFileSync(aFile, anObject, options) {
  const data = plist.build(anObject)
  return fs.writeFileSync(aFile, data, options)
}

function writeFile(aFile, anObject, options, callback) {
  if (arguments.length === 3 && typeof options === 'function') {
    fs.writeFile(aFile, plist.build(anObject), options)
  } else {
    fs.writeFile(aFile, plist.build(anObject), options, callback)
  }
}

function writeBinaryFileSync(aFile, anObject, options) {
  return fs.writeFileSync(aFile, bplistCreator(anObject), options)
}

function writeBinaryFile(aFile, anObject, options, callback) {
  if (arguments.length === 3 && typeof options === 'function') {
    fs.writeFile(aFile, bplistCreator(anObject), options)
  } else {
    fs.writeFile(aFile, bplistCreator(anObject), options, callback)
  }
}

function stringify(anObject) {
  return plist.build(anObject)
}

module.exports = {
  bplistCreator,
  bplistParser,
  parse,
  plist,
  readFile,
  readFileSync,
  stringify,
  writeBinaryFile,
  writeBinaryFileSync,
  writeFile,
  writeFileSync
}

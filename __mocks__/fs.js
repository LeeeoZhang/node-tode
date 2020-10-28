const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

let readMocks = {}
fs.setReadMock = (path, err, data) => {
	readMocks[path] = [err, data]
}
fs.readFile = (path, options, callback) => {
	if (callback === undefined) callback = options
	if (path in readMocks) {
		callback(...readMocks[path])
	} else {
		_fs.readFile(path, options, callback)
	}
}

let writeMocks = {}
fs.setWriteMocks = (path, fn) => {
	writeMocks[path] = fn
}
fs.writeFile = (file, data, options, callback) => {
	if (callback === undefined) callback = options
	if (file in writeMocks) {
		writeMocks[file](file, data)
		callback()
	} else {
		_fs.writeFile(file, data, options, callback)
	}
}

fs.clearMocks = () => {
	readMocks = {}
	writeMocks = {}
}

module.exports = fs
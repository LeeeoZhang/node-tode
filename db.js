const path = require('path')
const fs = require('fs')
const homePath = require('os').homedir()

const home = process.env.HOME || homePath
const dbPath = path.join(home, '.todo')

const db = {
	read(path = dbPath) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, { flag: 'a+' }, (err, data) => {
				let taskList
				if (err) return reject(err)
				try {
					taskList = JSON.parse(data.toString())
				} catch (e) {
					taskList = []
				}
				resolve(taskList)
			})
		})
	},
	write(taskList, path = dbPath) {
		return new Promise((resolve, reject) => {
			const taskListString = `${JSON.stringify(taskList)}\n`
			fs.writeFile(path, taskListString, err => {
				if (err) return reject(err)
				resolve()
			})
		})
	},
}

module.exports = db
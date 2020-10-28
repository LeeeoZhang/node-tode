#!/usr/bin/env node
const program = require('commander')
const api = require('./index.js')
const pkg = require('./package.json')

program
	.version(pkg.version)

program
	.command('add')
	.description('add a task')
	.action((cmdObj, tasks = []) => {
		api.add(tasks.join(' ')).then(() => console.log('Add succeed!')).catch(() => console.log('Add failed.'))
	})


program
	.command('clear')
	.description('clear task')
	.action(() => {
		api.clear().then(() => console.log('Clear succeed!')).catch(() => console.log('Clear failed.'))
	})

if (process.argv.length === 2) {
	//no user arg
	api.showAll().then(() => console.log('Show all succeed!')).catch(() => console.log('Show all failed.'))
	return
}

program.parse(process.argv)
const inquirer = require('inquirer')
const db = require('./db')

module.exports.add = async (title) => {
	//read the .todo file
	const taskList = await db.read()
	//add a task
	taskList.push({ title, done: false })
	//save the task to .todo file
	await db.write(taskList)
}

module.exports.clear = async () => {
	await db.write([])
}

function printTasks(taskList) {
	inquirer.prompt({
		type: 'list',
		name: 'taskIndex',
		choices: [
			{ name: '退出', value: '-1' },
			...taskList.map((task, index) => {
				return {
					name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`,
					value: `${index}`,
				}
			}),
			{ name: '+ 创建任务', value: '-2' },
		]
	}).then(ans => {
		const taskIndex = parseInt(ans.taskIndex)
		if (taskIndex >= 0) {
			//choose a task
			askForAction(taskList, taskIndex)
		}
		if (taskIndex === -2) {
			createTask(taskList)
		}
	})
}

function askForAction(taskList, taskIndex) {
	const actions = { markAsDone, markAsUndone, updateTaskTitle, removeTask }
	inquirer.prompt({
		type: 'list',
		name: 'action',
		choices: [
			{ name: '退出', value: 'quit' },
			{ name: '未完成', value: 'markAsUndone' },
			{ name: '已完成', value: 'markAsDone' },
			{ name: '改标题', value: 'updateTaskTitle' },
			{ name: '删除', value: 'removeTask' },
		],
	}).then(ans => {
		const action = actions[ans.action]
		action && action(taskList, taskIndex)
	})
}

function createTask(taskList) {
	inquirer.prompt({
		type: 'input',
		name: 'title',
		message: '输入任务标题',
	}).then(ans => {
		taskList.push({ title: ans.title, done: false })
		db.write(taskList)
	})
}

function markAsUndone(taskList, taskIndex) {
	taskList[taskIndex].done = false
	db.write(taskList)
}

function markAsDone(taskList, taskIndex) {
	taskList[taskIndex].done = true
	db.write(taskList)
}

function updateTaskTitle(taskList, taskIndex) {
	inquirer.prompt({
		type: 'input',
		name: 'title',
		message: '输入新的标题',
		default: taskList[taskIndex].title
	}).then(ans => {
		taskList[taskIndex].title = ans.title
		db.write(taskList)
	})
}

function removeTask(taskList, taskIndex) {
	taskList.splice(taskIndex, 1)
	db.write(taskList)
}

module.exports.showAll = async () => {
	const taskList = await db.read()
	printTasks(taskList)
}
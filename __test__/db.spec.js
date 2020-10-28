const db = require('../db')
const fs = require('fs')
jest.mock('fs')

describe('db', () => {
	afterEach(() => {
		fs.clearMocks()
	})
	it('db.read is a function', () => {
		expect(db.read instanceof Function).toBe(true)
	})
	it('db.write is a function', () => {
		expect(db.write instanceof Function).toBe(true)
	})
	it('can read', async () => {
		const data = [{ title: 'task1', done: false }]
		fs.setReadMock('/xx', null, JSON.stringify(data))
		const list = await db.read('/xx')
		expect(list).toStrictEqual(data)
	})
	it('can write', async () => {
		const mockPath = '/yyy'
		let fakeData = ''
		fs.setWriteMocks(mockPath, (path, data) => {
			fakeData = data
		})
		const list = [{ title: 'task1', done: false }]
		await db.write(list, mockPath)
		expect(fakeData).toBe(JSON.stringify(list) + '\n')
	})
})
import { data } from '../data'
import config from '../../config'
import { getBossName, formatSeconds, getArea } from '../utils/utils'

let chestsFound = 0
let gemstoneObtained = 0
let mithrilObtained = 0
let timer = false
let time = 0

let isX2Powder = false

register('chat', () => {
	if (!config.chestSession) return
	chestsFound++
	if (!timer) timer = true
}).setCriteria('You have successfully picked the lock on this chest!')

register('chat', (amount, type) => {
	if (!config.chestSession) return
	if (amount.includes(',')) amount = amount.replace(',', '')
	switch (type) {
		case 'Gemstone':
			if (!isX2Powder) {
				gemstoneObtained += parseInt(amount)
			} else gemstoneObtained += 2 * parseInt(amount)
			break
		case 'Mithril':
			if (!isX2Powder) {
				mithrilObtained += parseInt(amount)
			} else mithrilObtained += 2 * parseInt(amount)
			break
		default:
	}
}).setCriteria(/You received \+(.+) (.+) Powder\./)

register('chat', (amount, type, event) => {
	if (!config.fixPowder) return
	if (!isX2Powder) return
	cancel(event)
	if (amount.includes(',')) amount = amount.replace(',', '')
	ChatLib.chat(`&r&aYou received &r&b+${(parseInt(amount) * 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} &r&a${type} Powder. &b(&a&lX2 POWDER&b)`)
}).setCriteria(/You received \+(.+) (.+) Powder\./)

register('renderOverlay', () => {
	if (!config.chestSession) return
	if (getArea() == 'Crystal Hollows') {
		new Text('Time Elapsed: ' + formatSeconds(time), data.powderCoords.x, data.powderCoords.y - 10).setShadow(true).setColor(Renderer.AQUA).draw()
		new Text('Chests Found: &6' + chestsFound, data.powderCoords.x, data.powderCoords.y).setShadow(true).setColor(Renderer.AQUA).draw()
		new Text('Gemstone Found: ' + gemstoneObtained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), data.powderCoords.x, data.powderCoords.y + 10)
			.setShadow(true)
			.setColor(Renderer.LIGHT_PURPLE)
			.draw()
		new Text('Mithril Found: ' + mithrilObtained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), data.powderCoords.x, data.powderCoords.y + 20)
			.setShadow(true)
			.setColor(Renderer.GREEN)
			.draw()
		if (x2Timer != null) {
			new Text('X2 Powder: &a&l' + formatSeconds(x2Timer), data.powderCoords.x, data.powderCoords.y + 30).setShadow(true).setColor(Renderer.AQUA).draw()
		}
	}
})

register('worldLoad', () => {
	chestsFound = 0
	gemstoneObtained = 0
	mithrilObtained = 0
	timer = false
	time = 0
	x2Timer = null
	isX2Powder = false
})

let X2Time
let x2Timer = null

register('tick', () => {
	if (!config.chestSession) return
	if (x2Timer < 0) {
		isX2Powder = false
		x2Timer = null
	}

	if (x2Timer == null && isX2Powder) {
		let bossMatch = getBossName()?.match(/.{0,4}PASSIVE EVENT .{0,4}2X POWDER .{0,4}RUNNING FOR .{0,4}(\d\d:\d\d)../)
		if (bossMatch == null || bossMatch[1].toString() == '00:00') return
		X2Time = bossMatch[1].toString().split(':')
		let min = parseInt(X2Time[0])
		let sec = parseInt(X2Time[1])
		x2Timer = min * 60 + sec
	}

	if (!isX2Powder && getBossName() != null) {
		if (getBossName().includes('2X POWDER') && !getBossName().includes('00:00')) {
			if (x2Timer != null && x2Timer < 10) return
			isX2Powder = true
		}
	}
})
register('step', () => {
	if (!config.chestSession || !config.fixPowder) return
	if (timer) time++
	if (x2Timer != null) x2Timer--
}).setFps(1)

register('chat', () => {
	isX2Powder = false
	x2Timer = null
}).setCriteria('                           2X POWDER ENDED!')


register('renderOverlay', () => {
	if (config.powderGui.isOpen() && time == 0) {
		new Text('Time Elapsed: ' + '0s', data.powderCoords.x, data.powderCoords.y - 10).setShadow(true).setColor(Renderer.AQUA).draw()
		new Text('Chests Found: &6' + '0', data.powderCoords.x, data.powderCoords.y).setShadow(true).setColor(Renderer.AQUA).draw()
		new Text('Gemstone Found: ' + '69,420', data.powderCoords.x, data.powderCoords.y + 10).setShadow(true).setColor(Renderer.LIGHT_PURPLE).draw()
		new Text('Mithril Found: ' + '69,420', data.powderCoords.x, data.powderCoords.y + 20).setShadow(true).setColor(Renderer.GREEN).draw()
	}
})

register('dragged', (dx, dy, x, y) => {
	if (!config.powderGui.isOpen()) return
	data.powderCoords.x = x
	data.powderCoords.y = y
	data.save()
})

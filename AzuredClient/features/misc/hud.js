import { data } from '../data'
import config from '../../config'
import { registerWhen } from '../../../BloomCore/utils/Utils'
import { getArea } from '../utils/utils'
import { robotoFont } from '../utils/utils'

const S37PacketStatistics = Java.type('net.minecraft.network.play.server.S37PacketStatistics')
const C16PacketClientStatus = Java.type('net.minecraft.network.play.client.C16PacketClientStatus')
const S03_PACKET_TIME_UPDATE = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate')

let prevTime = null
let averageTps = 20
const tpsWindow = 10

const S01PacketJoinGame = Java.type('net.minecraft.network.play.server.S01PacketJoinGame')
const System = Java.type('java.lang.System')

let isPinging = false

let pingCache = -1
let lastPingAt = -1


function sendPing() {
	if (!isPinging) {
		Client.sendPacket(new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS))
		lastPingAt = System.nanoTime()
		isPinging = true
	}
}

register('step', () => {
	if (config.pingHUD) sendPing()
}).setDelay(2)

register('worldLoad', () => {
	prevTime = null
	averageTps = 20
	pingCache = -1
	isPinging = false
})


registerWhen(register('packetReceived', () => {
	if (lastPingAt > 0) {
		lastPingAt = -1
		isPinging = false
	}
}).setFilteredClass(S01PacketJoinGame), () => config.pingHUD)

registerWhen(register('packetReceived', () => {
	if (lastPingAt > 0) {
		let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000)
		lastPingAt *= -1
		pingCache = diff
		isPinging = false
	}
}).setFilteredClass(S37PacketStatistics), () => config.pingHUD)

registerWhen(register('packetReceived', () => {
	if (prevTime !== null) {
		let time = Date.now() - prevTime
		let instantTps = MathLib.clampFloat(20000 / time, 0, 20)
		let alpha = 2 / (tpsWindow + 1)
		averageTps = instantTps * alpha + averageTps * (1 - alpha)
	}
	prevTime = Date.now()
}).setFilteredClass(S03_PACKET_TIME_UPDATE), () => config.tpsHUD)

// BPS

let blocksBroken = 0
let BPS = 0
let isBreaking = false
let lastBrokenBlock = 0
let startTime = 0

registerWhen(register('blockBreak', () => {
	if (config.bpsGarden && getArea() != 'Garden') return
	if (!startTime) startTime = Date.now()
	isBreaking = true
	blocksBroken++
	lastBrokenBlock = Date.now()
}), () => config.bpsHUD)

registerWhen(register('tick', () => {
	if (config.bpsGarden && getArea() != 'Garden') return
	if (!isBreaking) return
	let secondsElapsed = (Date.now() - startTime) / 1000
	BPS = Math.min((blocksBroken / secondsElapsed).toFixed(2), 20)

	if (Date.now() - lastBrokenBlock > 1000 * config.bpsReset) {
		BPS = 0
		isBreaking = false
		blocksBroken = 0
		startTime = 0
		secondsElapsed = 0
		lastBrokenBlock = 0
	}
}), () => config.bpsHUD)

registerWhen(register('renderOverlay', () => {
	if (config.pingHUD) {
		robotoFont.drawStringWithShadow(
			`PING: §f${parseInt(pingCache)}`,
			data.pingCoords.x,
			data.pingCoords.y,
			config.hudColor
		)
	}
	if (config.tpsHUD) {
		robotoFont.drawStringWithShadow(
			`TPS: §f${averageTps.toFixed(1)}`,
			data.tpsCoords.x,
			data.tpsCoords.y,
			config.hudColor
		)

	}
	if (config.bpsHUD) {
		if (config.bpsGarden && getArea() != 'Garden') return
		robotoFont.drawStringWithShadow(
			`BPS: §f${BPS}`,
			data.bpsCoords.x,
			data.bpsCoords.y,
			config.hudColor
		)
	}

	if (config.fpsHUD) {
		robotoFont.drawStringWithShadow(
			`FPS: §f${Client.getFPS()}`,
			data.fpsCoords.x,
			data.fpsCoords.y,
			config.hudColor
		)
	}


}), () => config.pingHUD || config.tpsHUD || config.fpsHUD || config.bpsHUD)

registerWhen(register('renderOverlay', () => {
	if ((config.pingGui.isOpen() && !config.pingHUD) || config.hudGui.isOpen() && !config.pingHUD) {
		robotoFont.drawStringWithShadow(
			`PING: §f150`,
			data.pingCoords.x,
			data.pingCoords.y,
			config.hudColor
		)
	}

	if ((config.tpsGui.isOpen() && !config.tpsHUD) || config.hudGui.isOpen() && !config.tpsHUD) {
		robotoFont.drawStringWithShadow(
			`TPS: §f20.0`,
			data.tpsCoords.x,
			data.tpsCoords.y,
			config.hudColor
		)
	}

	if ((config.fpsGui.isOpen() && !config.fpsHUD) || config.hudGui.isOpen() && !config.fpsHUD) {
		robotoFont.drawStringWithShadow(
			`FPS: §f144`,
			data.fpsCoords.x,
			data.fpsCoords.y,
			config.hudColor
		)
	}

	if ((config.bpsGui.isOpen() && !config.bpsHUD) || config.hudGui.isOpen() && !config.bpsHUD) {
		robotoFont.drawStringWithShadow(
			`BPS: §f20.0`,
			data.bpsCoords.x,
			data.bpsCoords.y,
			config.hudColor
		)
	}
}), () => config.pingGui.isOpen() || config.tpsGui.isOpen() || config.bpsGui.isOpen() || config.fpsGui.isOpen() || config.hudGui.isOpen())


register('dragged', (dx, dy, x, y) => {
	if (config.pingGui.isOpen()) {
		data.pingCoords.x = x
		data.pingCoords.y = y
		data.save()
	}
	if (config.tpsGui.isOpen()) {
		data.tpsCoords.x = x
		data.tpsCoords.y = y
		data.save()
	}

	if (config.bpsGui.isOpen()) {
		data.bpsCoords.x = x
		data.bpsCoords.y = y
		data.save()
	}

	if (config.fpsGui.isOpen()) {
		data.fpsCoords.x = x
		data.fpsCoords.y = y
		data.save()
	}

	if (config.hudGui.isOpen()) {
		data.pingCoords.x += dx
		data.pingCoords.y += dy
		data.tpsCoords.x += dx
		data.tpsCoords.y += dy
		data.bpsCoords.x += dx
		data.bpsCoords.y += dy
		data.fpsCoords.x += dx
		data.fpsCoords.y += dy
		data.save()
	}
})
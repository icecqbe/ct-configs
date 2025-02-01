import { onChatPacket } from "../../../BloomCore/utils/Events"
import config from "../../config"
import { data } from "../data"
import { S02PacketChat, S32PacketConfirmTransaction, isInBoss, isInP3 } from "../utils/utils"
let barrierTicks = 0
let timeText = new Text('').setScale(1).setShadow(true).setAlign('CENTER')
let isTimerActive = false

const set = () => {
    barrierTicks = 60;
    timerRenderer.register()
    tickCounter.register()
    isTimerActive = true
}

const reset = () => {
    barrierTicks = 0;
    tickCounter.unregister()
    timerRenderer.unregister()
    isTimerActive = false
}

const timerRenderer = register('renderOverlay', () => {
    let a = (barrierTicks / 20).toFixed(2)
    let formattedTime = a >= 2 ? `&a${a}` : (a >= 1 ? `&e${a}` : `&c${a}`)
    timeText.setString(formattedTime)
    timeText.draw(data.tickTimerCoords.x, data.tickTimerCoords.y)
}).unregister()

const tickCounter = register('packetReceived', () => {
    barrierTicks--
    if (barrierTicks <= 0) barrierTicks = 60
}).setFilteredClass(S32PacketConfirmTransaction).unregister() // Gets sent every tick

let procMessages = [
    /^\[BOSS\] Goldor: Who dares trespass into my domain\?$/, // [BOSS] Goldor: Who dares trespass into my domain?
    /^\[BOSS\] Goldor: What do you think you are doing there!$/,
    /Party > (?:\[.+\])? ?(?:.+) ?[ቾ⚒]?: (Bonzo|Phoenix) Procced!?(?: \(3s\))?/
]

register('packetReceived', (packet) => {
    if (packet.func_148916_d() || !config.tickTimer || !isInBoss()) return
    const message = packet.func_148915_c().func_150254_d().removeFormatting()
    procMessages.forEach(m => {
        let match = message.match(m)
        if (!match || !isInP3()) return
        set()
    })

    if (message == "The Core entrance is opening!") {
        reset()
    }
}).setFilteredClass(S02PacketChat)

register('worldUnload', () => {
    if (!config.tickTimer) return
    reset()
})

// god why do people want to move so much stuff

register('renderOverlay', () => {
	if (config.goldorTimer.isOpen() && !isTimerActive) {
        timeText.setString('&a3.00')
        timeText.draw(data.tickTimerCoords.x, data.tickTimerCoords.y)
	}
})

register('dragged', (dx, dy, x, y, bn) => {
	if (!config.goldorTimer.isOpen() || bn == 2) return
	data.tickTimerCoords.x = x
	data.tickTimerCoords.y = y
	data.save()
})

register('guiMouseClick', (x,y,bn) => {
    if (!config.goldorTimer.isOpen() || bn != 2) return
    data.tickTimerCoords.x = Renderer.screen.getWidth() / 2
	data.tickTimerCoords.y = Renderer.screen.getHeight() / 2 + 10
	data.save()
})
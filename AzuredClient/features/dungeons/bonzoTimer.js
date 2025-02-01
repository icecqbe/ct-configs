import config from "../../config"
import { data } from "../data"
import { isInBoss, S32PacketConfirmTransaction } from "../utils/utils"

let timer = new Text('').setScale(1.5).setShadow(true).setAlign('CENTER')
let ticks = 0
let a = 0

const tickCounter = register('packetReceived', () => {
    ticks--
    if (ticks <= 0) tickCounter.unregister()
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

let invincibilityMessages = new Map([
    [/^Your (?:. )?Bonzo's Mask saved your life!$/, 60],
    [/^Your Phoenix Pet saved you from certain death!$/, 60],
    [/^Second Wind Activated! Your Spirit Mask saved your life!$/, 60]
])

Array.from(invincibilityMessages.keys()).forEach(message => {
    register('chat', (e) => {
        let triggeredMessage = ChatLib.getChatMessage(e)

        if (config.invincibilityAnnounce && isInBoss()) {
            triggeredMessage.includes('Bonzo\'s Mask') ? ChatLib.command('pc Bonzo Procced (3s)') : ChatLib.command('pc Phoenix Procced (3s)')
        }
        
        if (!config.invincibilityTimers) return
        ticks = invincibilityMessages.get(message)
        tickCounter.register()
        timerRenderer.register()
    }).setCriteria(message)
})

const timerRenderer = register('renderOverlay', () => {
    a = (ticks / 20).toFixed(3)
    let formattedTime = a >= (((60 * 50) / 100) / 20) ? `&a${a}` : (a >= (((60 * 25) / 100) / 20) ? `&e${a}` : `&c${a}`)
    timer.setString(formattedTime)
    timer.draw(data.invincibilityCoords.x, data.invincibilityCoords.y)
    if (a == 0) timerRenderer.unregister()
}).unregister()

register('worldUnload', () => {
    if (a != 0) timerRenderer.unregister()
})

// move thing

register('renderOverlay', () => {
	if (config.invincibilityTimer.isOpen()) {
        timer.setString('&a3.000')
        timer.draw(data.invincibilityCoords.x, data.invincibilityCoords.y)
	}
})

register('dragged', (dx, dy, x, y, bn) => {
	if (!config.invincibilityTimer.isOpen() || bn == 2) return
	data.invincibilityCoords.x = x
	data.invincibilityCoords.y = y
	data.save()
})

register('guiMouseClick', (x,y,bn) => {
    if (!config.invincibilityTimer.isOpen() || bn != 2) return
    data.invincibilityCoords.x = Renderer.screen.getWidth() / 2
	data.invincibilityCoords.y = Renderer.screen.getHeight() / 2 - 20
	data.save()
})
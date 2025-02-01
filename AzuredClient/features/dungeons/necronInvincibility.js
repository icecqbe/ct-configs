import { onChatPacket } from "../../../BloomCore/utils/Events"
import config from "../../config"
import { S32PacketConfirmTransaction } from "../utils/utils"
let timer = new Text('').setScale(1).setShadow(true).setAlign('CENTER')
let ticks = 0
let reset = false
const INVINCIBILITY_TICKS = 163 // (8.15*20)

register('worldUnload', () => {
    reset = false
})

const tickCounter = register('packetReceived', () => {
    ticks--
    if (ticks <= 0) tickCounter.unregister()
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

onChatPacket(() => {
    if (reset || !config.necronTimer) return
    timerRenderer.register()
    triggeredTime = Date.now()
    tickCounter.register()
    ticks = INVINCIBILITY_TICKS
    reset = true
}).setCriteria(/^\[BOSS\] Necron: .+$/)

const timerRenderer = register('renderOverlay', () => {
    let a = (ticks / 20).toFixed(3)
    let formattedTime = a >= (((INVINCIBILITY_TICKS * 50) / 100) / 20) ? `&a${a}` : (a >= (((INVINCIBILITY_TICKS * 25) / 100) / 20) ? `&e${a}` : `&c${a}`)
    timer.setString(formattedTime)
    timer.draw((Renderer.screen.getWidth()) / 2, (Renderer.screen.getHeight()) / 2 + 10)
    if (a == 0) timerRenderer.unregister()
}).unregister()
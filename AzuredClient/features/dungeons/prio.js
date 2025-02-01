import { registerWhen } from "../../../BloomCore/utils/Utils"
import { S32PacketConfirmTransaction, getClass, getPower } from '../utils/utils'
import config from "../../config"
import { onChatPacket } from "../../../BloomCore/utils/Events"

const S2APacketParticles = Java.type('net.minecraft.network.play.server.S2APacketParticles')
let timeText = new Text('').setScale(2).setShadow(true).setAlign('CENTER')
let text = new Text('').setScale(3.8).setShadow(true).setAlign('CENTER')
let isInP5 = false

const dragonTexts = new Map([
    ['o', '&l&6ORANGE'],
    ['g', '&l&aGREEN'],
    ['r', '&l&cRED'],
    ['b', '&l&bBLUE'],
    ['p', '&l&5PURPLE'],
])

const dragonKillTexts = ["Oh, this one hurts!", "My soul is disposable.", "I have more of those.", // When statue is destroyed
"Your skills have faded humans.", "I am not impressed.", "Futile.", "You just made a terrible mistake!" // When dragon is killed outside of statue
] 

let spawningDragons = []

onChatPacket((text) => {    /// You... again?
    if (text == "You... again?") {
        isInP5 = true
        playerClass = getClass()
    } else if (dragonKillTexts.includes(text)) {
        spawningDragons = []
    }

}).setCriteria(/^\[BOSS\] Wither King: (.+)$/)

register('worldUnload', () => {
    isInP5 = false
    spawningDragons = []
})

let ticks = 0

function isDragon(packet) {
    const count = packet.func_149222_k()
    const isLongDistance = packet.func_179750_b()
    const speed = packet.func_149227_j()
    const xOffset = packet.func_149221_g()
    const y = parseInt(packet.func_149226_e())
    const yOffset = packet.func_149224_h()
    const zOffset = packet.func_149223_i()

    return (count == 20 && y == 19 && xOffset == 2 && yOffset == 3 && zOffset == 2 && speed == 0 && isLongDistance)
}

registerWhen(register("packetReceived", (packet) => {
    if (packet.func_179749_a().toString() != "FLAME") return
    if (!isDragon(packet)) return

    if (config.debuffTrack) debuffListener()
    if (!config.dragonSplit) return

    const x = parseInt(packet.func_149220_d())
    const z = parseInt(packet.func_149225_f())

    handleDragonSpawns(x, z)

    if (playerClass == 'EMPTY') {
        ChatLib.chat("§6[§bAzuredClient§6]§c There was an error while getting class.")
        return
    }
    handleNotifications()
}).setFilteredClass(S2APacketParticles), () => isInP5)

function handleNotifications() {
    if (ticks != 0 && ticks != 100) return
    const sortedDragon = dragonTexts.get(sortPrio(spawningDragons))
    if (!sortedDragon) return

    text.setString(sortedDragon)
    ticks = 100
    World.playSound("note.pling", 1.0, 2.0);
    tickCounter.register()
    dragonText.register()   
    if (config.dragonTimer) timerRenderer.register()
}
const dragonText = register('renderOverlay', () => {
    text.draw((Renderer.screen.getWidth()) / 2, (Renderer.screen.getHeight()) / 2 - 40)
    if (ticks <= 60) dragonText.unregister()
}).unregister()

const tickCounter = register('packetReceived', (packet) => {
    ticks--
    if (ticks <= 0) tickCounter.unregister()
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

const timerRenderer = register('renderOverlay', () => {
    let spawningTime = (ticks / 20).toFixed(3)
    timeText.setString(spawningTime >= 3 ? `&a${spawningTime}` : (spawningTime >= 1 ? `&e${spawningTime}` : `&c${spawningTime}`))
    timeText.draw((Renderer.screen.getWidth()) / 2, (Renderer.screen.getHeight()) / 2 + 20)
    if (spawningTime <= 0) timerRenderer.unregister()
}).unregister()

function handleDragonSpawns(x, z) {
    if (x >= 27 && x <= 32) {
        if (z == 59) { // Red
            addDrag('r')
        }
        if (z == 94) { // Green
            addDrag('g')
        }
    } else if (x >= 79 && x <= 85) {
        if (z == 94) { // Blue
            addDrag('b')
        }

        if (z == 56) { // Orange
            addDrag('o')
        }

    } else if (x == 56) { // Purple
        addDrag('p')
    }
}

// god
function sortPrio(spawningDragons) {
    spawningDragons.sort((first, second) => {
        let prioList;
        let power = getPower()
        if (power >= config.power || (spawningDragons.includes('p') && power >= config.easyPower)) {
            prioList = ('BerserkMage'.includes(playerClass)) ? Array.from(dragonTexts.keys()) : Array.from(dragonTexts.keys()).reverse()
        } else prioList = 'robpg'.split('')

        let firstPrio = prioList.indexOf(first)
        let secondPrio = prioList.indexOf(second)
        if (power >= config.easyPower) {
            if (config.soloDebuff == 1) {
                if (playerClass.includes('Tank')) {
                    if (spawningDragons.includes('p') || config.soloDebuffOnAll) return secondPrio - firstPrio
                }
            } else {
                if (playerClass.includes('Healer')) {
                    if (spawningDragons.includes('p') || config.soloDebuffOnAll) return secondPrio - firstPrio
                }
            }
        }
        return firstPrio - secondPrio
    })
    return spawningDragons[0]
}

function addDrag(drag) {
    if (!spawningDragons.includes(drag)) spawningDragons.push(drag)
}

// Shared Prio for some reason?? Idk who uses this
register('chat', (ign, paul, solo, easy, power, event) => {
    if (!config.dragonSplit) return
    if (ign == Player.getName()) {
        new Message(new TextComponent(`&6[&bAzuredClient&6]&a Successfully shared your priority config. Hover for info.`)
            .setHover("show_text", `&6Shared your config:
&cPaul Buff:&6 ${paul}
&cSolo Debuff:&6 ${solo == 0 ? 'Tank' : 'Healer'}
&cEasy Power:&6 ${easy}
&cPower:&6 ${power}`)).chat()
        cancel(event)
        return
    }
    new Message(new TextComponent(`&6[&bAzuredClient&6] ${ign} &6is sharing their priority config! Click to import it. Hover for more info.`)
        .setHover("show_text", `&6Click to import this config:
&cPaul Buff:&6 ${paul}
&cSolo Debuff:&6 ${solo == 0 ? 'Tank' : 'Healer'}
&cEasy Power:&6 ${easy}
&cPower:&6 ${power}`)
        .setClickValue(`/importprio ${paul} ${solo} ${easy} ${power}`).setClickAction('run_command')).chat()
    cancel(event)
}).setCriteria(/Party > (?:(?:\[.+\]))? ?(.+) ?[ቾ⚒]?: !sharedprio: Paul: (true|false) \| Solo Debuff: ([01]) \| Easy Power: (\d+) \| Power: (\d+)/)

function error() {
    ChatLib.chat("&6[&bAzuredClient&6]&c There was an error importing this config.")
}

register('command', (paul, solo, easy, power) => {
    if (paul != 'true' && paul != 'false') { // Anti Stupid, i can already see people using this command manually and importing some dumb shit
        error()
        return
    }
    if (solo != 0 && solo != 1) {
        error()
        return
    }
    if (!(easy >= 10 && easy <= 29)) {
        error()
        return
    }
    if (!(power >= 10 && power <= 29)) {
        error()
        return
    }
    config.paulBuff = paul === "true";
    config.soloDebuff = solo;
    config.easyPower = easy;
    config.power = power;
    ChatLib.chat("&6[&bAzuredClient&6]&a Successfully imported new priority.")
}).setName('importprio')

register('command', () => {
    config.sharePrio()
}).setName('shareprio')

// Debuff
let arrowsHit = 0;
let iceSprayHit = false

const arrowListener = register('soundPlay', () => {
    arrowsHit++
}).setCriteria("random.successful_hit").unregister()

const iceSprayListener = register('tick', () => {
    World.getAllEntitiesOfType(Java.type("net.minecraft.entity.item.EntityItem").class).filter(item => item?.getName() == "item.tile.ice").forEach(item => {
        if (item.getY() <= 30 && item.getY() >= 10 && item.distanceTo(Player.asPlayerMP()) <= 25) {
            iceSprayHit = true
        }
    })
}).unregister()

let listening = false

function debuffListener() {
    if (listening) return
    arrowsHit = 0
    iceSprayHit = false
    listening = true
    arrowListener.register()
    iceSprayListener.register()
    setTimeout(() => {
        arrowListener.unregister()
        iceSprayListener.unregister()
        listening = false
        ChatLib.chat(`§6[§bAzuredClient§6] Arrows detected: ${arrowsHit >= 3 ? "§a" : "§c"}${arrowsHit}. §6Ice Spray Detected: ${iceSprayHit ? "§a" : "§c"}${iceSprayHit}`)
    }, 6250)
}
import { getSlotCenter } from "../../../BloomCore/utils/Utils"
import { data } from "../data";
import config from "../../config"
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import Font from '../../../FontLib'

export const robotoFont = new Font('AzuredClient/features/utils/Roboto-Medium.ttf', 23)
export const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")
export const S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat")
export function distance(e) {
    return Math.floor(Math.sqrt(Math.pow(e?.getX() - Player?.getX(), 2) + Math.pow(e?.getY() - Player?.getY(), 2) + Math.pow(e?.getZ() - Player?.getZ(), 2)))
}


const BossStatus = Java.type('net.minecraft.entity.boss.BossStatus')

export function getBossName() {
    return BossStatus.field_82827_c // bossName
}

export function formatSeconds(seconds) {
    let hours = Math.floor(seconds / 3600)
    let minutes = Math.floor((seconds % 3600) / 60)
    let remainingSeconds = seconds % 60

    if (remainingSeconds < 10 && minutes !== 0) {
        remainingSeconds = '0' + remainingSeconds
    }

    if (hours === 0 && minutes === 0) {
        return `${remainingSeconds}s`
    } else if (hours === 0) {
        return `${minutes}m ${remainingSeconds}s`
    } else {
        return `${hours}h ${minutes}m ${remainingSeconds}s`
    }
}

export function getArea() {
    let area = 'null'
    try {
        TabList?.getNames()?.forEach(line => {
            let match = line.removeFormatting().match(/Area: (.+)/)
            if (line.removeFormatting() == 'Dungeon: Catacombs') area = 'Dungeons'
            if (!match) return
            area = match[1]
        })
    } catch (e) { }
    return area
}

export function isInDungeon() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Dungeon: Catacombs')
    } catch (e) { }
}

export function highlightSlot(slot, r, g, b, a) {
    let [x, y] = getSlotCenter(slot)
    Renderer.translate(0, 0, 100)
    Renderer.drawRect(Renderer.color(r, g, b, a), x - 8, y - 8, 16, 16);
}

const romanHash = {
    I: 1,
    V: 5,
    X: 10,
}

export function romanToInt(s) {
    let accumulator = 0
    for (let i = 0; i < s.length; i++) {
        if (s[i] === 'I' && (s[i + 1] === 'V' || s[i + 1] === 'X')) {
            accumulator += romanHash[s[i + 1]] - romanHash[s[i]]
            i++
        } else {
            accumulator += romanHash[s[i]]
        }
    }
    return accumulator
}

let inP3 = false;

register('packetReceived', (packet) => {
    if (packet.func_148916_d()) return
    const message = packet.func_148915_c().func_150254_d().removeFormatting()
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inP3 = true;
    }
    if (message == "The Core entrance is opening!")
        inP3 = false;
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S02PacketChat"))

export function isInP3() { return inP3 }
export function isInBoss() { return Dungeon.bossEntry }

export function sendPBMessage() {
    let msg = `§6[§bAzuredClient§6] Personal Bests §7(Hover for more info)`
    new Message(new TextComponent(msg).setHover("show_text", `&6Panes: &a${data['PB']['panes']}s
&6Color: &a${data['PB']['color']}s
&6Click in order: &a${data['PB']['numbers']}s
&6Melody: &a${data['PB']['melody']}s
&6Starts with: &a${data['PB']['startsWith']}s
&6Select all the: &a${data['PB']['select']}s
&e&l&m---------------------
&6Relic: &a${data['PB']['relic']}s`)).chat()
}

export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

export function getPower() {
    let footer = TabList?.getFooter()?.removeFormatting()
    let totalPower = 0
    powerMatch = footer.match(/Blessing of Power (.+)/)
    timeMatch = footer.match(/Blessing of Time (.+)/)

    if (!powerMatch) return
    totalPower = romanToInt(powerMatch[1])
    timeMatch ? totalPower += 2.5 : totalPower
    config.paulBuff ? totalPower *= 1.25 : totalPower

    return totalPower
}
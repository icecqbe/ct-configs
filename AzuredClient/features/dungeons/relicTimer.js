import { data } from "../data";
import config from "../../config";
import { onChatPacket } from "../../../BloomCore/utils/Events";

let relicTimer = 0
let finalPickedTimer = 0

onChatPacket((message) => {
    if (!config.relicTimer) return
    if (message != "All this, for nothing...") return
    relicTimer = Date.now()
}).setCriteria(/^\[BOSS\] Necron: (.+)$/)

onChatPacket((ign) => {
    if (ign != Player.getName() || !config.relicTimer) return
    finalPickedTimer = (Date.now() - relicTimer) / 1000
    rcListener.register()
    lcListener.register()
}).setCriteria(/^(\S+) picked the Corrupted \S+ Relic!$/)

const rcListener = register('playerInteract', (action, pos) => {
    if (action.toString() != "RIGHT_CLICK_BLOCK") return
    const blockClicked = World.getBlockAt(pos.getX(), pos.getY(), pos.getZ()).type.getRegistryName()
    if ((blockClicked != 'minecraft:cauldron' && blockClicked != 'minecraft:anvil') || (!Player.getHeldItem()?.getName()?.includes('Relic') && !Player.getHeldItem()?.getName()?.includes('SkyBlock Menu'))) return
    relicMessage()
}).unregister()

const lcListener = register('hitBlock', (block) => {
    const blockClicked = block.type.getRegistryName()
    if ((blockClicked != 'minecraft:cauldron' && blockClicked != 'minecraft:anvil') || (!Player.getHeldItem()?.getName()?.includes('Relic') && !Player.getHeldItem()?.getName()?.includes('SkyBlock Menu'))) return
    relicMessage()
}).unregister()

function relicMessage() {
    ChatLib.chat(`§6[§bAzuredClient§6] Relic picked up in §a${finalPickedTimer}s`)
    let finalRelicTime = (Date.now() - relicTimer) / 1000
    let msg = `§6[§bAzuredClient§6] Relic placed in §a${finalRelicTime}s`
    if (!data['PB']['relic'] || finalRelicTime < data['PB']['relic']) {
        msg += ' §d§l(PB)'
        data['PB']['relic'] = finalRelicTime
        data.save()
    } else msg += ` §8(§7${data['PB']['relic']}§8)`

    new Message(new TextComponent(msg).setHover("show_text", `&dPersonal Best: &a${data['PB']['relic']}s`)).chat()
    rcListener.unregister()
    lcListener.unregister()
}
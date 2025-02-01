/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import config from './config'

register('command', (arg) => {
    if (arg && arg.toLowerCase() == 'pb') {
        sendPBMessage()
    } else
        config.openGUI()
}).setName('azuredclient').setAliases('az')

import './features/data'
import './features/ch/CH'
import './features/ch/ChestSession'
import './features/misc/ChatEmotes'
import './features/misc/Render'
import './features/misc/SelfPartyBot'
import './features/misc/Blur'
import './features/misc/hud'
import './features/dungeons/blessings'
import './features/dungeons/terminalTime'
import './features/dungeons/necron'
import './features/dungeons/witherKey'
import './features/dungeons/melody'
import './features/dungeons/bonzoTimer'
import './features/garden/garden'
import './features/dungeons/prio'
import './features/dungeons/leapHighlight'
import './features/dungeons/necronInvincibility'
import './features/dungeons/tickTimer'
import './features/dungeons/leapAnnounce'
import './features/dungeons/relicTimer'
import { shownChangelog } from './features/data'
import { sendPBMessage } from './features/utils/utils'

const checker = register("tick", () => {
    checker.unregister()

    const metadata = JSON.parse(FileLib.read('AzuredClient', 'metadata.json'))
    if (metadata.version == shownChangelog.lastUpdatedVersion) return

    // Update last showed changelog
    shownChangelog.lastUpdatedVersion = metadata.version
    shownChangelog.save()
    const fileContent = FileLib.read("AzuredClient", "changelogLines.txt")
    const lines = fileContent.replace(/\r\n/g, "\n").split("\n")
    if (fileContent.length == 0) return
    setTimeout(() => {
        ChatLib.chat('&a&l&m--------------------------------------------')
        ChatLib.chat(ChatLib.getCenteredText(`&b&lAzuredClient ${metadata.version}`))
        lines.forEach(c => ChatLib.chat(ChatLib.getCenteredText('&7' + c)))
        ChatLib.chat(ChatLib.getCenteredText('&bThank you for installing!'))
        ChatLib.chat(ChatLib.getCenteredText('&cFor any bugs, dm me on discord (azuredblue)'))
        ChatLib.chat('&a&l&m--------------------------------------------')
    }, 300)
})
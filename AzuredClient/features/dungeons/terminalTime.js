import config from "../../config"
import { data } from '../data'
import { isInP3 } from "../utils/utils"

let inTerm = false
let timer = 0
let terminalFullName = ''

const relationToName = {
    panes: 'Correct all the panes!',
    color: 'Change all to same color!',
    numbers: 'Click in order!',
    melody: 'Click the button on time!',
    startsWith: 'What starts with:',
    select: 'Select all the',
}

function reset() {
    inTerm = false
    terminalFullName = ''
    timer = 0
    terminal = ''
}

register('guiOpened', () => {
    if (!config.terminalTimer || !isInP3()) return

    Client.scheduleTask(2, () => {
        const inv = Player.getContainer()
        if (inTerm && terminalFullName != inv?.getName()) reset()
        if (inTerm) return

        for (let names in relationToName) {
            if (inv?.getName()?.startsWith(relationToName[names])) {
                inTerm = true
                terminalFullName = inv?.getName()
                timer = Date.now()
            }
        }
    })
})

register('chat', (name) => {
    if (!config.terminalTimer || !inTerm || !isInP3()) return
    if (name != Player.getName()) return
    inTerm = false
    let time = (Date.now() - timer) / 1000
    let msg = `§6[§bAzuredClient§6] §a"${terminalFullName}" §6took §a${time}s`

    for (let name in relationToName) {
        if (terminalFullName.includes(relationToName[name])) {
            terminal = name
            if (!data['PB'][terminal] || time < data['PB'][terminal]) {
                data['PB'][terminal] = time
                data.save()
                msg += ' §d§l(PB)'
                if (config.terminalTimerPB) {
                    new Message(new TextComponent(msg).setHover("show_text", `&dPersonal Best: &a${data['PB'][terminal]}`)).chat()
                }
            } else msg += ` §8(§7${data['PB'][terminal]}§8)`
        }
    }

    if (!config.terminalTimerPB) {
        new Message(new TextComponent(msg).setHover("show_text", `&dPersonal Best: &a${data['PB'][terminal]}`)).chat()
    }

    terminalFullName = ''
    terminal = ''
}).setCriteria(/(.+) [activated|completed]+ a terminal! \(\d\/\d\)/)

register('chat', (name, phase) => {
    if (phase == '(7/7)' || phase == '(8/8)') {
        inTerm = false
        terminalFullName = ''
        terminal = ''
    }

}).setCriteria(/(.+) [activated|completed]+ a [terminal|lever]! (\(\d\/\d\))/)
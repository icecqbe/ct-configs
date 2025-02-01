import config from "../../config"
import { isInBoss } from "../utils/utils"

register("chat", (name) => {
    if (!config.leapAnnounce) return
    if (!isInBoss()) return
    ChatLib.command(`pc Leaped to ${name}!`)
}).setCriteria("You have teleported to ${name}!")

register('chat', (from, to, event) => {
    if (config.hideLeap == 1 && from == Player.getName()) cancel(event)
    if (config.hideLeap == 2 && to != Player.getName()) cancel(event)
    if (config.hideLeap == 3) cancel(event)
}).setCriteria(/Party > (?:\[.+\])? ?(.+) ?[ቾ⚒]?: Leaped to (\S+)!?/)
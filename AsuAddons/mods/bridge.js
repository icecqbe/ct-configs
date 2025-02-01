import { data, modPrefix } from "../index.js"

register("chat", (channel,event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    if (unformattedMessage.replace(/\[[^\]]+\]/, "").replace(/ /g, "").toLowerCase().replace(/(guild>|officer>)/,"").startsWith(data.bridge.botIGN.toLowerCase()) && unformattedMessage.toLowerCase() != "guild > " + data.bridge.botIGN.toLowerCase() + " joined.") {
        unformattedMessage = unformattedMessage.split(":").splice(1,unformattedMessage.length)
        unformattedMessage[0] = unformattedMessage[0].replace(" ", "")
        unformattedMessage[1] = unformattedMessage.splice(1).join(":").replace(" ", "")
        cancel(event)
        ChatLib.chat(data.bridge[channel == "Guild" ? "bridgeMessage" : "officerMessage"].replace("<1>", unformattedMessage[0]).replace("<2>", unformattedMessage[1]))
    }

}).setCriteria(/(Guild|Officer) > (?:\[[^\]]+\] )?.* ?(?:\[[^\]]+\])?: .*/).setStart()

register("command", (...args) => {
    if (args[0]) {
        data.bridge.botIGN = args[0].toLowerCase()
        data.save()
        ChatLib.chat(modPrefix + " §aSet the Bridge Bot IGN to " + args[0] + ".")
    } else {
        ChatLib.chat("§cUsage: /bridgeset <ign>")
    }
}).setName("bridgeset")

register("command", (...args) => {
    if (args[0]) {
        if (args.join(" ").includes("<1>") && args.join(" ").includes("<2>")) {
            data.bridge.bridgeMessage = args.join(" ")
            data.save()
            ChatLib.chat(modPrefix + " §aSet the Bridge message to §r\"" + args.join(" ") + "§r\".")
        } else {
            ChatLib.chat("§cBridge message must include <1> and <2>.\n§c<1> being the message sender and <2> being the message.\m§cUse & for colours.")
        }
    } else {
        ChatLib.chat("§cUsage: /bridgemessage <message>")
    }
}).setName("bridgemessage")
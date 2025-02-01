register("packetSent", (packet, event) => {
    let message = packet.func_149439_c()
    if(findImgurLinks(message).length <= 0) return
    cancel(event)
    ChatLib.say(modifyImgurLinks(message))
}).setFilteredClass(net.minecraft.network.play.client.C01PacketChatMessage)

register("chat", (event) => {
    let message = ChatLib.getChatMessage(event, true)
        if (findModifiedImgurLinks(message).length <= 0) return
            cancel(event)
            ChatLib.chat(convertBackToImgurLinks(message))
})

function modifyImgurLinks(inputString) {
    const imgurRegex = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(jpg|jpeg|png)/g;
    const modifiedString = inputString.replace(imgurRegex, 'ImgurLinks/$1');
    return modifiedString;
}

function findImgurLinks(inputString) {
    const imgurRegex = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(jpg|png|jpeg)/g;
    const matches = [];
    let match;
    while ((match = imgurRegex.exec(inputString)) !== null) {
      matches.push(match[0]);
    }
    return matches;
}

function convertBackToImgurLinks(inputString) {
    const imgurLinkRegex = /ImgurLinks\/([a-zA-Z0-9]+)/g;
    const convertedString = inputString.replace(imgurLinkRegex, '👾https://i.imgur.com/$1.png');
    return convertedString;
}

function findModifiedImgurLinks(inputString) {
    const imgurLinkRegex = /ImgurLinks\/([a-zA-Z0-9]+)/g;
    const matches = [];
    let match;
    while ((match = imgurLinkRegex.exec(inputString)) !== null) {
      matches.push(match[0]);
    }
    return matches;
}
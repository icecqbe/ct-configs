import request from "requestV2"
import RenderLib from "RenderLib"
import renderBeaconBeam from "../BeaconBeam"
const metadata = JSON.parse(FileLib.read("AsuAddons", "metadata.json"))

/**
 * Checks if an array made of smaller array includes a value at a specified index in the inner array.
 * @param {Any} object The object to check for.
 * @param {Array[]} array The array to look through. 
 * @param {Number} index The index inside of the inner array to check.
 * @returns {Number|Boolean} The index of the object or false.
 */
export function isInArrayIdx(object,array,index) {    
    for (let i = 0; i < array.length; i++) {
        if (array[i][index] == object) {
            return i
        }
    }
    return false;
}

/**
 * A shorthand for requestv2
 * @param {URL} url The url to request.
 * @returns {JSON} The request body.
 */
export const getrequest = function(url) {
    return request({
        url: url,
        headers: {
            'User-Agent': 'AsuAddons ' + metadata.version + " | " + Player.name
        },
        json: true
    });
}


/**
 * Calculates a pet's level.
 * @param {Number} petExp The Current xp of a pet.
 * @param {String} offsetRarity The rarity of a pet.
 * @returns {Number} The level of a pet.
 */
export function getPetLevel(petExp, offsetRarity, maxLevel) {
    const offset = {
        COMMON: 0,
        UNCOMMON: 6,
        RARE: 11,
        EPIC: 16,
        LEGENDARY: 20,
        MYTHIC: 20
      };
      
    const levellist = [
        100, 110, 120, 130, 145, 160, 175, 190, 210, 230, 250, 275, 300, 330, 360, 400, 440, 490, 540, 600, 660, 730, 800,
        880, 960, 1050, 1150, 1260, 1380, 1510, 1650, 1800, 1960, 2130, 2310, 2500, 2700, 2920, 3160, 3420, 3700, 4000, 4350,
        4750, 5200, 5700, 6300, 7000, 7800, 8700, 9700, 10800, 12000, 13300, 14700, 16200, 17800, 19500, 21300, 23200, 25200,
        27400, 29800, 32400, 35200, 38200, 41400, 44800, 48400, 52200, 56200, 60400, 64800, 69400, 74200, 79200, 84700, 90700,
        97200, 104200, 111700, 119700, 128200, 137200, 146700, 156700, 167700, 179700, 192700, 206700, 221700, 237700, 254700,
        272700, 291700, 311700, 333700, 357700, 383700, 411700, 441700, 476700, 516700, 561700, 611700, 666700, 726700,
        791700, 861700, 936700, 1016700, 1101700, 1191700, 1286700, 1386700, 1496700, 1616700, 1746700, 1886700, 0, 5555,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700
    ];

    const rarityOffset = offset[offsetRarity];
    const levels = levellist.slice(rarityOffset, rarityOffset + maxLevel - 1);

    let xpTotal = 0;
    let level = 1;
  
    for (let i = 0; i < maxLevel; i++) {
      xpTotal += levels[i];
  
      if (xpTotal > petExp) {
        xpTotal -= levels[i];
        break;
      } else {
        level++;
      }
    }
  
    if (level > maxLevel) {
      level	= maxLevel
    }
  
    return level
}

/**
 * Calculate a player's cata level.
 * @param {Number} xp The cata xp of a player.
 * @returns {Number} The cata level of a player.
 */
export function getCataLevel(xp) {
    const cataLevelArray = [
        0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340,
        35640, 50040, 70040, 97640, 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640,
        1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640,
        30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640,
        285559640, 360559640, 453559640, 569809640
    ];

    let cata = -1
    for (let i = 0; i < cataLevelArray.length; i++) {
        if (cataLevelArray[i] <= xp) {
            cata += 1
        }
    }
    if (cata == 50) cata += Math.floor((xp-569809640)/200000000)
    return cata
}

/**
 * Gets a JSON Key by it's value.
 * @param {JSON} object The JSON object.
 * @param {any} value The value of they key to look for.
 * @returns {String} The Key in which the value is held.
 */
export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

/**
 * Uploads an image to Imgur.com
 * @param {Image} image 
 * @returns The request body including the link to the image.
 */
export function upload(image) {
    return request({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        headers: {
            Authorization: `Client-ID d30c6dc9941b52b`,
        },
        body: {
            image
        },
        json: true
    });
};

/**
 * Calculate the distance between 2 places in 3D Space.
 * @param {Number[3]} p1 Start Place.
 * @param {Number[3]} p2 End Place.
 * @returns {Number} The Distance between the 2 places.
 */
export function calculateDistanceQuick(p1, p2) {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let ret = a * a + b * b + c * c

    if (ret < 0) {
        ret *= -1
    }
    return ret;
}

/**
 * Lightens or Darkens a HEX colour.
 * @param {Number} num The HEX colour in number form.
 * @param {Number} amt The amount to darken (-) or lighten (+) it by.
 * @returns {Number} The new shifted colour.
 */
export function LightenDarkenColor(num, amt) {
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return newColor;
}

/**
 * Draws a waypoint in 3D Space
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Number} z The z coordinate.
 * @param {Number} w The width of the drawn box.
 * @param {Number} h The height of the drawn box.
 * @param {Number} r The red value of the drawn box's colour.
 * @param {Number} g The green value of the drawn box's colour.
 * @param {Number} b The blue value of the drawn box's colour.
 * @param {String} name The name of the waypoint
 * @param {Number} textColour The colour of the drawn text.
 * @param {Boolean} throughWalls If the waypoint can be seen through walls.
 * @param {Boolean} beacon If it should have a beacon.
 * @param {Boolean} distance If it should display the distance to the player. (Inherits the colour of the above text but shifts it a little.) 
 */
export function drawWaypoint(x, y, z, w, h, r, g, b, name, textColour, throughWalls, beacon, distance)
{
    let distToPlayer=Math.sqrt((x-Player.getRenderX())**2+(y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2+(z-Player.getRenderZ())**2);
    if (beacon) renderBeaconBeam(x,y,z,r,g,b,1,true)
    RenderLib.drawEspBox(x+0.5,y,z+0.5,w,h,r,g,b,1,throughWalls)
    Tessellator.drawString(name,x+0.5,y+2,z+0.5,textColour,false,0.09,false)
    if (distance) Tessellator.drawString("("+String(Math.round(distToPlayer))+"m)",x+0.5,y+1,z+0.5,LightenDarkenColor(textColour,+40),false,0.06,false)
}

/**
 * Send a message to any webhook.
 * @param {JSON} params The parameters for the message (ex. username,content,embeds) 
 * @param {String} webhook The webhook url.
*/
export function sendWebhookMessage(params,webhook) {
    request({
        method: "POST",
        url: webhook,
        headers: {
            "Content-type": "application/json",
            "User-Agent": "Mozilla/5.0"
        },
        body: params
    })
}

/**
 * Decode compressed nbt data.
 * @param {String} data 
 * @returns {NBTTagList} The uncompressed nbt data.
 */
export function decodeInv(data) {
    let bytearray = java.util.Base64.getDecoder().decode(data);
    let inputstream = new java.io.ByteArrayInputStream(bytearray);
    let nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
    let items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()

    return items
}

/**
 * Expands a shortened Number
 * @param {String} num Shortened number (ex. 1k, 106.2m, 25b)
 * @returns {Number|Boolean} The new expanded number or false if the input is not valid
 */
export function expandNumber(num) {
    if (+(num)) return num
    sizes = {
        "b": 1000000000,
        "m": 1000000,
        "k": 1000
    }
    if (!+(num.substring(0, num.length-1))) return false
    return +(num.substring(0, num.length-1))*sizes[num[num.length-1]]
}

/**
 * Shortens a number
 * @param {Number} num Starting number
 * @returns {String|Boolean} The new shortened Number (ex. 1k, 106.2m, 25b) or false if the input is not valid
 */
export function shortenNumber(num) {
    if (typeof num != "number") return false
    if (num < 1) return num.toFixed(2)
    sizes = ["", "k", "m", "b"]
    for (let i = 0; i < sizes.length; i++) {
        if (num/Math.pow(10,i*3) < 1) {
            return String((num/Math.pow(10,(i-1)*3)).toFixed(2))+sizes[i-1]
        }
    }
    return String((num/1000000000).toFixed(2))+"b"
}

let titles = []
/**
 * Draws a title on the screen cuz I don't trust the vanilla one
 * @param {String} text The title that is displayed (supports formatting)
 * @param {Number} duration The duration how long it is displayed in ms
 * @param {Boolean} shadow Add shadow to the text
 * @param {String} subtitle The subtitle that is displayed (supports formatting)
 */
export function showAUTitle(title, duration, shadow = false, subtitle = "") {
    if (titles.length > 0) {
        for (let i = 0; i < titles.length; i++) {
            if (titles[i] != undefined) titles[i].unregister()
            titles.splice(i,1)
        }
    }
    let overlay = register("renderOverlay", () => {
        Renderer.translate(Renderer.screen.getWidth()/2, Renderer.screen.getHeight()/2)
        Renderer.scale(4,4)
        Renderer.drawString(title, -Renderer.getStringWidth(title)/2,-10,shadow)

        if (subtitle != "") {
            Renderer.translate(Renderer.screen.getWidth()/2, Renderer.screen.getHeight()/2)
            Renderer.scale(2,2)
            Renderer.drawString(subtitle, -Renderer.getStringWidth(subtitle)/2,-3,shadow)
        }
    })
    titles.push(overlay)
    setTimeout(() => {
        if (overlay != undefined) overlay.unregister()
        titles.splice(titles.indexOf(overlay),1)
    },duration)
}

/**
 * Gets all classes in the current dungeon
 * @returns {JSON} Classes in the format {class: ign}
 */
export function getClasses() {
    let classes = {}
    TabList.getNames().forEach((line,index) => {
        line = ChatLib.removeFormatting(line)
        let matches = line.match(/\[\d+\] ([A-z_1-9]+)(?: .)? \((Berserk|Healer|Archer|Tank|Mage) ([I|V|X|L|C|D]+)\)/)
        if (!matches) return
        classes[matches[2]] ? classes[matches[2].toLowerCase()+String(index)] = matches[1] : classes[matches[2].toLowerCase()] = matches[1]
    })
    return classes
}

/**
     * Draws the frame of a box (Credits: RenderLib, added depth mask back)
     * @param {number} x - X Coordinates
     * @param {number} y - Y Coordinates
     * @param {number} z - Z Coordinates
     * @param {number} w - Box Width
     * @param {number} h - Box Height
     * @param {number} red - Box Color Red 0-1
     * @param {number} green - Box Color Green 0-1
     * @param {number} blue - Box Color Blue 0-1
     * @param {number} alpha - Box Color Alpha 0-1
     * @param {boolean} phase - Depth test disabled. True: See through walls
     */
export function drawBox(x, y, z, w, h, red, green, blue, alpha, phase) {
    Tessellator.pushMatrix();
    GL11.glLineWidth(2.0);
    GlStateManager.func_179129_p(); // disableCullFace
    GlStateManager.func_179147_l(); // enableBlend
    GlStateManager.func_179106_n()  // disableFog
    GlStateManager.func_179112_b(770, 771); // blendFunc
    GlStateManager.func_179090_x(); // disableTexture2D

    if (phase) {
        GlStateManager.func_179097_i() // disableDepth
    }

    const locations = [
        //    x, y, z    x, y, z
        [
            [0, 0, 0],
            [w, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, w],
        ],
        [
            [w, 0, w],
            [w, 0, 0],
        ],
        [
            [w, 0, w],
            [0, 0, w],
        ],

        [
            [0, h, 0],
            [w, h, 0],
        ],
        [
            [0, h, 0],
            [0, h, w],
        ],
        [
            [w, h, w],
            [w, h, 0],
        ],
        [
            [w, h, w],
            [0, h, w],
        ],

        [
            [0, 0, 0],
            [0, h, 0],
        ],
        [
            [w, 0, 0],
            [w, h, 0],
        ],
        [
            [0, 0, w],
            [0, h, w],
        ],
        [
            [w, 0, w],
            [w, h, w],
        ],
    ];

    locations.forEach((loc) => {
        Tessellator.begin(3).colorize(red, green, blue, alpha);

        Tessellator.pos(x + loc[0][0] - w / 2, y + loc[0][1], z + loc[0][2] - w / 2).tex(0, 0);

        Tessellator.pos(x + loc[1][0] - w / 2, y + loc[1][1], z + loc[1][2] - w / 2).tex(0, 0);

        Tessellator.draw();
    });

    GlStateManager.func_179089_o(); // enableCull
    GlStateManager.func_179084_k(); // disableBlend
    GlStateManager.func_179127_m()  // enableFog
    GlStateManager.func_179098_w(); // enableTexture2D

    if (phase) {
        GlStateManager.func_179126_j(); // enableDepth
    }
    
    Tessellator.popMatrix();
};

/**
     * Draws the filled sides of a box (Credits: RenderLib, added depth mask back)
     * @param {number} x - X Coordinates
     * @param {number} y - Y Coordinates
     * @param {number} z - Z Coordinates
     * @param {number} w - Box Width
     * @param {number} h - Box Height
     * @param {number} red - Box Color Red 0-1
     * @param {number} green - Box Color Green 0-1
     * @param {number} blue - Box Color Blue 0-1
     * @param {number} alpha - Box Color Alpha 0-1
     * @param {boolean} phase - Depth test disabled. True: See through walls
     */
export function drawInnerBox(x, y, z, w, h, red, green, blue, alpha, phase) {
    Tessellator.pushMatrix();
    GL11.glLineWidth(2.0);
    GlStateManager.func_179129_p(); // disableCullFace
    GlStateManager.func_179147_l(); // enableBlend
    GlStateManager.func_179106_n()  // disableFog
    GlStateManager.func_179112_b(770, 771); // blendFunc
    GlStateManager.func_179090_x(); // disableTexture2D

    if (phase) {
        GlStateManager.func_179097_i() // disableDepth
    }

    w /= 2;

    Tessellator.begin(GL11.GL_QUADS, false);
    Tessellator.colorize(red, green, blue, alpha);

    Tessellator.translate(x, y, z)
        .pos(w, 0, w)
        .pos(w, 0, -w)
        .pos(-w, 0, -w)
        .pos(-w, 0, w)

        .pos(w, h, w)
        .pos(w, h, -w)
        .pos(-w, h, -w)
        .pos(-w, h, w)

        .pos(-w, h, w)
        .pos(-w, h, -w)
        .pos(-w, 0, -w)
        .pos(-w, 0, w)

        .pos(w, h, w)
        .pos(w, h, -w)
        .pos(w, 0, -w)
        .pos(w, 0, w)

        .pos(w, h, -w)
        .pos(-w, h, -w)
        .pos(-w, 0, -w)
        .pos(w, 0, -w)

        .pos(-w, h, w)
        .pos(w, h, w)
        .pos(w, 0, w)
        .pos(-w, 0, w)
        .draw();

    GlStateManager.func_179089_o(); // enableCull
    GlStateManager.func_179084_k(); // disableBlend
    GlStateManager.func_179127_m()  // enableFog
    GlStateManager.func_179098_w(); // enableTexture2D
    if (phase) {
        GlStateManager.func_179126_j(); // enableDepth
    }
            
    Tessellator.popMatrix();
};
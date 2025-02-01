import Party from "../../../BloomCore/Party";
import config from "../../config";
import PogObject from "PogData";
import request from "requestV2/index";

const addUUID = (username) =>
  request(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    .then(function (data) {
      let uuid = JSON.parse(data).id;

      if (blacklist.uuids.includes(uuid)) {
        let index = blacklist.uuids.indexOf(uuid);
        blacklist.uuids.splice(index, 1);
        blacklist.igns.splice(index, 1);
        ChatLib.chat(
          `§6[§bAzuredClient§6]§c Removed §6${username}§c from the blacklist.`
        );
      } else {
        blacklist.uuids.push(uuid);
        blacklist.igns.push(username.toLowerCase());
        ChatLib.chat(
          `§6[§bAzuredClient§6]§a Successfully added §6${username}§a to the blacklist.`
        );
      }
      blacklist.save();
    })
    .catch((e) => {
      ChatLib.chat(
        `§6[§bAzuredClient§6]§c Error: §f${JSON.parse(e).errorMessage}`
      );
    });

let blacklist = new PogObject(
  "AzuredClient",
  {
    uuids: [],

    igns: [],
  },
  "botblacklist.json"
);

let lastTimeUsed = 0;

// Blacklist
register("command", (ign) => {
  if (!ign) {
    if (blacklist.igns.length != 0) {
      ChatLib.chat(
        `§6[§bAzuredClient§6]§a Current blacklist: §f${blacklist.igns.toString()}`
      );
    } else
      ChatLib.chat(
        `§6[§bAzuredClient§6]§c Wrong usage. Use /botblacklist {ign} to blacklist a player.`
      );
    return;
  }

  addUUID(ign);
}).setName("botblacklist");

const numbersToText = new Map([
  ["1", "one"],
  ["2", "two"],
  ["3", "three"],
  ["4", "four"],
  ["5", "five"],
  ["6", "six"],
  ["7", "seven"],
]);

const runCommand = (command) => {
  ChatLib.command(command);
  lastTimeUsed = Date.now();
};

const DELAY = 750;

register("chat", (rank, name, mode, floor) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase()) ||
    !Array.from(numbersToText.keys()).includes(floor)
  )
    return;
  if (Party?.leader == Player.getName() || Party.leader == null) {
    runCommand(
      `joindungeon ${
        mode == "m" ? "master_" : ""
      }catacombs_floor_${numbersToText.get(floor)}`
    );
  }
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !(f|m)(\d)$/);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  runCommand(
    "pc Commands: !warp, !ptme, !inv(ite), !allinv(ite), !ping, !tps, !rp, !cf(coinflip), !dice !m{floor}, !math"
  );
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !help$/);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  if (Party?.leader == Player.getName() || Party.leader == null) {
    runCommand("p warp");
  }
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !warp$/);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  if (Party?.leader == Player.getName() || Party.leader == null) {
    runCommand(`party transfer ${name}`);
  }
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !ptme$/);

register("chat", (rank, name, alias, ignToInv) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  if (Party?.leader == Player.getName() || Party.leader == null) {
    runCommand(`party invite ${ignToInv}`);
  }
}).setCriteria(
  /^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !inv(ite)? (.+)$/
);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  if (Party?.leader == Player.getName() || Party.leader == null) {
    runCommand("p settings allinvite");
  }
}).setCriteria(
  /^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !allinv(ite)?$/
);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  if (Party?.leader == Player.getName() || Party.leader == null) {
    ChatLib.command(`rp`, true);
    lastTimeUsed = Date.now();
  }
}).setCriteria(
  /^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: (!rp|!reparty)$/
);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  runCommand(`pc ${name} rolled a ${1 + Math.floor(Math.random() * 6)}.`);
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !dice$/);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  runCommand(
    `pc ${name} rolled ${
      Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails"
    }`
  );
}).setCriteria(
  /^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !(coinflip|cf)$/
);

register("chat", (rank, name, operation) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  runCommand(`pc ${operation} = ${eval(operation)}`);
}).setCriteria(
  /^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !math ([0-9\+\*\-\!\%\(\)\.]+)$/
);

// From [MVP++] AzuredBlue: !party

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < DELAY ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  runCommand(`party ${name}`);
}).setCriteria(/From (\[.+\])? ?(.+) ?[ቾ⚒]?: !(party|p|inv|invite)$/);

const S37PacketStatistics = Java.type(
  "net.minecraft.network.play.server.S37PacketStatistics"
);
const C16PacketClientStatus = Java.type(
  "net.minecraft.network.play.client.C16PacketClientStatus"
);
const S03_PACKET_TIME_UPDATE = Java.type(
  "net.minecraft.network.play.server.S03PacketTimeUpdate"
);
const System = Java.type("java.lang.System");

let lastPingAt = -1;
let requestedPing = false;
let requestedTPS = false;
let prevTime = null;

register("worldLoad", () => {
  prevTime = null;
});
register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < 2000 ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;

  Client.sendPacket(
    new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS)
  );
  lastPingAt = System.nanoTime();
  requestedPing = true;
  lastTimeUsed = Date.now();
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !ping$/);

register("chat", (rank, name) => {
  if (
    !config.partyCommands ||
    Date.now() - lastTimeUsed < 2000 ||
    blacklist.igns.includes(name.toLowerCase())
  )
    return;
  requestedTPS = true;
  lastTimeUsed = Date.now();
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !tps$/);

register("packetReceived", (packet) => {
  if (lastPingAt > 0 && requestedPing) {
    if (packet instanceof S37PacketStatistics) {
      let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000);
      ChatLib.command(`pc Ping: ${parseInt(diff)}`);
      lastPingAt *= -1;
      requestedPing = false;
    }
  }

  if (packet instanceof S03_PACKET_TIME_UPDATE && requestedTPS) {
    if (prevTime !== null) {
      let time = Date.now() - prevTime;
      let instantTps = MathLib.clampFloat(20000 / time, 0, 20);
      ChatLib.command(`pc TPS: ${parseFloat(instantTps).toFixed(1)}`);
      requestedTPS = false;
    }
    prevTime = Date.now();
  }
});

import { registerWhen, getEntitySkullTexture } from "../../../BloomCore/utils/Utils"
import config from "../../config"
let inP5 = false
const TENTACLE_TEXTURE = ["eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzM3MjIzZDAxOTA2YWI2M2FmMWExNTk4ODM0M2I4NjM3ZTg1OTMwYjkwNWMzNTEyNWI1NDViMzk4YzU5ZTFjNSJ9fX0="]
const ARMORSTAND = Java.type('net.minecraft.entity.item.EntityArmorStand').class
const S2APacketParticles = Java.type('net.minecraft.network.play.server.S2APacketParticles').class
const IMPORTANTPARTICLES = ["ENCHANTMENT_TABLE", "FLAME", "FIREWORKS_SPARK"]

registerWhen(register('packetReceived', (packet, event) => {
	const type = packet.func_179749_a().toString()
	if (IMPORTANTPARTICLES.includes(type)) return
	cancel(event)
}).setFilteredClass(S2APacketParticles), () => config.hideParticles && inP5)

// Shoutout to baltraz for figuring out most of the lag comes from the stupid tentacles
register('step', () => {
	if (!inP5 || !config.hideUselessArmorstands) return
	World.getAllEntitiesOfType(ARMORSTAND).forEach(e => {
		let texture = getEntitySkullTexture(e)
		if (!TENTACLE_TEXTURE.includes(texture)) return
		e.getEntity().func_70106_y()
	})
}).setFps(2)

registerWhen(register('renderEntity', (entity, pos, ticks, event) => {
	cancel(event)
}).setFilteredClass(Java.type("net.minecraft.entity.item.EntityFallingBlock").class), () => config.hideFallingBlocks)

register('worldUnload', () => {
	inP5 = false
})

register('chat', () => {
	inP5 = true
}).setCriteria('[BOSS] Wither King: You.. again?')

register('chat', () => {
	inP5 = false
}).setCriteria("[BOSS] Wither King: Incredible. You did what I couldn't do myself.")

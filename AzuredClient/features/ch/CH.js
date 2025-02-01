import RenderLib from '../../../RenderLib/index'
import config from '../../config'
import { distance, getArea } from '../utils/utils'
import { registerWhen } from '../../../BloomCore/utils/Utils'

let particleX
let particleY
let particleZ

let shouldDraw = false

let chestsNearby = 0
let chestsQuantity = 0
let closestChest
let chestX
let chestY
let chestZ

registerWhen(register('renderWorld', () => {
	if (shouldDraw) {
		RenderLib.drawInnerEspBox(particleX + 0.5, particleY + 0.4, particleZ + 0.5, 0.2, 0.2, 0.3, 1, 1, 0.6, false)
	}
}), () => config.chestSolver && getArea() == 'Crystal Hollows')

register('tick', () => {
	if (getArea() == 'Crystal Hollows') {
		if (config.chestSolver) {
			// Get chests nearby
			chestsNearby = World.getAllTileEntitiesOfType(Java.type('net.minecraft.tileentity.TileEntityChest')).filter((e) => distance(e) <= 6)
			chestsQuantity = chestsNearby.length
			// Get closest chest?
			closestChest = World.getAllTileEntitiesOfType(Java.type('net.minecraft.tileentity.TileEntityChest'))
				.filter((e) => distance(e) <= 6)
				.sort((a, b) => distance(a) - distance(b))
			chestX = closestChest[0]?.getX()
			chestY = closestChest[0]?.getY()
			chestZ = closestChest[0]?.getZ()
		}
	}
})

let particleDistance

registerWhen(register('spawnParticle', (particle) => {

	// Particle stuff

	particleDistance = Math.floor(
		Math.sqrt(Math.pow(particle.getX() - Player.getX(), 2) + Math.pow(particle.getY() - Player.getY(), 2) + Math.pow(particle.getZ() - Player.getZ(), 2))
	)
	if (particle.toString().includes('EntityCrit2FX') && particleDistance <= 4) {
		particleX = particle.getX() - 0.5
		particleY = particle.getY() - 0.5
		particleZ = particle.getZ() - 0.5

		if (chestsQuantity >= 1) {
			particle.remove()
			shouldDraw = true
		} else {
			shouldDraw = false
		}
	}
}), () => config.chestSolver && getArea() == 'Crystal Hollows')

let timesLooked = 0

register('chat', () => {
	if (config.chestSolver) {
		shouldDraw = false
		timesLooked = 0
	}
}).setCriteria('You have successfully picked the lock on this chest!')

register('soundPlay', (pos, name, vol, pitch, category, event) => {
	if (!config.chestSolver) return
	if (getArea() == 'Crystal Hollows') {
		if (!shouldDraw) return
		if (name == 'random.orb' && vol == 1 && pitch == 1) {
			timesLooked++
		}

		if (name == 'mob.villager.no' && vol == 1 && pitch == 1) {
			timesLooked = 0
		}
	}
})

registerWhen(register('renderWorld', () => {
	if (chestX != undefined && chestY != undefined && chestZ != undefined) {
		Tessellator.drawString(timesLooked + '/5', chestX + 0.5, chestY + 1.25, chestZ + 0.5, Renderer.AQUA, false, 0.025, false)
	}
}), () => config.chestSolver && timesLooked != 0 && getArea() == 'Crystal Hollows')

import { data } from '../data'
import { isInDungeon, romanToInt, robotoFont } from '../utils/utils'
import config from '../../config'
import { registerWhen } from '../../../BloomCore/utils/Utils'

const blessings = {
	power: /Blessing of Power (.+)/,
	time: /Blessing of Time (.+)/,
	life: /Blessing of Life (.+)/,
	wisdom: /Blessing of Wisdom (.+)/,
	stone: /Blessing of Stone (.+)/,
}

register('step', () => {
	if (!isInDungeon() || !config.showBlessings) return

	let footer = TabList?.getFooter()?.removeFormatting()
	if (!footer) return

	Object.keys(blessings).forEach(blessing => {
		if (config['show' + blessing.charAt(0).toUpperCase() + blessing.slice(1)]) {
			this[blessing + 'Match'] = footer.match(blessings[blessing])
		}
	})

}).setFps(2)

registerWhen(register('renderOverlay', () => {

	let i = 0
	Object.keys(blessings).forEach((blessing) => {
		if (!this[blessing + 'Match']) return
		robotoFont.drawStringWithShadow(`${blessing.charAt(0).toUpperCase() + blessing.slice(1)}: §f${romanToInt(this[blessing + 'Match'][1])}`,
		data.powerCoords.x, data.powerCoords.y + 11 * i++, config.hudColor)
	})

}), () => config.showBlessings && !config.blessingsGui.isOpen() && isInDungeon())

registerWhen(register('renderOverlay', () => {

	robotoFont.drawStringWithShadow(
		`Power: §f29`,
		data.powerCoords.x,
		data.powerCoords.y,
		config.hudColor
	)

	robotoFont.drawStringWithShadow(
		`Time: §f5`,
		data.powerCoords.x,
		data.powerCoords.y + 11,
		config.hudColor
	)
}), () => config.blessingsGui.isOpen())

register("dragged", (dx, dy, x, y) => {
	if (!config.blessingsGui.isOpen()) return
	data.powerCoords.x = x
	data.powerCoords.y = y
	data.save()
})

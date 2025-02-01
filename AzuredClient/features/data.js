import PogObject from '../../PogData/index'

export const data = new PogObject(
	'AzuredClient',
	{

		powderCoords: {
			x: 0,
			y: 0,
		},

		tickTimerCoords: {
			x: Renderer.screen.getWidth() / 2,
			y: Renderer.screen.getHeight() / 2 + 10,
		},

		invincibilityCoords: {
			x: Renderer.screen.getWidth() / 2,
			y: Renderer.screen.getHeight() / 2 - 20,
		},

		pingCoords: {
			x: 0,
			y: 0,
		},

		tpsCoords: {
			x: 84,
			y: 0,
		},

		bpsCoords: {
			x: 252,
			y: 0,
		},

		fpsCoords: {
			x: 168,
			y: 0,
		},

		powerCoords: {
			x: 0,
			y: 0,
		},

		gardenCoords: {
			x: Renderer.screen.getWidth() * (2 / 3) + 2.5,
			y: Renderer.screen.getHeight() / 2 - 8,
		},

		PB: {
			panes: 0,
			color: 0,
			numbers: 0,
			melody: 0,
			startsWith: 0,
			select: 0,
			relic: 0,
		},

	},
	'data.json'
)
const metadata = JSON.parse(FileLib.read('AzuredClient', 'metadata.json'))

export const shownChangelog = new PogObject('AzuredClient', {
	"lastUpdatedVersion": metadata.version,
},
	'changelog.json'
)
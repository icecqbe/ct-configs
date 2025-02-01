import config from "../../config"
import { data } from "../data"
import { getArea, romanToInt } from "../utils/utils"
import { registerWhen } from "../../../BloomCore/utils/Utils"

let visitorsAmount = 0
let milestoneString = ''

let visitorsIndex = 0;
register('step', () => {
    if (getArea() != 'Garden') return
    let milestone

    if (config.visitorsHUD) {
        try {
            visitorsIndex = TabList?.getNames()?.findIndex(line => line?.includes('Visitors'))
            for (let i = 1; i <= 6; i++) {
                if (TabList?.getNames()[visitorsIndex + i]?.removeFormatting() == '') {
                    visitorsAmount = i - 1;
                    break
                }
            }
        } catch (e) {

        }

    }

    if (config.milestoneHUD) {
        try {
            milestone = TabList?.getNames()?.find(line => line?.includes('Milestone: '))?.split(': ')
            milestoneString = `${milestone[1]}: ${milestone[2]}`
        } catch (e) {
            console.log(e)
        }

    }
}).setFps(5)



registerWhen(register('renderOverlay', () => {
    if (!visitorsIndex) return
    if (!config.gardenGui.isOpen()) {
        if (config.visitorsHUD) {
            for (let i = visitorsAmount; i >= 0; i--) {
                new Text(TabList?.getNames()[visitorsIndex + i], data.gardenCoords.x, data.gardenCoords.y - (10 * (visitorsAmount - i)))
                    .setShadow(true)
                    .setColor(Renderer.WHITE)
                    .draw()
            }
        }

        if (config.milestoneHUD) {
            new Text(milestoneString, data.gardenCoords.x, data.gardenCoords.y + 10)
                .setShadow(true)
                .setColor(Renderer.WHITE)
                .draw()

        }
    }

    if (config.gardenGui.isOpen()) {
        new Text('&b&lVisitors:&r (&b5m 10s&r)', data.gardenCoords.x, data.gardenCoords.y)
            .setShadow(true)
            .setColor(Renderer.WHITE)
            .draw()
        new Text('&aWheat 10: &349.2%', data.gardenCoords.x, data.gardenCoords.y + 10)
            .setShadow(true)
            .setColor(Renderer.WHITE)
            .draw()
    }
}), () => getArea() == 'Garden' && (config.visitorsHUD || config.milestoneHUD))

register('dragged', (dx, dy, x, y, b) => {
    if (!config.gardenGui.isOpen()) return
    data.gardenCoords.x += dx
    data.gardenCoords.y += dy
    data.save()
})


register('guiRender', () => {
    if (getArea() != 'Garden' || !(config.cropMilestonesStack || config.composterUpgradesStack)) return
    let inv = Player.getContainer()

    if (config.cropMilestonesStack && inv?.getName() == 'Crop Milestones' || config.composterUpgradesStack && inv?.getName() == 'Composter Upgrades') {

        for (let i = 0; i < 26; i++) {
            let stackSize = 0
            try {
                stackSize = inv?.getStackInSlot(i)?.getName()?.split(' ')?.splice(-1)[0]
            } catch (e) {

            }
            if (stackSize == 0) continue
            if (stackSize.match(/\d+/)) {
                inv?.getStackInSlot(i)?.setStackSize(parseInt(stackSize))
            } else inv?.getStackInSlot(i)?.setStackSize(romanToInt(stackSize))
        }
    }
})

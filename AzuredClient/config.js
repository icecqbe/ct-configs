import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty
} from '../Vigilance/index';

@Vigilant('AzuredClient', '§zAzuredClient', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General', 'Dungeons', 'Rendering', 'Crystal Hollows', 'Hud', 'Garden'];
        return 1
    }
})
class Config {

    // moveHud = new Gui()
    powderGui = new Gui()

    pingGui = new Gui()
    fpsGui = new Gui()
    tpsGui = new Gui()
    bpsGui = new Gui()
    hudGui = new Gui()

    blessingsGui = new Gui()

    gardenGui = new Gui()

    goldorTimer = new Gui()
    invincibilityTimer = new Gui()

    @SwitchProperty({
        name: 'Chat Emotes',
        description: 'Allows you to use MVP++ emotes as any rank. ',
        category: 'General',
        subcategory: 'General'
    })
    chatEmotes = false

    @SwitchProperty({
        name: 'Mastery Helper',
        description: 'Makes the timers much more bigger.',
        category: 'General',
        subcategory: 'General'
    })
    masteryHelper = false

    @SwitchProperty({
        name: 'Party Commands',
        description: 'Allows you to use party commands. Use !help in a party to see the commands.',
        category: 'General',
        subcategory: 'General'
    })
    partyCommands = false

    @SwitchProperty({
        name: 'Background Blur',
        description: 'Uses Minecraft\'s built-in Blur Shader in the background.',
        category: 'General',
        subcategory: 'General'
    })
    backgroundBlur = false

    @SwitchProperty({
        name: 'Dragon Split',
        description: 'Shows a title of the dragon u need to split to, following OGRBP\nThe class not solo debuffing purple will follow B/M if purple spawns.',
        category: 'Dungeons',
        subcategory: 'Split'
    })
    dragonSplit = false

    @SwitchProperty({
        name: 'Debuff Tracker',
        description: 'Tracks how many arrows you hit via sound and Ice Spray &c(WIP)',
        category: 'Dungeons',
        subcategory: 'Split'
    })
    debuffTrack = false

    @SwitchProperty({
        name: 'Show All Dragons Titles',
        description: 'Shows the title of all dragons u need to go to.',
        category: 'Dungeons',
        subcategory: 'Split'
    })
    showAllDragons = false

    @SwitchProperty({
        name: 'Dragon Timer',
        description: 'Shows a subtitle with the ms until the first dragon spawns.',
        category: 'Dungeons',
        subcategory: 'Split'
    })
    dragonTimer = false

    @SwitchProperty({
        name: 'Paul Buff',
        description: 'Multiplies the power in your run by 1.25',
        category: 'Dungeons',
        subcategory: 'Split'
    })
    paulBuff = false

    @SelectorProperty({
        name: 'Purple Solo Debuff',
        description: 'The class that solo debuffs purple, the other class helps b/m',
        category: 'Dungeons',
        subcategory: 'Split',
        options: ['Tank', 'Healer'],
    })
    soloDebuff = 0;

    @SwitchProperty({
        name: 'Solo Debuff on All Splits',
        description: 'Same as Purple Solo Debuff but for all dragons (A will only have 1 debuff)',
        category: 'Dungeons',
        subcategory: 'Split'
    })
    soloDebuffOnAll = false

    @SliderProperty({
        name: 'Easy Power',
        description: 'Power needed when its Purple and another dragon',
        category: 'Dungeons',
        subcategory: 'Split',
        min: 10,
        max: 29,
        step: 1,
    })
    easyPower = 19;

    @SliderProperty({
        name: 'Normal Power',
        description: 'Power needed to split',
        category: 'Dungeons',
        subcategory: 'Split',
        min: 10,
        max: 29,
        step: 1,
    })
    power = 21;

    @ButtonProperty({
        name: "Share Prio",
        description: "Sends a message in chat to share your priority.",
        category: "Dungeons",
        subcategory: "Split",
        placeholder: "Share"
    })
    sharePrio() {
        if (!this.dragonSplit) return
        ChatLib.command(`pc !sharedprio: Paul: ${this.paulBuff} | Solo Debuff: ${this.soloDebuff} | Easy Power: ${this.easyPower} | Power: ${this.power}`)
        Client.currentGui.close()
    };

    @SwitchProperty({
        name: 'Announce Melody',
        description: 'Sends a message in Party Chat if you get the Melody Terminal',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    announceMelody = false

    @SwitchProperty({
        name: 'Announce Melody Progress',
        description: 'Sends a message in Party Chat with the progress of your terminal',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    melodyProgress = false

    @TextProperty({
        name: "Announce Melody Text",
        description: "Text used for Announce Melody",
        category: "Dungeons",
        subcategory: "Dungeons",
        placeholder: "BOOM!"
    })
    melodyText = "melody";

    @SelectorProperty({
        name: 'Highlight in Leap Menu',
        description: 'The class to highlight in the spirit leap menu.',
        category: 'Dungeons',
        subcategory: 'Dungeons',
        options: ['None', 'Archer', 'Mage', 'Bers', 'Tank', 'Healer'],
    })
    leapHighlight = 0;

    @ColorProperty({
        name: 'Highlight Color',
        description: 'Changes the color of the highlight',
        category: 'Dungeons',
        subcategory: 'Dungeons',
    })
    leapColor = new java.awt.Color(255 / 255, 30 / 255, 30 / 255);

    @SwitchProperty({
        name: 'Terminal Timer',
        description: 'Times how long it took you to complete a terminal.\nAlso saves your PBs for each terminal.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    terminalTimer = false

    @SwitchProperty({
        name: 'Only send message on PB',
        description: 'Only sends the terminal time if its PB',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    terminalTimerPB = false

    @SwitchProperty({
        name: 'Relic Timer',
        description: 'Times how long it takes you to place relic.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    relicTimer = false

    @SwitchProperty({
        name: 'Necron Timer',
        description: 'Timer for Necron\'s Invincibility in P4',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    necronTimer = false

    @SwitchProperty({
        name: 'Invincibility Timer',
        description: 'Timers for Bonzo Mask and Phoenix Pet',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    invincibilityTimers = false
    @ButtonProperty({
        name: "Move Invincibility Timer",
        description: "Moves the invincibility timer",
        category: "Dungeons",
        subcategory: "HUD",
        placeholder: "Move"
    })
    MoveInvincibilityTimerGui() {
        this.invincibilityTimer.open()
    };

    @SwitchProperty({
        name: 'Bonzo and Phoenix Announce',
        description: 'Says in party chat when your bonzo or phoenix procs.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    invincibilityAnnounce = false

    @SwitchProperty({
        name: 'Send message on Dungeon Death',
        description: 'Sends a message everytime someone dies in Dungeons.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    deathMessage = false

    @SwitchProperty({
        name: 'Goldor Tick Timer',
        description: 'Timer on screen for when Goldor\'s Barrier will kill you.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    tickTimer = false

    @ButtonProperty({
        name: "Move Tick Timer",
        description: "Moves the tick timer",
        category: "Dungeons",
        subcategory: "HUD",
        placeholder: "Move"
    })
    MoveGoldorTimerGui() {
        this.goldorTimer.open()
    };

    @SwitchProperty({
        name: 'Leap Announce',
        description: 'Says in party chat who you are leaping to.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    leapAnnounce = false

    @SelectorProperty({
        name: 'Hide Leap Messages',
        description: 'Hides leap messages when:',
        category: 'Dungeons',
        subcategory: 'Dungeons',
        options: ['Never', 'Hide Own', 'Doesn\'t include self', 'Always'],
    })
    hideLeap = 0;

    @SwitchProperty({
        name: 'Exclude Own Death',
        description: 'Wont sent the message on your deaths',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    ownDeathMessage = false

    @TextProperty({
        name: "Death Message Text",
        description: "The text sent on dungeon death.\nUse {name} to use the dead player's name.\nUse a comma to use many messages.",
        category: "Dungeons",
        subcategory: "Dungeons",
        placeholder: "BOOM!"
    })
    deathMessageText = "BOOM!";

    @SwitchProperty({
        name: 'Highlight Keys',
        description: 'Highlights Wither and Blood Keys with a box.',
        category: 'Dungeons',
        subcategory: 'Dungeons'
    })
    highlightKeys = false

    @SwitchProperty({
        name: 'Show Blessings',
        description: 'Shows the Blessings on screen',
        category: 'Dungeons',
        subcategory: 'HUD'
    })
    showBlessings = false

    @CheckboxProperty({
        name: 'Show Power Blessing',
        description: 'Shows the power blessing on screen',
        category: 'Dungeons',
        subcategory: 'HUD'
    })
    showPower = true

    @CheckboxProperty({
        name: 'Show Time Blessing',
        description: 'Shows the time blessing on screen',
        category: 'Dungeons',
        subcategory: 'HUD'
    })
    showTime = true

    @CheckboxProperty({
        name: 'Show Wisdom Blessing',
        description: 'Shows the wisdom blessing on screen',
        category: 'Dungeons',
        subcategory: 'HUD'
    })
    showWisdom = false

    @CheckboxProperty({
        name: 'Show Life Blessing',
        description: 'Shows the life blessing on screen',
        category: 'Dungeons',
        subcategory: 'HUD'
    })
    showLife = false

    @CheckboxProperty({
        name: 'Show Stone Blessing',
        description: 'Shows the stone blessing on screen',
        category: 'Dungeons',
        subcategory: 'HUD'
    })
    showStone = false

    @ButtonProperty({
        name: "Move Blessings",
        description: "Moves the Blessings Display",
        category: "Dungeons",
        subcategory: "HUD",
        placeholder: "Move"
    })
    MoveBlessingsGui() {
        this.blessingsGui.open()
    };


    @SwitchProperty({
        name: 'Chest Solver',
        description: 'Solver for Chests in the Crystal Hollows',
        category: 'Crystal Hollows',
        subcategory: 'Crystal Hollows'
    })
    chestSolver = false

    @SwitchProperty({
        name: 'Chest Session',
        description: 'Shows the amount of chests and powder you\'ve gotten in a session.',
        category: 'Crystal Hollows',
        subcategory: 'Crystal Hollows'
    })
    chestSession = false

    @ButtonProperty({
        name: "Move Chest Session",
        description: "Moves the Chest Session GUI",
        category: "Crystal Hollows",
        subcategory: "Crystal Hollows",
        placeholder: "Move"
    })
    MovePowderGui() {
        this.powderGui.open()
    };

    @SwitchProperty({
        name: 'Fix Powder Message',
        description: 'Fixes the powder message on x2 powder',
        category: 'Crystal Hollows',
        subcategory: 'Crystal Hollows'
    })
    fixPowder = false

    @SwitchProperty({
        name: 'Hide Falling Blocks',
        description: 'Attempts to hide all falling blocks.',
        category: 'Render',
        subcategory: 'Render'
    })
    hideFallingBlocks = false

    @SwitchProperty({
        name: 'Hide P5 Armorstands',
        description: 'Attempts to hide useless Armor Stands in P5\n§cMay break chests at the end of the run.',
        category: 'Render',
        subcategory: 'Render'
    })
    hideUselessArmorstands = false

    @SwitchProperty({
        name: 'Hide P5 Particles',
        description: 'Attempts to hide all particles in P5',
        category: 'Render',
        subcategory: 'Render'
    })
    hideParticles = false

    @SwitchProperty({
        name: 'Ping Display',
        description: 'Display for your Ping',
        category: 'HUD',
        subcategory: 'HUD'
    })
    pingHUD = false

    @ButtonProperty({
        name: "Move Ping",
        description: "Moves the Ping Display",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MovePingGui() {
        this.pingGui.open()
    };

    @SwitchProperty({
        name: 'TPS Display',
        description: 'Displays the server\'s TPS',
        category: 'HUD',
        subcategory: 'HUD'
    })
    tpsHUD = false

    @SwitchProperty({
        name: 'BPS Display',
        description: 'Displays your Blocks Per Second',
        category: 'HUD',
        subcategory: 'HUD'
    })
    bpsHUD = false

    @SwitchProperty({
        name: 'BPS For Only Garden',
        description: 'Displays BPS only when in Garden',
        category: 'HUD',
        subcategory: 'HUD'
    })
    bpsGarden = false

    @SliderProperty({
        name: 'Reset BPS After',
        category: 'HUD',
        subcategory: 'HUD',
        min: 5,
        max: 60,
        step: 1,
    })
    bpsReset = 10;

    @ButtonProperty({
        name: "Move BPS",
        description: "Moves the BPS Display",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveBPSGui() {
        this.bpsGui.open()
    };

    @ButtonProperty({
        name: "Move TPS",
        description: "Moves the TPS Display",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveTPSGui() {
        this.tpsGui.open()
    };

    @SwitchProperty({
        name: 'FPS Display',
        description: 'Display for your FPS',
        category: 'HUD',
        subcategory: 'HUD'
    })
    fpsHUD = false

    @ColorProperty({
        name: 'HUD Color',
        description: 'Changes the color of all HUD',
        category: 'HUD',
        subcategory: 'HUD',
    })
    hudColor = new java.awt.Color(29 / 255, 162 / 255, 219 / 255); // #1da2dbff

    @ButtonProperty({
        name: "Move FPS",
        description: "Moves the FPS Display",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveFPSGui() {
        this.fpsGui.open()
    };

    @ButtonProperty({
        name: "Move all HUD",
        description: "Moves Ping, TPS and FPS all at once.",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveHUDGui() {
        this.hudGui.open()
    };

    @SwitchProperty({
        name: 'Show Crop Milestone as Stack',
        description: 'Displays the crop milestone as a stack',
        category: 'Garden',
        subcategory: 'Garden'
    })
    cropMilestonesStack = false

    @SwitchProperty({
        name: 'Show Composter Upgrades as Stack',
        description: 'Displays the composter upgrades as a stack',
        category: 'Garden',
        subcategory: 'Garden'
    })
    composterUpgradesStack = false

    @SwitchProperty({
        name: 'Visitors List',
        description: 'Displays the list of Visitors',
        category: 'Garden',
        subcategory: 'HUD'
    })
    visitorsHUD = false

    @SwitchProperty({
        name: 'Milestone Display ',
        description: 'Displays your current milestone',
        category: 'Garden',
        subcategory: 'HUD'
    })
    milestoneHUD = false

    @ButtonProperty({
        name: "Edit Locations",
        description: "",
        category: "Garden",
        subcategory: "HUD",
        placeholder: "Move"
    })
    MoveGardenGui() {
        this.gardenGui.open()
    };

    constructor() {
        this.initialize(this)
        this.addDependency("Exclude Own Death", "Send message on Dungeon Death")
        this.addDependency("Announce Melody Progress", "Announce Melody")
        this.addDependency("Only send message on PB", "Terminal Timer")
        this.addDependency("Announce Melody Progress", "Announce Melody")
        this.addDependency("Show All Dragons Titles", "Dragon Split")
        this.addDependency("Dragon Timer", "Dragon Split")
        this.addDependency("Paul Buff", "Dragon Split")
        this.addDependency("Purple Solo Debuff", "Dragon Split")
        this.addDependency("Show Power Blessing", "Show Blessings")
        this.addDependency("Show Time Blessing", "Show Blessings")
        this.addDependency("Show Stone Blessing", "Show Blessings")
        this.addDependency("Show Wisdom Blessing", "Show Blessings")
        this.addDependency("Show Life Blessing", "Show Blessings")
    }

}
export default new Config()
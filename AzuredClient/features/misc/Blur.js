import config from '../../config'

const ResourceLocation = Java.type('net.minecraft.util.ResourceLocation')
let applied = false

register('guiClosed', () => {
	if (!config.backgroundBlur) return
	if (!applied) return
	Client.getMinecraft().field_71460_t.func_181022_b()
	applied = false
})

register('postGuiRender', (mx, my, gui) => {
	if (!config.backgroundBlur) return
	if (applied) return
	if (gui.class == 'class net.optifine.gui.GuiChatOF' || gui.class == 'class gg.essential.vigilance.gui.SettingsGui') return
	Client.getMinecraft().field_71460_t.func_181022_b()
	Client.getMinecraft().field_71460_t.func_175069_a(new ResourceLocation('shaders/post/blur.json'))
	applied = true
})

interface Toggles {
	Keybinds: Toggle;
	Watermark: Toggle;

	"mods.sprint.freeze_stamina": Toggle;
	"mods.flashlight.freeze_battery": Toggle;

	"visuals.players.esp": Toggle;
	"visuals.anomaly.esp": Toggle;
	"visuals.grabbed.esp": Toggle;
	"visuals.clicked.esp": Toggle;
	"visuals.anomaly.tracers": Toggle;

	"visuals.info.display": Toggle;
	"visuals.info.notices": Toggle;
}

interface Options {
	MenuKeybind: KeyPicker;

	"mods.sprint.stamina_threshold": Slider;
	"mods.flashlight.battery_threshold": Slider;

	"visuals.players.color": ColorPicker;
	"visuals.anomaly.color": ColorPicker;
	"visuals.others.color": ColorPicker;
}

import { Library, SaveManager, ThemeManager } from "@script-ts/linorialib";
const linoria_root = "https://raw.githubusercontent.com/TerminalVibes/LinoriaLib/main/";
const Library = loadstring(game.HttpGet(linoria_root + "Library.lua"))() as Library;
const ThemeManager = loadstring(game.HttpGet(linoria_root + "addons/ThemeManager.lua"))() as ThemeManager;
const SaveManager = loadstring(game.HttpGet(linoria_root + "addons/SaveManager.lua"))() as SaveManager;

const ROOT_FOLDER = "gaster_hub";
const CONFIG_NAME = "test";

namespace UserInterface {
	Library.Notify("[STATUS]: Loading UI...");
	Library.SetWatermark("GASTER HUB (TerminalVibes)");

	const window = Library.CreateWindow({
		Title: "Residence Massacre [Night 1]",
		Center: true,
		AutoShow: true,
		MenuFadeTime: 0,
	});

	namespace Mods {
		const tab = window.AddTab("Mods");

		namespace CharacterMods {
			const box = tab.AddLeftTabbox();

			// Sprint
			const sprint = box.AddTab("Sprint");
			sprint.AddToggle("mods.sprint.freeze_stamina", {
				Text: "Infinite Stamina",
				Default: true,
				Tooltip: "Freeze stamina consumption when below 25%.",
			});
			sprint.AddSlider("mods.sprint.stamina_threshold", {
				Text: "Amount",
				Suffix: "%",
				Rounding: 0,
				Min: 0,
				Max: 100,
				Default: 25,
				Compact: true,
			});

			// Flashlight
			const flashlight = box.AddTab("Flashlight");
			flashlight.AddToggle("mods.flashlight.freeze_battery", {
				Text: "Infinite Battery",
				Default: true,
				Tooltip: "Freeze the battery level of your flashlight.",
			});
			flashlight.AddSlider("mods.flashlight.battery_threshold", {
				Text: "Amount",
				Suffix: "%",
				Rounding: 0,
				Min: 0,
				Max: 100,
				Default: 25,
				Compact: true,
			});
		}
	}

	namespace Visuals {
		const tab = window.AddTab("Visuals");

		namespace ESP {
			const box = tab.AddLeftTabbox();

			// Players
			const players = box.AddTab("Player");
			players.AddToggle("visuals.players.esp", {
				Text: "Player ESP",
				Default: false,
				Tooltip: "ESP for players.",
			});

			// Anomalies
			const anomalies = box.AddTab("Anomaly");
			anomalies.AddToggle("visuals.anomaly.esp", {
				Text: "Anomaly ESP",
				Default: false,
				Tooltip: "ESP for anomalies.",
			});

			// Miscell
			const miscell = box.AddTab("Misc.");
			miscell.AddToggle("visuals.grabbed.esp", {
				Text: "Loot ESP",
				Default: false,
				Tooltip: "ESP for loot.",
			});
		}

		namespace Info {
			const box = tab.AddRightGroupbox("Info");
			box.AddToggle("visuals.info.display", {
				Text: "Display Enabled",
				Default: true,
				Tooltip: "Display information about the game state.",
			});
			box.AddToggle("visuals.info.notices", {
				Text: "Alerts Enabled",
				Default: true,
				Tooltip: "Display alerts about the game state.",
			});
		}
	}

	namespace Settings {
		const tab = window.AddTab("Settings");

		ThemeManager.SetLibrary(Library);
		SaveManager.SetLibrary(Library);

		ThemeManager.SetFolder(ROOT_FOLDER);
		SaveManager.SetFolder(ROOT_FOLDER + "/" + CONFIG_NAME);

		SaveManager.IgnoreThemeSettings();
		SaveManager.SetIgnoreIndexes(["MenuKeybind"]);

		SaveManager.BuildConfigSection(tab);
		ThemeManager.ApplyToTab(tab);

		const menu = tab.AddLeftGroupbox("Menu");
		menu.AddButton({
			Text: "Unload",
			Func: () => {
				Library.Unload();
			},
		});
		menu.AddLabel("Menu bind").AddKeyPicker("MenuKeybind", { Default: "End", NoUI: true, Text: "Menu keybind" });
		menu.AddToggle("Keybinds", {
			Text: "Show Keybinds Menu",
			Default: true,
			Callback: (value: boolean) => {
				Library.KeybindFrame.Visible = value;
			},
		});
		menu.AddToggle("Watermark", {
			Text: "Show Watermark",
			Default: true,
			Callback: (value: boolean) => {
				Library.SetWatermarkVisibility(value);
			},
		});
	}

	Library.Notify("[STATUS]: UI loaded.");
}

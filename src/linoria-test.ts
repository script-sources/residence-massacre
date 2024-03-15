import type { Library, SaveManager, ThemeManager } from "@script-ts/linorialib";

declare global {
	interface Options {
		MenuKeybind: KeyPicker;
		MySlider: Slider;
		MyTextbox: Input;
		MyDropdown: Dropdown<"This" | "is" | "a" | "dropdown", false>;
		MyMultiDropdown: Dropdown<"This" | "is" | "a" | "dropdown", true>;
		MyPlayerDropdown: Dropdown<string, false>;
		ColorPicker: ColorPicker;
		KeyPicker: KeyPicker;
	}

	interface Toggles {
		MyToggle: Toggle;
		Tab1Toggle: Toggle;
		Tab2Toggle: Toggle;
		ControlToggle: Toggle;
		DepboxToggle: Toggle;
	}
}

const repo = "https://raw.githubusercontent.com/TerminalVibes/LinoriaLib/main/";
const Library = loadstring(game.HttpGet(repo + "Library.lua"))() as Library;
const ThemeManager = loadstring(game.HttpGet(repo + "addons/ThemeManager.lua"))() as ThemeManager;
const SaveManager = loadstring(game.HttpGet(repo + "addons/SaveManager.lua"))() as SaveManager;

const Window = Library.CreateWindow({
	Title: "Example menu",
	Center: true,
	AutoShow: true,
	TabPadding: 8,
	MenuFadeTime: 0,
});

const Tabs = {
	Main: Window.AddTab("Main"),
	["UI Settings"]: Window.AddTab("UI Settings"),
};

const LeftGroupBox = Tabs.Main.AddLeftGroupbox("Groupbox");

LeftGroupBox.AddToggle("MyToggle", {
	Text: "This is a toggle",
	Default: true,
	Tooltip: "This is a tooltip",
	Callback: (Value) => {
		print("[cb] MyToggle changed to:", Value);
	},
});

Toggles.MyToggle.OnChanged(() => {
	print("MyToggle changed to:", Toggles.MyToggle.Value);
});

Toggles.MyToggle.SetValue(false);

const MyButton = LeftGroupBox.AddButton({
	Text: "Button",
	Func: () => {
		print("You clicked a button!");
	},
	DoubleClick: false,
	Tooltip: "This is the main button",
});

const MyButton2 = MyButton.AddButton({
	Text: "Sub button",
	Func: () => {
		print("You clicked a sub button!");
	},
	DoubleClick: true,
	Tooltip: "This is the sub button (double click me!)",
});

LeftGroupBox.AddLabel("This is a label");
LeftGroupBox.AddLabel("This is a label\n\nwhich wraps its text!", true);

LeftGroupBox.AddDivider();

LeftGroupBox.AddSlider("MySlider", {
	Text: "This is my slider!",
	Default: 0,
	Min: 0,
	Max: 5,
	Rounding: 1,
	Compact: false,
	Callback: (Value) => {
		print("[cb] MySlider was changed! New value:", Value);
	},
});

const Number = Options.MySlider.Value;
Options.MySlider.OnChanged(() => {
	print("MySlider was changed! New value:", Options.MySlider.Value);
});

Options.MySlider.SetValue(3);

LeftGroupBox.AddInput("MyTextbox", {
	Default: "My textbox!",
	Numeric: false,
	Finished: false,
	Text: "This is a textbox",
	Tooltip: "This is a tooltip",
	Placeholder: "Placeholder text",
	Callback: (Value) => {
		print("[cb] Text updated. New text:", Value);
	},
});

Options.MyTextbox.OnChanged(() => {
	print("Text updated. New text:", Options.MyTextbox.Value);
});

LeftGroupBox.AddDropdown("MyDropdown", {
	Values: ["This", "is", "a", "dropdown"],
	Default: 1,
	Multi: false,
	Text: "A dropdown",
	Tooltip: "This is a tooltip",
	Callback: (Value) => {
		print("[cb] Dropdown got changed. New value:", Value);
	},
});

Options.MyDropdown.OnChanged(() => {
	print("Dropdown got changed. New value:", Options.MyDropdown.Value);
});

Options.MyDropdown.SetValue("This");

LeftGroupBox.AddDropdown("MyMultiDropdown", {
	Values: ["This", "is", "a", "dropdown"],
	Default: 1,
	Multi: true,
	Text: "A dropdown",
	Tooltip: "This is a tooltip",
	Callback: (Value) => {
		print("[cb] Multi dropdown got changed:", Value);
	},
});

Options.MyMultiDropdown.OnChanged(() => {
	print("Multi dropdown got changed:");
});

Options.MyMultiDropdown.SetValue(new Set(["This", "is"]));

LeftGroupBox.AddDropdown("MyPlayerDropdown", {
	Values: [],
	SpecialType: "Player",
	Text: "A player dropdown",
	Tooltip: "This is a tooltip",
	Callback: (Value) => {
		print("[cb] Player dropdown got changed:", Value);
	},
});

LeftGroupBox.AddLabel("Color").AddColorPicker("ColorPicker", {
	Default: new Color3(0, 1, 0),
	Title: "Some color",
	Transparency: 0,
	Callback: (Value) => {
		print("[cb] Color changed!", Value);
	},
});

Options.ColorPicker.OnChanged(() => {
	print("Color changed!", Options.ColorPicker.Value);
	print("Transparency changed!", Options.ColorPicker.Transparency);
});

Options.ColorPicker.SetValueRGB(Color3.fromRGB(0, 255, 140));

LeftGroupBox.AddLabel("Keybind").AddKeyPicker("KeyPicker", {
	Default: "MB2",
	SyncToggleState: false,
	Mode: "Toggle",
	Text: "Auto lockpick safes",
	NoUI: false,
	Callback: (Value) => {
		print("[cb] Keybind clicked!", Value);
	},
	ChangedCallback: (New) => {
		print("[cb] Keybind changed!", New);
	},
});

Options.KeyPicker.OnClick(() => {
	print("Keybind clicked!", Options.KeyPicker.GetState());
});

Options.KeyPicker.OnChanged(() => {
	print("Keybind changed!", Options.KeyPicker.Value);
});

Options.KeyPicker.SetValue(["MB2", "Toggle"]);

const LeftGroupBox2 = Tabs.Main.AddLeftGroupbox("Groupbox #2");
LeftGroupBox2.AddLabel(
	"Oh no...\nThis label spans multiple lines!\n\nWe're gonna run out of UI space...\nJust kidding! Scroll down!\n\n\nHello from below!",
	true,
);

const TabBox = Tabs.Main.AddRightTabbox();

const Tab1 = TabBox.AddTab("Tab 1");
Tab1.AddToggle("Tab1Toggle", { Text: "Tab1 Toggle" });

const Tab2 = TabBox.AddTab("Tab 2");
Tab2.AddToggle("Tab2Toggle", { Text: "Tab2 Toggle" });

const RightGroupbox = Tabs.Main.AddRightGroupbox("Groupbox #3");
RightGroupbox.AddToggle("ControlToggle", { Text: "Dependency box toggle" });

const Depbox = RightGroupbox.AddDependencyBox();
Depbox.AddToggle("DepboxToggle", { Text: "Sub-dependency box toggle" });

const SubDepbox = Depbox.AddDependencyBox();
SubDepbox.AddSlider("DepboxSlider", { Text: "Slider", Default: 50, Min: 0, Max: 100, Rounding: 0 });
SubDepbox.AddDropdown("DepboxDropdown", { Text: "Dropdown", Default: 1, Values: ["a", "b", "c"] });

Depbox.SetupDependencies([[Toggles.ControlToggle, true]]);

SubDepbox.SetupDependencies([[Toggles.DepboxToggle, true]]);

Library.SetWatermarkVisibility(true);

let FrameTimer = tick();
let FrameCounter = 0;
let FPS = 60;

const WatermarkConnection = game.GetService("RunService").RenderStepped.Connect(() => {
	FrameCounter++;

	if (tick() - FrameTimer >= 1) {
		FPS = FrameCounter;
		FrameTimer = tick();
		FrameCounter = 0;
	}

	Library.SetWatermark(`LinoriaLib demo | ${math.floor(FPS)} fps`);
});

Library.KeybindFrame.Visible = true;

Library.OnUnload(() => {
	WatermarkConnection.Disconnect();

	print("Unloaded!");
	Library.Unloaded = true;
});

const MenuGroup = Tabs["UI Settings"].AddLeftGroupbox("Menu");

MenuGroup.AddButton({
	Text: "Unload",
	Func: () => Library.Unload(),
});
MenuGroup.AddLabel("Menu bind").AddKeyPicker("MenuKeybind", { Default: "End", NoUI: true, Text: "Menu keybind" });

Library.ToggleKeybind = Options.MenuKeybind;

ThemeManager.SetLibrary(Library);
SaveManager.SetLibrary(Library);

SaveManager.IgnoreThemeSettings();

SaveManager.SetIgnoreIndexes(["MenuKeybind"]);

ThemeManager.SetFolder("MyScriptHub");
SaveManager.SetFolder("MyScriptHub/specific-game");

SaveManager.BuildConfigSection(Tabs["UI Settings"]);

ThemeManager.ApplyToTab(Tabs["UI Settings"]);

SaveManager.LoadAutoloadConfig();

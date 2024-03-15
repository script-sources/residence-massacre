-- Compiled with roblox-ts v2.3.0
local repo = "https://raw.githubusercontent.com/TerminalVibes/LinoriaLib/main/"
local Library = loadstring(game:HttpGet(repo .. "Library.lua"))()
local ThemeManager = loadstring(game:HttpGet(repo .. "addons/ThemeManager.lua"))()
local SaveManager = loadstring(game:HttpGet(repo .. "addons/SaveManager.lua"))()
local Window = Library:CreateWindow({
	Title = "Example menu",
	Center = true,
	AutoShow = true,
	TabPadding = 8,
	MenuFadeTime = 0,
})
local Tabs = {
	Main = Window:AddTab("Main"),
	["UI Settings"] = Window:AddTab("UI Settings"),
}
local LeftGroupBox = Tabs.Main:AddLeftGroupbox("Groupbox")
LeftGroupBox:AddToggle("MyToggle", {
	Text = "This is a toggle",
	Default = true,
	Tooltip = "This is a tooltip",
	Callback = function(Value)
		print("[cb] MyToggle changed to:", Value)
	end,
})
Toggles.MyToggle:OnChanged(function()
	print("MyToggle changed to:", Toggles.MyToggle.Value)
end)
Toggles.MyToggle:SetValue(false)
local MyButton = LeftGroupBox:AddButton({
	Text = "Button",
	Func = function()
		print("You clicked a button!")
	end,
	DoubleClick = false,
	Tooltip = "This is the main button",
})
local MyButton2 = MyButton:AddButton({
	Text = "Sub button",
	Func = function()
		print("You clicked a sub button!")
	end,
	DoubleClick = true,
	Tooltip = "This is the sub button (double click me!)",
})
LeftGroupBox:AddLabel("This is a label")
LeftGroupBox:AddLabel("This is a label\n\nwhich wraps its text!", true)
LeftGroupBox:AddDivider()
LeftGroupBox:AddSlider("MySlider", {
	Text = "This is my slider!",
	Default = 0,
	Min = 0,
	Max = 5,
	Rounding = 1,
	Compact = false,
	Callback = function(Value)
		print("[cb] MySlider was changed! New value:", Value)
	end,
})
local Number = Options.MySlider.Value
Options.MySlider:OnChanged(function()
	print("MySlider was changed! New value:", Options.MySlider.Value)
end)
Options.MySlider:SetValue(3)
LeftGroupBox:AddInput("MyTextbox", {
	Default = "My textbox!",
	Numeric = false,
	Finished = false,
	Text = "This is a textbox",
	Tooltip = "This is a tooltip",
	Placeholder = "Placeholder text",
	Callback = function(Value)
		print("[cb] Text updated. New text:", Value)
	end,
})
Options.MyTextbox:OnChanged(function()
	print("Text updated. New text:", Options.MyTextbox.Value)
end)
LeftGroupBox:AddDropdown("MyDropdown", {
	Values = { "This", "is", "a", "dropdown" },
	Default = 1,
	Multi = false,
	Text = "A dropdown",
	Tooltip = "This is a tooltip",
	Callback = function(Value)
		print("[cb] Dropdown got changed. New value:", Value)
	end,
})
Options.MyDropdown:OnChanged(function()
	print("Dropdown got changed. New value:", Options.MyDropdown.Value)
end)
Options.MyDropdown:SetValue("This")
LeftGroupBox:AddDropdown("MyMultiDropdown", {
	Values = { "This", "is", "a", "dropdown" },
	Default = 1,
	Multi = true,
	Text = "A dropdown",
	Tooltip = "This is a tooltip",
	Callback = function(Value)
		print("[cb] Multi dropdown got changed:", Value)
	end,
})
Options.MyMultiDropdown:OnChanged(function()
	print("Multi dropdown got changed:")
end)
Options.MyMultiDropdown:SetValue({
	["This"] = true,
	["is"] = true,
})
LeftGroupBox:AddDropdown("MyPlayerDropdown", {
	Values = {},
	SpecialType = "Player",
	Text = "A player dropdown",
	Tooltip = "This is a tooltip",
	Callback = function(Value)
		print("[cb] Player dropdown got changed:", Value)
	end,
})
LeftGroupBox:AddLabel("Color"):AddColorPicker("ColorPicker", {
	Default = Color3.new(0, 1, 0),
	Title = "Some color",
	Transparency = 0,
	Callback = function(Value)
		print("[cb] Color changed!", Value)
	end,
})
Options.ColorPicker:OnChanged(function()
	print("Color changed!", Options.ColorPicker.Value)
	print("Transparency changed!", Options.ColorPicker.Transparency)
end)
Options.ColorPicker:SetValueRGB(Color3.fromRGB(0, 255, 140))
LeftGroupBox:AddLabel("Keybind"):AddKeyPicker("KeyPicker", {
	Default = "MB2",
	SyncToggleState = false,
	Mode = "Toggle",
	Text = "Auto lockpick safes",
	NoUI = false,
	Callback = function(Value)
		print("[cb] Keybind clicked!", Value)
	end,
	ChangedCallback = function(New)
		print("[cb] Keybind changed!", New)
	end,
})
Options.KeyPicker:OnClick(function()
	print("Keybind clicked!", Options.KeyPicker:GetState())
end)
Options.KeyPicker:OnChanged(function()
	print("Keybind changed!", Options.KeyPicker.Value)
end)
Options.KeyPicker:SetValue({
	Key = "MB2",
	Mode = "Toggle",
})
local LeftGroupBox2 = Tabs.Main:AddLeftGroupbox("Groupbox #2")
LeftGroupBox2:AddLabel("Oh no...\nThis label spans multiple lines!\n\nWe're gonna run out of UI space...\nJust kidding! Scroll down!\n\n\nHello from below!", true)
local TabBox = Tabs.Main:AddRightTabbox()
local Tab1 = TabBox:AddTab("Tab 1")
Tab1:AddToggle("Tab1Toggle", {
	Text = "Tab1 Toggle",
})
local Tab2 = TabBox:AddTab("Tab 2")
Tab2:AddToggle("Tab2Toggle", {
	Text = "Tab2 Toggle",
})
local RightGroupbox = Tabs.Main:AddRightGroupbox("Groupbox #3")
RightGroupbox:AddToggle("ControlToggle", {
	Text = "Dependency box toggle",
})
local Depbox = RightGroupbox:AddDependencyBox()
Depbox:AddToggle("DepboxToggle", {
	Text = "Sub-dependency box toggle",
})
local SubDepbox = Depbox:AddDependencyBox()
SubDepbox:AddSlider("DepboxSlider", {
	Text = "Slider",
	Default = 50,
	Min = 0,
	Max = 100,
	Rounding = 0,
})
SubDepbox:AddDropdown("DepboxDropdown", {
	Text = "Dropdown",
	Default = 1,
	Values = { "a", "b", "c" },
})
Depbox:SetupDependencies({ { Toggles.ControlToggle, true } })
SubDepbox:SetupDependencies({ { Toggles.DepboxToggle, true } })
Library:SetWatermarkVisibility(true)
local FrameTimer = tick()
local FrameCounter = 0
local FPS = 60
local WatermarkConnection = game:GetService("RunService").RenderStepped:Connect(function()
	FrameCounter += 1
	if tick() - FrameTimer >= 1 then
		FPS = FrameCounter
		FrameTimer = tick()
		FrameCounter = 0
	end
	Library:SetWatermark(`LinoriaLib demo | {math.floor(FPS)} fps`)
end)
Library.KeybindFrame.Visible = true
Library:OnUnload(function()
	WatermarkConnection:Disconnect()
	print("Unloaded!")
	Library.Unloaded = true
end)
local MenuGroup = Tabs["UI Settings"]:AddLeftGroupbox("Menu")
MenuGroup:AddButton({
	Text = "Unload",
	Func = function()
		return Library:Unload()
	end,
})
MenuGroup:AddLabel("Menu bind"):AddKeyPicker("MenuKeybind", {
	Default = "End",
	NoUI = true,
	Text = "Menu keybind",
})
Library.ToggleKeybind = Options.MenuKeybind
ThemeManager:SetLibrary(Library)
SaveManager:SetLibrary(Library)
SaveManager:IgnoreThemeSettings()
SaveManager:SetIgnoreIndexes({ "MenuKeybind" })
ThemeManager:SetFolder("MyScriptHub")
SaveManager:SetFolder("MyScriptHub/specific-game")
SaveManager:BuildConfigSection(Tabs["UI Settings"])
ThemeManager:ApplyToTab(Tabs["UI Settings"])
SaveManager:LoadAutoloadConfig()
return nil

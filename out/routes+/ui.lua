-- Compiled with roblox-ts v2.3.0
local linoria_root = "https://raw.githubusercontent.com/TerminalVibes/LinoriaLib/main/"
local Library = loadstring(game:HttpGet(linoria_root .. "Library.lua"))()
local ThemeManager = loadstring(game:HttpGet(linoria_root .. "addons/ThemeManager.lua"))()
local SaveManager = loadstring(game:HttpGet(linoria_root .. "addons/SaveManager.lua"))()
local ROOT_FOLDER = "gaster_hub"
local CONFIG_NAME = "test"
local UserInterface = {}
do
	Library:Notify("[STATUS]: Loading UI...")
	Library:SetWatermark("GASTER HUB (TerminalVibes)")
	local window = Library:CreateWindow({
		Title = "Residence Massacre [Night 1]",
		Center = true,
		AutoShow = true,
		MenuFadeTime = 0,
	})
	local Mods = {}
	do
		local tab = window:AddTab("Mods")
		local CharacterMods = {}
		do
			local box = tab:AddLeftTabbox()
			-- Sprint
			local sprint = box:AddTab("Sprint")
			sprint:AddToggle("mods.sprint.freeze_stamina", {
				Text = "Infinite Stamina",
				Default = true,
				Tooltip = "Freeze stamina consumption when below 25%.",
			})
			sprint:AddSlider("mods.sprint.stamina_threshold", {
				Text = "Amount",
				Suffix = "%",
				Rounding = 0,
				Min = 0,
				Max = 100,
				Default = 25,
				Compact = true,
			})
			-- Flashlight
			local flashlight = box:AddTab("Flashlight")
			flashlight:AddToggle("mods.flashlight.freeze_battery", {
				Text = "Infinite Battery",
				Default = true,
				Tooltip = "Freeze the battery level of your flashlight.",
			})
			flashlight:AddSlider("mods.flashlight.battery_threshold", {
				Text = "Amount",
				Suffix = "%",
				Rounding = 0,
				Min = 0,
				Max = 100,
				Default = 25,
				Compact = true,
			})
		end
	end
	local Visuals = {}
	do
		local tab = window:AddTab("Visuals")
		local ESP = {}
		do
			local box = tab:AddLeftTabbox()
			-- Players
			local players = box:AddTab("Player")
			players:AddToggle("visuals.players.esp", {
				Text = "Player ESP",
				Default = false,
				Tooltip = "ESP for players.",
			})
			-- Anomalies
			local anomalies = box:AddTab("Anomaly")
			anomalies:AddToggle("visuals.anomaly.esp", {
				Text = "Anomaly ESP",
				Default = false,
				Tooltip = "ESP for anomalies.",
			})
			-- Miscell
			local miscell = box:AddTab("Misc.")
			miscell:AddToggle("visuals.grabbed.esp", {
				Text = "Loot ESP",
				Default = false,
				Tooltip = "ESP for loot.",
			})
		end
		local Info = {}
		do
			local box = tab:AddRightGroupbox("Info")
			box:AddToggle("visuals.info.display", {
				Text = "Display Enabled",
				Default = true,
				Tooltip = "Display information about the game state.",
			})
			box:AddToggle("visuals.info.notices", {
				Text = "Alerts Enabled",
				Default = true,
				Tooltip = "Display alerts about the game state.",
			})
		end
	end
	local Settings = {}
	do
		local tab = window:AddTab("Settings")
		ThemeManager:SetLibrary(Library)
		SaveManager:SetLibrary(Library)
		ThemeManager:SetFolder(ROOT_FOLDER)
		SaveManager:SetFolder(ROOT_FOLDER .. "/" .. CONFIG_NAME)
		SaveManager:IgnoreThemeSettings()
		SaveManager:SetIgnoreIndexes({ "MenuKeybind" })
		SaveManager:BuildConfigSection(tab)
		ThemeManager:ApplyToTab(tab)
		local menu = tab:AddLeftGroupbox("Menu")
		menu:AddButton({
			Text = "Unload",
			Func = function()
				Library:Unload()
			end,
		})
		menu:AddLabel("Menu bind"):AddKeyPicker("MenuKeybind", {
			Default = "End",
			NoUI = true,
			Text = "Menu keybind",
		})
		menu:AddToggle("Keybinds", {
			Text = "Show Keybinds Menu",
			Default = true,
			Callback = function(value)
				Library.KeybindFrame.Visible = value
			end,
		})
		menu:AddToggle("Watermark", {
			Text = "Show Watermark",
			Default = true,
			Callback = function(value)
				Library:SetWatermarkVisibility(value)
			end,
		})
	end
	Library:Notify("[STATUS]: UI loaded.")
end
return nil

-- Compiled with roblox-ts v2.3.0
local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local Workspace = game:GetService("Workspace")
if _G["residence-massacre"] == true then
	error("This program is already running!")
end
_G["residence-massacre"] = true
--[[
	***********************************************************
	 * CONFIGURATIONS
	 * Description: User-defined settings and configurations
	 * Last updated: Feb. 14, 2024
	 ***********************************************************
]]
local LOOTABLE_NAMES = {
	["BloxyCola"] = true,
	["Wrench"] = true,
	["Battery"] = true,
	["Medkit"] = true,
}
local FLASHLIGHT_NAMES = {
	["Flashlight"] = true,
	["BetterFlashlight"] = true,
}
--[[
	***********************************************************
	 * VARIABLES
	 * Description: Variables referenced globally in the script
	 * Last updated: Feb. 14, 2024
	 ***********************************************************
]]
local LocalPlayer = Players.LocalPlayer
--[[
	***********************************************************
	 * UTILITIES
	 * Description: Helper functions and classes
	 * Last updated: Feb. 14, 2024
	 ***********************************************************
]]
local Bin
do
	Bin = setmetatable({}, {
		__tostring = function()
			return "Bin"
		end,
	})
	Bin.__index = Bin
	function Bin.new(...)
		local self = setmetatable({}, Bin)
		return self:constructor(...) or self
	end
	function Bin:constructor()
	end
	function Bin:add(item)
		local node = {
			item = item,
		}
		if self.head == nil then
			self.head = node
		end
		if self.tail then
			self.tail.next = node
		end
		self.tail = node
		return item
	end
	function Bin:batch(...)
		local args = { ... }
		for _, item in args do
			local node = {
				item = item,
			}
			if self.head == nil then
				self.head = node
			end
			if self.tail then
				self.tail.next = node
			end
			self.tail = node
		end
		return args
	end
	function Bin:destroy()
		while self.head do
			local item = self.head.item
			if type(item) == "function" then
				item()
			elseif typeof(item) == "RBXScriptConnection" then
				item:Disconnect()
			elseif type(item) == "thread" then
				task.cancel(item)
			elseif item.destroy ~= nil then
				item:destroy()
			elseif item.Destroy ~= nil then
				item:Destroy()
			end
			self.head = self.head.next
		end
	end
	function Bin:isEmpty()
		return self.head == nil
	end
end
local Library = (function()
	local Section
	local Window
	do
		Window = setmetatable({}, {
			__tostring = function()
				return "Window"
			end,
		})
		Window.__index = Window
		function Window.new(...)
			local self = setmetatable({}, Window)
			return self:constructor(...) or self
		end
		function Window:constructor()
			-- Instances
			local ScreenGui = Instance.new("ScreenGui")
			local Frame = Instance.new("Frame")
			local UIPadding = Instance.new("UIPadding")
			local UIListLayout = Instance.new("UIListLayout")
			-- Properties
			ScreenGui.ResetOnSpawn = false
			ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
			Frame.AnchorPoint = Vector2.new(0, 0.5)
			Frame.BackgroundColor3 = Color3.new(1, 1, 1)
			Frame.BackgroundTransparency = 0.925
			Frame.BorderSizePixel = 0
			Frame.Position = UDim2.new(0, 5, 0.5, 0)
			Frame.Size = UDim2.new(0, 140, 0, 120)
			UIPadding.PaddingBottom = UDim.new(0, 5)
			UIPadding.PaddingLeft = UDim.new(0, 5)
			UIPadding.PaddingRight = UDim.new(0, 5)
			UIPadding.PaddingTop = UDim.new(0, 5)
			UIListLayout.Padding = UDim.new(0, 6)
			-- Initialize
			local padding = UIPadding.PaddingTop.Offset + UIPadding.PaddingBottom.Offset
			local onContentSize = UIListLayout:GetPropertyChangedSignal("AbsoluteContentSize")
			onContentSize:Connect(function()
				Frame.Size = UDim2.new(0, 140, 0, UIListLayout.AbsoluteContentSize.Y + padding)
				return Frame.Size
			end)
			Frame.Size = UDim2.new(0, 140, 0, UIListLayout.AbsoluteContentSize.Y + padding)
			local tweenInfo = TweenInfo.new(0.08, Enum.EasingStyle.Sine)
			Frame.InputBegan:Connect(function(input)
				if input.UserInputType == Enum.UserInputType.MouseButton1 then
					local initialFramePosition = Frame.Position
					local initialMousePosition = UserInputService:GetMouseLocation()
					local startX = initialFramePosition.X
					local startY = initialFramePosition.Y
					local mouseStart = Vector2.new(initialMousePosition.X, initialMousePosition.Y)
					local updater = RunService.RenderStepped:Connect(function()
						local position = UserInputService:GetMouseLocation()
						local delta = position - mouseStart
						local newX = startX.Offset + delta.X
						local newY = startY.Offset + delta.Y
						TweenService:Create(Frame, tweenInfo, {
							Position = UDim2.new(startX.Scale, newX, startY.Scale, newY),
						}):Play()
					end)
					local terminator
					terminator = input.Changed:Connect(function()
						if input.UserInputState == Enum.UserInputState.End then
							terminator:Disconnect()
							updater:Disconnect()
						end
					end)
				end
			end)
			UIPadding.Parent = Frame
			UIListLayout.Parent = Frame
			Frame.Parent = ScreenGui
			ScreenGui.Parent = CoreGui
			self.frame = Frame
		end
		function Window:section(name)
			return Section.new(name, self.frame)
		end
	end
	local Label, State
	do
		Section = setmetatable({}, {
			__tostring = function()
				return "Section"
			end,
		})
		Section.__index = Section
		function Section.new(...)
			local self = setmetatable({}, Section)
			return self:constructor(...) or self
		end
		function Section:constructor(name, parent)
			-- Instances
			local Frame = Instance.new("Frame")
			local UIListLayout = Instance.new("UIListLayout")
			local Header = Instance.new("Frame")
			local TextLabel = Instance.new("TextLabel")
			-- Properties
			Frame.BackgroundTransparency = 1
			Frame.Size = UDim2.new(1, 0, 0, 52)
			UIListLayout.SortOrder = Enum.SortOrder.LayoutOrder
			Header.BackgroundTransparency = 1
			Header.Name = "Header"
			Header.Size = UDim2.new(1, 0, 0, 18)
			TextLabel.BackgroundTransparency = 1
			TextLabel.FontFace = Font.new("rbxasset://fonts/families/Inconsolata.json", Enum.FontWeight.Bold)
			TextLabel.Size = UDim2.new(1, 0, 1, 0)
			TextLabel.Text = name
			TextLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
			TextLabel.TextSize = 14
			TextLabel.TextStrokeTransparency = 0.6
			TextLabel.TextWrapped = true
			-- Initialize
			local onContentSize = UIListLayout:GetPropertyChangedSignal("AbsoluteContentSize")
			onContentSize:Connect(function()
				Frame.Size = UDim2.new(1, 0, 0, UIListLayout.AbsoluteContentSize.Y)
				return Frame.Size
			end)
			Frame.Size = UDim2.new(1, 0, 0, UIListLayout.AbsoluteContentSize.Y)
			UIListLayout.Parent = Frame
			TextLabel.Parent = Header
			Header.Parent = Frame
			Frame.Parent = parent
			self.frame = Frame
		end
		function Section:label(text)
			return Label.new(text, self.frame)
		end
		function Section:state(label)
			return State.new(label, self.frame)
		end
	end
	do
		Label = setmetatable({}, {
			__tostring = function()
				return "Label"
			end,
		})
		Label.__index = Label
		function Label.new(...)
			local self = setmetatable({}, Label)
			return self:constructor(...) or self
		end
		function Label:constructor(label, parent)
			-- Instance
			local TextLabel = Instance.new("TextLabel")
			-- Properties
			TextLabel.BackgroundTransparency = 1
			TextLabel.Font = Enum.Font.Code
			TextLabel.Name = "Label"
			TextLabel.Size = UDim2.new(1, 0, 0, 16)
			TextLabel.Text = label
			TextLabel.TextColor3 = Color3.new(1, 1, 1)
			TextLabel.TextSize = 14
			TextLabel.TextStrokeTransparency = 0.6
			TextLabel.TextWrapped = true
			TextLabel.TextXAlignment = Enum.TextXAlignment.Left
			-- Initialize
			TextLabel.Parent = parent
			self.label = TextLabel
		end
		function Label:setLabel(label)
			self.label.Text = label
			return self
		end
	end
	do
		State = setmetatable({}, {
			__tostring = function()
				return "State"
			end,
		})
		State.__index = State
		function State.new(...)
			local self = setmetatable({}, State)
			return self:constructor(...) or self
		end
		function State:constructor(label, parent)
			local Entry = Instance.new("Frame")
			local Label = Instance.new("TextLabel")
			local Value = Instance.new("TextLabel")
			-- Properties
			Entry.BackgroundTransparency = 1
			Entry.LayoutOrder = 1
			Entry.Name = "Entry"
			Entry.Size = UDim2.new(1, 0, 0, 16)
			Label.BackgroundTransparency = 1
			Label.Font = Enum.Font.Code
			Label.Name = "Label"
			Label.Size = UDim2.new(1, 0, 1, 0)
			Label.Text = label
			Label.TextColor3 = Color3.new(1, 1, 1)
			Label.TextSize = 14
			Label.TextStrokeTransparency = 0.6
			Label.TextWrapped = true
			Label.TextXAlignment = Enum.TextXAlignment.Left
			Value.BackgroundTransparency = 1
			Value.Font = Enum.Font.Code
			Value.Name = "Value"
			Value.Size = UDim2.new(1, 0, 1, 0)
			Value.Text = ""
			Value.TextColor3 = Color3.new(1, 1, 1)
			Value.TextSize = 14
			Value.TextStrokeTransparency = 0.6
			Value.TextWrapped = true
			Value.TextXAlignment = Enum.TextXAlignment.Right
			-- Initialize
			Label.Parent = Entry
			Value.Parent = Entry
			Entry.Parent = parent
			self.label = Label
			self.value = Value
		end
		function State:setLabel(text)
			self.label.Text = text
			return self
		end
		function State:setValue(value)
			self.value.Text = value
			return self
		end
		function State:setColor(color)
			self.value.TextColor3 = color
			return self
		end
	end
	return {
		window = function()
			return Window.new()
		end,
	}
end)()
--[[
	***********************************************************
	 * COMPONENTS
	 * Description: Classes for specific entities/objects
	 * Last updated: Feb. 14, 2024
	 ***********************************************************
]]
local BaseComponent
do
	BaseComponent = setmetatable({}, {
		__tostring = function()
			return "BaseComponent"
		end,
	})
	BaseComponent.__index = BaseComponent
	function BaseComponent.new(...)
		local self = setmetatable({}, BaseComponent)
		return self:constructor(...) or self
	end
	function BaseComponent:constructor(instance)
		self.instance = instance
		self.bin = Bin.new()
	end
	function BaseComponent:destroy()
		self.bin:destroy()
	end
end
local LootableComponent
do
	local super = BaseComponent
	LootableComponent = setmetatable({}, {
		__tostring = function()
			return "LootableComponent"
		end,
		__index = super,
	})
	LootableComponent.__index = LootableComponent
	function LootableComponent.new(...)
		local self = setmetatable({}, LootableComponent)
		return self:constructor(...) or self
	end
	function LootableComponent:constructor(instance)
		super.constructor(self, instance)
		self.label = instance.Name
		self.root = instance:WaitForChild("Handle", 30)
		-- Initialize:
		self:createVisual()
	end
	function LootableComponent:createVisual()
		local _binding = self
		local label = _binding.label
		local root = _binding.root
		local bin = _binding.bin
		-- Instances:
		local BillboardGui = Instance.new("BillboardGui")
		local Indicator = Instance.new("Frame")
		local Name = Instance.new("TextLabel")
		-- Properties:
		BillboardGui.Adornee = root
		BillboardGui.AlwaysOnTop = true
		BillboardGui.ResetOnSpawn = false
		BillboardGui.Size = UDim2.new(0, 100, 0, 100)
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
		Indicator.AnchorPoint = Vector2.new(0.5, 0.5)
		Indicator.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
		Indicator.BorderSizePixel = 0
		Indicator.Position = UDim2.new(0.5, 0, 0.5, 0)
		Indicator.Size = UDim2.new(0, 8, 0, 8)
		Name.BackgroundTransparency = 1
		Name.Font = Enum.Font.Nunito
		Name.Position = UDim2.new(0, 0, 0, 55)
		Name.Size = UDim2.new(1, 0, 0, 12)
		Name.Text = label
		Name.TextColor3 = Color3.fromRGB(255, 255, 255)
		Name.TextSize = 12
		Name.TextStrokeTransparency = 0.5
		-- Initialize:
		Name.Parent = BillboardGui
		Indicator.Parent = BillboardGui
		BillboardGui.Parent = CoreGui
		bin:add(BillboardGui)
	end
end
local LightComponent
do
	local super = BaseComponent
	LightComponent = setmetatable({}, {
		__tostring = function()
			return "LightComponent"
		end,
		__index = super,
	})
	LightComponent.__index = LightComponent
	function LightComponent.new(...)
		local self = setmetatable({}, LightComponent)
		return self:constructor(...) or self
	end
	function LightComponent:constructor(instance)
		super.constructor(self, instance)
		local _binding = self
		local bin = _binding.bin
		for _, child in instance:GetChildren() do
			self:onChild(child)
		end
		bin:add(instance.ChildAdded:Connect(function(child)
			return self:onChild(child)
		end))
	end
	function LightComponent:onChild(child)
		local name = child.Name
		if name == "Switch" then
			local root = child:WaitForChild("Detector", 6)
			if not root then
				error("Detector not found!")
			end
			self:createVisual(root)
		end
	end
	function LightComponent:createVisual(root)
		local _binding = self
		local bin = _binding.bin
		-- Instances:
		local BillboardGui = Instance.new("BillboardGui")
		local Frame = Instance.new("Frame")
		-- Properties:
		BillboardGui.Adornee = root
		BillboardGui.AlwaysOnTop = true
		BillboardGui.ResetOnSpawn = false
		BillboardGui.Size = UDim2.new(0.25, 0, 0.25, 0)
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
		Frame.AnchorPoint = Vector2.new(0.5, 0.5)
		Frame.BackgroundColor3 = Color3.fromRGB(255, 255, 150)
		Frame.BorderSizePixel = 0
		Frame.Position = UDim2.new(0.5, 0, 0.5, 0)
		Frame.Size = UDim2.new(1, 0, 1, 0)
		-- Initialize:
		Frame.Parent = BillboardGui
		BillboardGui.Parent = CoreGui
		bin:add(BillboardGui)
	end
end
local AgentController
local EntityComponent
do
	local super = BaseComponent
	EntityComponent = setmetatable({}, {
		__tostring = function()
			return "EntityComponent"
		end,
		__index = super,
	})
	EntityComponent.__index = EntityComponent
	function EntityComponent.new(...)
		local self = setmetatable({}, EntityComponent)
		return self:constructor(...) or self
	end
	function EntityComponent:constructor(instance)
		super.constructor(self, instance)
		self.isActive = false
		local _binding = self
		local bin = _binding.bin
		local root = instance:WaitForChild("HumanoidRootPart", 5)
		if not root then
			error("Entity is missing a HumanoidRootPart!")
		end
		local configs = instance:WaitForChild("Config", 5)
		if not configs then
			error("Entity is missing Config folder!")
		end
		self.root = root
		self.configs = configs
		-- Initialize
		self:createVisual()
		-- Bindings
		bin:batch(instance.AncestryChanged:Connect(function()
			return self:onActive(instance.Parent == Workspace)
		end))
	end
	function EntityComponent:id()
		return "Entity"
	end
	function EntityComponent:onActive(state)
		self.isActive = state
	end
	function EntityComponent:createVisual()
		local _binding = self
		local root = _binding.root
		local bin = _binding.bin
		-- Instances:
		local BillboardGui = Instance.new("BillboardGui")
		local Indicator = Instance.new("Frame")
		local Name = Instance.new("TextLabel")
		local Info = Instance.new("TextLabel")
		-- Properties:
		BillboardGui.Adornee = root
		BillboardGui.AlwaysOnTop = true
		BillboardGui.ResetOnSpawn = false
		BillboardGui.Size = UDim2.new(0, 200, 0, 100)
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
		Indicator.AnchorPoint = Vector2.new(0.5, 0.5)
		Indicator.BackgroundColor3 = Color3.fromRGB(255, 0, 0)
		Indicator.BorderMode = Enum.BorderMode.Inset
		Indicator.BorderSizePixel = 0
		Indicator.Position = UDim2.new(0.5, 0, 0.5, 0)
		Indicator.Size = UDim2.new(0, 12, 0, 12)
		Name.BackgroundTransparency = 1
		Name.FontFace = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.Bold)
		Name.Position = UDim2.new(0, 0, 0, 58)
		Name.Size = UDim2.new(1, 0, 0, 14)
		Name.Text = self:id()
		Name.TextColor3 = Color3.fromRGB(255, 0, 0)
		Name.TextSize = 14
		Name.TextStrokeTransparency = 0.5
		Info.BackgroundTransparency = 1
		Info.Font = Enum.Font.Nunito
		Info.Position = UDim2.new(0, 0, 0, 68)
		Info.Size = UDim2.new(1, 0, 0, 14)
		Info.Text = "[∞] studs"
		Info.TextColor3 = Color3.fromRGB(255, 255, 255)
		Info.TextSize = 12
		Info.TextStrokeTransparency = 0.5
		Name.Parent = BillboardGui
		Info.Parent = BillboardGui
		Indicator.Parent = BillboardGui
		BillboardGui.Parent = CoreGui
		bin:add(BillboardGui)
		bin:add(RunService.RenderStepped:Connect(function()
			local position = root.Position
			local active = self.isActive
			if active then
				local _arg0 = AgentController.getPosition()
				local _magnitude = (position - _arg0).Magnitude
				local distance = string.format("%.0f", _magnitude)
				Info.Text = `[{distance}] studs`
			end
			BillboardGui.Enabled = active
		end))
	end
end
local DisplayController
local MutantComponent
do
	local super = EntityComponent
	MutantComponent = setmetatable({}, {
		__tostring = function()
			return "MutantComponent"
		end,
		__index = super,
	})
	MutantComponent.__index = MutantComponent
	function MutantComponent.new(...)
		local self = setmetatable({}, MutantComponent)
		return self:constructor(...) or self
	end
	function MutantComponent:constructor(instance)
		super.constructor(self, instance)
		local _binding = self
		local bin = _binding.bin
		local configs = _binding.configs
		local seekingValue = configs:WaitForChild("Active")
		if not seekingValue then
			error("Entity is missing Active BoolValue!")
		end
		local chasingValue = configs:WaitForChild("Chasing")
		if not chasingValue then
			error("Entity is missing Chasing BoolValue!")
		end
		-- Bindings
		bin:batch(seekingValue.Changed:Connect(function()
			return self:onSeekingState(seekingValue.Value)
		end), chasingValue.Changed:Connect(function()
			return self:onChasingState(chasingValue.Value)
		end))
	end
	function MutantComponent:onActive(state)
		super.onActive(self, state)
		DisplayController.Mutant.setActive(state)
	end
	function MutantComponent:onSeekingState(state)
		DisplayController.Mutant.setSeeking(state)
	end
	function MutantComponent:onChasingState(state)
		DisplayController.Mutant.setChasing(state)
	end
	function MutantComponent:id()
		return "Mutant"
	end
end
local StalkerComponent
do
	local super = EntityComponent
	StalkerComponent = setmetatable({}, {
		__tostring = function()
			return "StalkerComponent"
		end,
		__index = super,
	})
	StalkerComponent.__index = StalkerComponent
	function StalkerComponent.new(...)
		local self = setmetatable({}, StalkerComponent)
		return self:constructor(...) or self
	end
	function StalkerComponent:constructor(instance)
		super.constructor(self, instance)
		local _binding = self
		local bin = _binding.bin
		local configs = _binding.configs
		local seekingValue = configs:WaitForChild("Active")
		if not seekingValue then
			error("Entity is missing Active BoolValue!")
		end
		local stunnedValue = configs:WaitForChild("Stunned")
		if not stunnedValue then
			error("Entity is missing Stunned BoolValue!")
		end
		-- Bindings
		bin:batch(seekingValue.Changed:Connect(function()
			return self:onSeekingState(seekingValue.Value)
		end), stunnedValue.Changed:Connect(function()
			return self:onStunnedState(stunnedValue.Value)
		end))
	end
	function StalkerComponent:onActive(state)
		super.onActive(self, state)
		DisplayController.Stalker.setActive(state)
	end
	function StalkerComponent:onSeekingState(state)
		DisplayController.Stalker.setSeeking(state)
	end
	function StalkerComponent:onStunnedState(state)
		DisplayController.Stalker.setStunned(state)
	end
	function StalkerComponent:id()
		return "Stalker"
	end
end
local WireRatComponent
do
	local super = BaseComponent
	WireRatComponent = setmetatable({}, {
		__tostring = function()
			return "WireRatComponent"
		end,
		__index = super,
	})
	WireRatComponent.__index = WireRatComponent
	function WireRatComponent.new(...)
		local self = setmetatable({}, WireRatComponent)
		return self:constructor(...) or self
	end
	function WireRatComponent:constructor(instance)
		super.constructor(self, instance)
		local root = instance:WaitForChild("RootPart", 5)
		if not root then
			error("Rat is missing its RootPart!")
		end
		local progress = instance:WaitForChild("Progress", 5)
		if not progress then
			error("Rat is missing the Progress state!")
		end
		self.root = root
		self.progress = progress
		self:createVisual()
	end
	function WireRatComponent:createVisual()
		local _binding = self
		local root = _binding.root
		local progress = _binding.progress
		local bin = _binding.bin
		-- Instances:
		local BillboardGui = Instance.new("BillboardGui")
		local Status = Instance.new("TextLabel")
		-- Properties:
		BillboardGui.Adornee = root
		BillboardGui.Enabled = progress.Value > 0
		BillboardGui.AlwaysOnTop = true
		BillboardGui.ResetOnSpawn = false
		BillboardGui.Size = UDim2.new(0, 200, 0, 100)
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
		Status.BackgroundTransparency = 1
		Status.FontFace = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.Bold)
		Status.AnchorPoint = Vector2.new(0.5, 0.5)
		Status.Position = UDim2.new(0.5, 0, 0.5, 0)
		Status.Size = UDim2.new(1, 0, 0, 14)
		Status.Text = `Rat [{progress.Value}]`
		Status.TextColor3 = Color3.fromRGB(255, 0, 0)
		Status.TextSize = 14
		Status.TextStrokeTransparency = 0.5
		Status.Parent = BillboardGui
		BillboardGui.Parent = CoreGui
		bin:add(BillboardGui)
		bin:add(progress.Changed:Connect(function(value)
			BillboardGui.Enabled = value > 0
			Status.Text = `Rat [{value}]`
			Status.TextColor3 = if value > 1 then Color3.fromRGB(255, 0, 0) else Color3.fromRGB(255, 255, 255)
		end))
	end
end
local GridRatComponent
do
	local super = BaseComponent
	GridRatComponent = setmetatable({}, {
		__tostring = function()
			return "GridRatComponent"
		end,
		__index = super,
	})
	GridRatComponent.__index = GridRatComponent
	function GridRatComponent.new(...)
		local self = setmetatable({}, GridRatComponent)
		return self:constructor(...) or self
	end
	function GridRatComponent:constructor(instance)
		super.constructor(self, instance)
		local root = instance:WaitForChild("RootPart", 5)
		if not root then
			error("Rat is missing its RootPart!")
		end
		local controller = instance:WaitForChild("AnimationController", 5)
		if not controller then
			error("Rat is missing the AnimationController!")
		end
		local animator = controller:WaitForChild("Animator", 5)
		self.root = root
		self.animator = animator
		self:createVisual()
	end
	function GridRatComponent:createVisual()
		local _binding = self
		local root = _binding.root
		local animator = _binding.animator
		local bin = _binding.bin
		-- Instances:
		local BillboardGui = Instance.new("BillboardGui")
		local Status = Instance.new("TextLabel")
		-- Properties:
		BillboardGui.Adornee = root
		BillboardGui.Enabled = false
		BillboardGui.AlwaysOnTop = true
		BillboardGui.ResetOnSpawn = false
		BillboardGui.Size = UDim2.new(0, 200, 0, 100)
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
		Status.BackgroundTransparency = 1
		Status.FontFace = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.Bold)
		Status.AnchorPoint = Vector2.new(0.5, 0.5)
		Status.Position = UDim2.new(0.5, 0, 0.5, 0)
		Status.Size = UDim2.new(1, 0, 0, 14)
		Status.Text = "Rat"
		Status.TextColor3 = Color3.fromRGB(255, 0, 0)
		Status.TextSize = 14
		Status.TextStrokeTransparency = 0.5
		Status.Parent = BillboardGui
		BillboardGui.Parent = CoreGui
		bin:add(BillboardGui)
		bin:add(animator.AnimationPlayed:Connect(function(track)
			local anim = track.Animation
			local _name = anim
			if _name ~= nil then
				_name = _name.Name
			end
			local name = _name
			repeat
				local _fallthrough = false
				if name == "GridIdle2" then
					BillboardGui.Enabled = true
					break
				end
				if name == "GridSnatch" then
					_fallthrough = true
				end
				if _fallthrough or name == "GridIdle" then
					_fallthrough = true
				end
				if _fallthrough or name == "GridSnatchBack" then
					BillboardGui.Enabled = false
					break
				end
				print(name)
				break
			until true
		end))
	end
end
--[[
	***********************************************************
	 * CONTROLLERS
	 * Description: Singletons that are used once
	 * Last updated: Feb. 14, 2024
	 ***********************************************************
]]
DisplayController = {}
do
	local _container = DisplayController
	local GameState = ReplicatedStorage:WaitForChild("GameState", 5)
	if not GameState then
		error("GameState not found!")
	end
	local AlarmsDown = GameState:WaitForChild("AlarmsDown", 5)
	if not AlarmsDown then
		error("AlarmsDown not found!")
	end
	local FuelValue = GameState:WaitForChild("Fuel", 5)
	if not FuelValue then
		error("Fuel not found!")
	end
	local MoneyValue = GameState:WaitForChild("Money", 5)
	if not MoneyValue then
		error("Money not found!")
	end
	local window = Library.window()
	local Mutant = {}
	do
		local _container_1 = Mutant
		local mutant = window:section("Mutant")
		local active = mutant:state("Active:")
		local seeking = mutant:state("Seeking:")
		local chasing = mutant:state("Chasing:")
		local function setActive(value)
			active:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "YES" else "NO")
		end
		_container_1.setActive = setActive
		local function setSeeking(value)
			seeking:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "YES" else "NO")
		end
		_container_1.setSeeking = setSeeking
		local function setChasing(value)
			chasing:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "YES" else "NO")
		end
		_container_1.setChasing = setChasing
	end
	_container.Mutant = Mutant
	local Stalker = {}
	do
		local _container_1 = Stalker
		local stalker = window:section("Stalker")
		local active = stalker:state("Active:")
		local seeking = stalker:state("Seeking:")
		local stunned = stalker:state("Stunned:")
		local function setActive(value)
			active:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "YES" else "NO")
		end
		_container_1.setActive = setActive
		local function setSeeking(value)
			seeking:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "YES" else "NO")
		end
		_container_1.setSeeking = setSeeking
		local function setStunned(value)
			stunned:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "YES" else "NO")
		end
		_container_1.setStunned = setStunned
	end
	_container.Stalker = Stalker
	local Factory = {}
	do
		local _container_1 = Factory
		local factory = window:section("Factory")
		local radio = factory:state("Radio:")
		local power = factory:state("Power:")
		local money = factory:state("Money:"):setColor(Color3.new(0, 1, 0))
		local function setRadio(value)
			radio:setColor(if value then Color3.new(1, 0, 0) else Color3.new(1, 1, 1)):setValue(if value then "OFF" else "ON")
		end
		_container_1.setRadio = setRadio
		local function setPower(value)
			local _fn = power
			local _arg0 = (value / 3) * 100
			_fn:setValue(string.format("%.0f%%", _arg0))
		end
		_container_1.setPower = setPower
		local function setMoney(value)
			local _fn = money
			local _value = value
			_fn:setValue(string.format("$%.0f", _value))
		end
		_container_1.setMoney = setMoney
	end
	_container.Factory = Factory
	local function __init()
		Mutant.setActive(false)
		Mutant.setSeeking(false)
		Mutant.setChasing(false)
		Stalker.setActive(false)
		Stalker.setSeeking(false)
		Stalker.setStunned(false)
		Factory.setRadio(AlarmsDown.Value)
		Factory.setPower(FuelValue.Value)
		Factory.setMoney(MoneyValue.Value)
		AlarmsDown.Changed:Connect(function(value)
			return Factory.setRadio(value)
		end)
		FuelValue.Changed:Connect(function(value)
			return Factory.setPower(value)
		end)
		MoneyValue.Changed:Connect(function(value)
			return Factory.setMoney(value)
		end)
	end
	_container.__init = __init
end
AgentController = {}
do
	local _container = AgentController
	local function getPosition()
		return _container.root.Position
	end
	_container.getPosition = getPosition
	local onCharacter = function(character)
		_container.instance = character
		_container.root = character:WaitForChild("HumanoidRootPart")
		local bin = Bin.new()
		local onChild = function(child)
			local name = child.Name
			if FLASHLIGHT_NAMES[name] ~= nil then
				bin:destroy()
				local battery = child:WaitForChild("Battery")
				local value = battery.Value
				battery.Changed:Connect(function()
					battery.Value = value
					return battery.Value
				end)
			end
		end
		bin:add(character.ChildAdded:Connect(onChild))
		for _, child in character:GetChildren() do
			onChild(child)
		end
		local client = _container.instance:WaitForChild("Sprint")
		local stamina = client:WaitForChild("Stam")
		stamina.Changed:Connect(function(value)
			if value <= 1.05 then
				stamina.Value = 1.05
			end
		end)
	end
	local function __init()
		local char = LocalPlayer.Character
		if char then
			onCharacter(char)
		end
		LocalPlayer.CharacterAdded:Connect(onCharacter)
	end
	_container.__init = __init
end
local FuseController = {}
do
	local _container = FuseController
	local FuseBox = Workspace:WaitForChild("FuseBox", 5)
	if not FuseBox then
		error("FuseBox not found!")
	end
	local Wires = FuseBox:WaitForChild("Wires", 5)
	if not Wires then
		error("Wires not found!")
	end
	local onWire = function(wire)
		local sparkles = wire:WaitForChild("Sparkles", 5)
		if not sparkles then
			error("Sparkles not found!")
		end
		local update = function()
			local enabled = sparkles.Enabled
			wire.LocalTransparencyModifier = if enabled then 0 else 1
			local cd = wire:FindFirstChildWhichIsA("ClickDetector")
			if cd then
				cd.MaxActivationDistance = if enabled then 50 else 8
			end
		end
		sparkles:GetPropertyChangedSignal("Enabled"):Connect(update)
		update()
	end
	local onChild = function(child)
		if child:IsA("Part") then
			task.defer(onWire, child)
		end
	end
	local function __init()
		for _, wire in Wires:GetChildren() do
			task.defer(onChild, wire)
		end
		Wires.ChildAdded:Connect(onChild)
	end
	_container.__init = __init
end
local LootableController = {}
do
	local _container = LootableController
	local ItemSpawns = Workspace:WaitForChild("ItemSpots", 5)
	if not ItemSpawns then
		error("ItemSpots folder not found!")
	end
	local onPossibleLoot = function(instance)
		local id = instance.Name
		if LOOTABLE_NAMES[id] ~= nil then
			LootableComponent.new(instance)
		end
	end
	local onItemSpot = function(item)
		item.ChildAdded:Connect(onPossibleLoot)
		for _, child in item:GetChildren() do
			task.defer(onPossibleLoot, child)
		end
	end
	local function __init()
		for _, child in ItemSpawns:GetChildren() do
			task.defer(onItemSpot, child)
		end
		ItemSpawns.ChildAdded:Connect(onItemSpot)
	end
	_container.__init = __init
end
local LightController = {}
do
	local _container = LightController
	local LightFolder = Workspace:WaitForChild("Lights", 5)
	if not LightFolder then
		error("Lights folder not found!")
	end
	local onLight = function(light)
		LightComponent.new(light)
	end
	local function __init()
		for _, child in LightFolder:GetChildren() do
			task.defer(onLight, child)
		end
		LightFolder.ChildAdded:Connect(onLight)
	end
	_container.__init = __init
end
local EntityController = {}
do
	local _container = EntityController
	local onChild = function(parents, name, className, callback)
		local bin = Bin.new()
		for _, parent in parents do
			local onChild = function(child)
				if child.Name == name and child:IsA(className) then
					bin:destroy()
					callback(child)
					return true
				end
				return false
			end
			bin:add(parent.ChildAdded:Connect(onChild))
			task.defer(function()
				for _1, child in parent:GetChildren() do
					if onChild(child) then
						break
					end
				end
			end)
		end
	end
	local function __init()
		onChild({ Workspace, ReplicatedStorage }, "Mutant", "Model", function(mutant)
			MutantComponent.new(mutant)
		end)
		onChild({ Workspace, ReplicatedStorage }, "Stalker", "Model", function(stalker)
			StalkerComponent.new(stalker)
		end)
	end
	_container.__init = __init
end
local RatController = {}
do
	local _container = RatController
	local FloodLights = Workspace:WaitForChild("Floodlights", 5)
	if not FloodLights then
		error("Floodlights folder not found!")
	end
	local Grids = Workspace:WaitForChild("Grids", 5)
	if not Grids then
		error("Grids folder not found!")
	end
	local onPossibleRat = function(instance)
		if instance.Name == "Rat" and instance:IsA("Model") then
			WireRatComponent.new(instance)
		end
	end
	local onGrid = function(grid)
		local rat = grid:WaitForChild("Rat", 5)
		if rat then
			GridRatComponent.new(rat)
		else
			error("Grid Rat not found!")
		end
	end
	local function __init()
		for _, light in FloodLights:GetDescendants() do
			task.defer(onPossibleRat, light)
		end
		FloodLights.DescendantAdded:Connect(onPossibleRat)
		for _, grid in Grids:GetChildren() do
			task.defer(onGrid, grid)
		end
		Grids.ChildAdded:Connect(onGrid)
		for _, child in Workspace:GetChildren() do
			task.defer(onPossibleRat, child)
		end
		Workspace.ChildAdded:Connect(onPossibleRat)
	end
	_container.__init = __init
end
--[[
	***********************************************************
	 * INITIALIZATION
	 * Description: Initializes and starts the runtime
	 * Last updated: Feb. 14, 2024
	 ***********************************************************
]]
DisplayController.__init()
AgentController.__init()
FuseController.__init()
EntityController.__init()
LootableController.__init()
LightController.__init()
RatController.__init()
print("Initialized Successfully")
return "Initialized Successfully"

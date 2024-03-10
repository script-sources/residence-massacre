-- Compiled with roblox-ts v2.3.0
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
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
			ScreenGui.Parent = Players.LocalPlayer:WaitForChild("PlayerGui")
			self.frame = Frame
			self.padding = UIPadding
			self.layout = UIListLayout
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
			self.layout = UIListLayout
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
return {
	Library = Library,
}

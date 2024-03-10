local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local MODELS = {ReplicatedStorage.Mutant, ReplicatedStorage.Stalker}

local LocalPlayer = game.Players.LocalPlayer
local Character = LocalPlayer.Character
local root = Character.HumanoidRootPart

for i, v in ipairs(MODELS) do
    local c = v:Clone()
    local r = c.HumanoidRootPart
    r.Anchored = true
    r.CFrame = root.CFrame * CFrame.new(0, 0, i * 10)
    r.Parent = workspace
end
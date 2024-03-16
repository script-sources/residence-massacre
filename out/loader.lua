-- Compiled with roblox-ts v2.3.0
local ROOT = "https://raw.githubusercontent.com/script-sources/residence-massacre/main/out/"
local SOURCES = {
	[14437001043] = "routes/lobby.lua",
	[14896802601] = "routes/night-1.lua",
	[16667550979] = "routes/night-2.lua",
}
local _binding = game
local GameId = _binding.GameId
local PlaceId = _binding.PlaceId
-- Check if the game is Residence Massacre
if GameId ~= 4987467534 then
	error("[Invalid Game]: Game ID does not match the expected ID for Residence Massacre")
end
-- Load the source by PlaceId
local path = SOURCES[PlaceId]
if path ~= nil then
	loadstring(game:HttpGet(ROOT .. path))()
else
	error("[Invalid Place]: Place ID is not valid for Residence Massacre")
end
return nil

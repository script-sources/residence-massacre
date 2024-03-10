const ROOT = "https://raw.githubusercontent.com/script-sources/residence-massacre/main/out/";
const SOURCES = new Map<number, string>([
	[14437001043, "lobby.lua"],

	// Night 1
	[14896802601, "night-1.lua"],

	// Night 2
	[2, "night-2.lua"],
]);

const { GameId, PlaceId } = game;

// Check if the game is Residence Massacre
if (GameId !== 4987467534) throw "[Invalid Game]: Game ID does not match the expected ID for Residence Massacre";

// Load the source by PlaceId
const path = SOURCES.get(PlaceId);
if (path !== undefined) loadstring(game.HttpGet(ROOT + path))();
else throw "[Invalid Place]: Place ID is not valid for Residence Massacre";

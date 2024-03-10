const ROOT = "https://raw.githubusercontent.com/script-sources/residence-massacre/main/out/";
const SOURCES = new Map<number, string>([
	[1, "night-1.lua"],
	[2, "night-2.lua"],
]);

const { GameId, PlaceId } = game;

// Check if the game is Residence Massacre
if (GameId !== 14437001043) throw "[Invalid Game]: Residence Massacre expected";

// Load the source by PlaceId
const path = SOURCES.get(PlaceId);
if (path !== undefined) loadstring(game.HttpGet(ROOT + path))();
else throw "[Invalid Place]: Night 1 or Night 2 expected";

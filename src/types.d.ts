declare global {
	interface _G {
		"residence-massacre"?: true;
	}
}

export type Node = { next?: Node; item: Destructible };
export type Destructible = (() => unknown) | RBXScriptConnection | thread | { destroy(): void } | { Destroy(): void };

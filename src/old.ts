import { Players, ReplicatedStorage, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";

/*
	------------------------
	Libraries & Dependencies
	------------------------
	All the libraries and dependencies that are used throughout the code.
	
 */
/**
 * Tracks connections, instances, functions, threads, and objects to be later destroyed.
 */
class Bin {
	private head: Node | undefined;
	private tail: Node | undefined;

	/**
	 * Adds an item into the Bin. This can be a:
	 * - `() => unknown`
	 * - RBXScriptConnection
	 * - thread
	 * - Object with `.destroy()` or `.Destroy()`
	 */
	public add<I extends Bin.Item>(item: I) {
		const node: Node = { item };
		this.head ??= node;
		if (this.tail) this.tail.next = node;
		this.tail = node;
		return this;
	}

	/**
	 * Destroys all items currently in the Bin:
	 * - Functions will be called
	 * - RBXScriptConnections will be disconnected
	 * - threads will be `task.cancel()`-ed
	 * - Objects will be `.destroy()`-ed
	 */
	public destroy(): void {
		let head = this.head;
		while (head) {
			const { item } = head;
			if (typeIs(item, "function")) {
				item();
			} else if (typeIs(item, "RBXScriptConnection")) {
				item.Disconnect();
			} else if (typeIs(item, "thread")) {
				task.cancel(item);
			} else if ("destroy" in item) {
				item.destroy();
			} else if ("Destroy" in item) {
				item.Destroy();
			}
			head = head.next;
			this.head = head;
		}
	}

	/**
	 * Checks whether the Bin is empty.
	 */
	public isEmpty(): boolean {
		return this.head === undefined;
	}
}
namespace Bin {
	export type Item = (() => unknown) | RBXScriptConnection | thread | { destroy(): void } | { Destroy(): void };
}
type Node = { next?: Node; item: Bin.Item };

/*
	-------------------
	Constants & Configs
	-------------------
	Contains all the constants and configs that are used throughout the code.

 */
const LOOTABLE_NAMES = new Set(["BloxyCola", "Wrench", "Battery"]);

/*
	----------------------
	Variables & References
	----------------------
	Holds all the variables and references that are used throughout the code.

 */
const LocalPlayer = Players.LocalPlayer;
const PlayerGui = LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const CurrentCamera = Workspace.CurrentCamera!;

// Game Values
const FuelValue = Workspace.WaitForChild("Shack").WaitForChild("Generator").WaitForChild("Fuel") as NumberValue;
const FuseState = ReplicatedStorage.WaitForChild("GameState").WaitForChild("FusesFried") as BoolValue;

// Folders
const ItemSpawns = Workspace.WaitForChild("ItemSpots");

/*
	-------------------
	Functions & Methods
	-------------------
	Contains all the functions and methods that provide specific functionalities used throughout the code.

 */

/*
	---------------------
	Controllers & Systems
	---------------------
	Contains all the controllers and systems that are used to manage and control the code.

 */
class StateDisplay {
	private activeLabel: TextLabel;
	private seekingLabel: TextLabel;
	private chasingLabel: TextLabel;
	private powerLabel: TextLabel;
	private generatorLabel: TextLabel;

	constructor() {
		const [ScreenGui, Frame] = this.initDisplay();

		// Groups:
		const [mutantGroup] = this.initGroup("Mutant");
		const [activeFrame, activeValue] = this.initState("Active: ");
		const [seekingFrame, seekingValue] = this.initState("Seeking: ");
		const [chasingFrame, chasingValue] = this.initState("Chasing: ");

		const [residenceGroup] = this.initGroup("Residence");
		const [powerFrame, powerValue] = this.initState("Power: ");
		const [generatorFrame, generatorValue] = this.initState("Generator: ");

		// Initialize
		this.activeLabel = activeValue;
		this.seekingLabel = seekingValue;
		this.chasingLabel = chasingValue;
		this.powerLabel = powerValue;
		this.generatorLabel = generatorValue;

		activeFrame.Parent = mutantGroup;
		seekingFrame.Parent = mutantGroup;
		chasingFrame.Parent = mutantGroup;
		powerFrame.Parent = residenceGroup;
		generatorFrame.Parent = residenceGroup;
		mutantGroup.Parent = Frame;
		residenceGroup.Parent = Frame;
		ScreenGui.Parent = PlayerGui;
	}

	public setActive(value: boolean) {
		const label = this.activeLabel;
		label.Text = value ? "YES" : "NO";
		label.TextColor3 = value ? new Color3(1, 0, 0) : new Color3(1, 1, 1);
	}

	public setSeeking(value: boolean) {
		const label = this.seekingLabel;
		label.Text = value ? "YES" : "NO";
		label.TextColor3 = value ? new Color3(1, 0, 0) : new Color3(1, 1, 1);
	}

	public setChasing(value: boolean) {
		const label = this.chasingLabel;
		label.Text = value ? "YES" : "NO";
		label.TextColor3 = value ? new Color3(1, 0, 0) : new Color3(1, 1, 1);
	}

	public setPower(value: boolean) {
		const label = this.powerLabel;
		label.Text = value ? "ON" : "OFF";
		label.TextColor3 = value ? new Color3(1, 1, 1) : new Color3(1, 0, 0);
	}

	public setGenerator(value: number) {
		const label = this.generatorLabel;
		label.Text = "%.0f".format(value);
		label.TextColor3 = new Color3(1, 0, 0).Lerp(new Color3(1, 1, 1), value / 100);
	}

	private initDisplay() {
		// Instances
		const ScreenGui = new Instance("ScreenGui");
		const Frame = new Instance("Frame");
		const UIPadding = new Instance("UIPadding");
		const UIListLayout = new Instance("UIListLayout");

		// Properties
		ScreenGui.ResetOnSpawn = false;
		ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		Frame.AnchorPoint = new Vector2(0, 0.5);
		Frame.BackgroundColor3 = new Color3(1, 1, 1);
		Frame.BackgroundTransparency = 0.925;
		Frame.BorderSizePixel = 0;
		Frame.Position = new UDim2(0, 5, 0.5, 0);
		Frame.Size = new UDim2(0, 140, 0, 120);

		UIPadding.PaddingBottom = new UDim(0, 5);
		UIPadding.PaddingLeft = new UDim(0, 5);
		UIPadding.PaddingRight = new UDim(0, 5);
		UIPadding.PaddingTop = new UDim(0, 5);

		UIListLayout.Padding = new UDim(0, 6);

		// Initialize
		const padding = UIPadding.PaddingTop.Offset + UIPadding.PaddingBottom.Offset;
		const onContentSize = UIListLayout.GetPropertyChangedSignal("AbsoluteContentSize");
		onContentSize.Connect(() => (Frame.Size = new UDim2(0, 140, 0, UIListLayout.AbsoluteContentSize.Y + padding)));
		Frame.Size = new UDim2(0, 140, 0, UIListLayout.AbsoluteContentSize.Y + padding);

		const tweenInfo = new TweenInfo(0.08, Enum.EasingStyle.Sine);
		Frame.InputBegan.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.MouseButton1) {
				const initialFramePosition = Frame.Position;
				const initialMousePosition = UserInputService.GetMouseLocation();
				const startX = initialFramePosition.X;
				const startY = initialFramePosition.Y;
				const mouseStart = new Vector2(initialMousePosition.X, initialMousePosition.Y);

				const updater = RunService.RenderStepped.Connect(() => {
					const position = UserInputService.GetMouseLocation();
					const delta = position.sub(mouseStart);
					const newX = startX.Offset + delta.X;
					const newY = startY.Offset + delta.Y;
					TweenService.Create(Frame, tweenInfo, {
						Position: new UDim2(startX.Scale, newX, startY.Scale, newY),
					}).Play();
				});

				const terminator = (input as ChangedSignal).Changed.Connect(() => {
					if (input.UserInputState === Enum.UserInputState.End) {
						terminator.Disconnect();
						updater.Disconnect();
					}
				});
			}
		});

		UIPadding.Parent = Frame;
		UIListLayout.Parent = Frame;
		Frame.Parent = ScreenGui;

		// Return
		return $tuple(ScreenGui, Frame);
	}

	private initGroup(name: string) {
		// Instances
		const Frame = new Instance("Frame");
		const UIListLayout = new Instance("UIListLayout");
		const Header = new Instance("Frame");
		const TextLabel = new Instance("TextLabel");

		// Properties
		Frame.BackgroundTransparency = 1;
		Frame.Size = new UDim2(1, 0, 0, 52);

		UIListLayout.SortOrder = Enum.SortOrder.LayoutOrder;

		Header.BackgroundTransparency = 1;
		Header.Name = "Header";
		Header.Size = new UDim2(1, 0, 0, 18);

		TextLabel.BackgroundTransparency = 1;
		TextLabel.FontFace = new Font("rbxasset://fonts/families/Inconsolata.json", Enum.FontWeight.Bold);
		TextLabel.Size = new UDim2(1, 0, 1, 0);
		TextLabel.Text = name;
		TextLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
		TextLabel.TextSize = 14;
		TextLabel.TextStrokeTransparency = 0.6;
		TextLabel.TextWrapped = true;

		// Initialize
		const onContentSize = UIListLayout.GetPropertyChangedSignal("AbsoluteContentSize");
		onContentSize.Connect(() => (Frame.Size = new UDim2(1, 0, 0, UIListLayout.AbsoluteContentSize.Y)));
		Frame.Size = new UDim2(1, 0, 0, UIListLayout.AbsoluteContentSize.Y);

		UIListLayout.Parent = Frame;
		TextLabel.Parent = Header;
		Header.Parent = Frame;

		// Return
		return $tuple(Frame);
	}

	private initState(label: string) {
		// Instance
		const Entry = new Instance("Frame");
		const Label = new Instance("TextLabel");
		const Value = new Instance("TextLabel");

		// Properties
		Entry.BackgroundTransparency = 1;
		Entry.LayoutOrder = 1;
		Entry.Name = "Entry";
		Entry.Size = new UDim2(1, 0, 0, 16);

		Label.BackgroundTransparency = 1;
		Label.Font = Enum.Font.Code;
		Label.Name = "Label";
		Label.Size = new UDim2(1, 0, 1, 0);
		Label.Text = label;
		Label.TextColor3 = new Color3(1, 1, 1);
		Label.TextSize = 14;
		Label.TextStrokeTransparency = 0.6;
		Label.TextWrapped = true;
		Label.TextXAlignment = Enum.TextXAlignment.Left;

		Value.BackgroundTransparency = 1;
		Value.Font = Enum.Font.Code;
		Value.Name = "Value";
		Value.Size = new UDim2(1, 0, 1, 0);
		Value.Text = "";
		Value.TextColor3 = new Color3(1, 1, 1);
		Value.TextSize = 14;
		Value.TextStrokeTransparency = 0.6;
		Value.TextWrapped = true;
		Value.TextXAlignment = Enum.TextXAlignment.Right;

		// Initialize
		Label.Parent = Entry;
		Value.Parent = Entry;

		// Return
		return $tuple(Entry, Value);
	}
}
const display = new StateDisplay();

/*
	------------------
	Components & Units
	------------------
	Holds all the individual components or units that are modular and reusable throughout the code.

 */
class BaseComponent<I> {
	protected readonly bin = new Bin();
	protected readonly object: I;

	constructor(item: I) {
		this.object = item;
	}

	public destroy() {
		this.bin.destroy();
	}
}

class AvatarComponent extends BaseComponent<Model> {
	private readonly root: BasePart;

	constructor(avatar: Model) {
		super(avatar);
		this.root = avatar.WaitForChild("HumanoidRootPart") as BasePart;

		// init light:
		this.initLight();

		// init stamina:
		this.initStamina();

		// init flashlight:
		this.initFlashlight();
	}

	private initLight() {
		const { root, bin } = this;
		const pointlight = new Instance("PointLight");
		pointlight.Color = new Color3(1, 1, 1);
		pointlight.Range = 60;
		pointlight.Brightness = 0.25;
		pointlight.Parent = root;
		bin.add(pointlight);
	}

	private initStamina() {
		const client = this.object.WaitForChild("Sprint") as Script;
		const stamina = client.WaitForChild("Stam") as NumberValue;
		stamina.Changed.Connect((value) => {
			if (value < 1.05) stamina.Value = 1.05;
		});
	}

	private initFlashlight() {
		const { object, bin } = this;

		const onChild = (child: Instance) => {
			const name = child.Name;
			if (name === "Flashlight" || name === "BetterFlashlight") this.onFlashlight(child as Model);
		};

		bin.add(object.ChildAdded.Connect(onChild));
		const _children = object.GetChildren();
		for (const i of $range(0, _children.size() - 1)) onChild(_children[i]);
	}

	private onFlashlight(flashlight: Model) {
		const battery = flashlight.WaitForChild("Battery") as NumberValue;
		const value = battery.Value;
		this.bin.add(battery.Changed.Connect(() => (battery.Value = value)));
	}
}

class SwitchComponent extends BaseComponent<Model> {
	private readonly light: Model;
	private readonly switch: Model;
	private readonly statuses: Configuration;
	private readonly detector: Part;

	constructor(item: Model) {
		super(item);
		this.light = item.WaitForChild("Lamp") as Model;
		this.switch = item.WaitForChild("Switch") as Model;
		this.statuses = item.WaitForChild("Status") as Configuration;
		this.detector = this.switch.WaitForChild("Detector") as Part;

		// init UI:
		this.initUI();
	}

	private initUI() {
		const { detector: root, bin } = this;

		// Instances
		const billboardGui = new Instance("BillboardGui");
		const indicator = new Instance("Frame");

		// Properties
		billboardGui.AlwaysOnTop = true;
		billboardGui.Size = new UDim2(0, 10, 0, 10);
		billboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		indicator.AnchorPoint = new Vector2(0.5, 0.5);
		indicator.BackgroundColor3 = new Color3(1, 1, 1);
		indicator.BackgroundTransparency = 0.2;
		indicator.BorderSizePixel = 0;
		indicator.Position = new UDim2(0.5, 0, 0.5, 0);
		indicator.Rotation = 45;
		indicator.Size = new UDim2(0, 2, 0, 2);

		// Initialization
		indicator.Parent = billboardGui;
		billboardGui.Parent = root;

		bin.add(billboardGui);
	}
}

class LootableComponent extends BaseComponent<Instance> {
	private readonly label: string;
	private readonly root: Part;

	constructor(label: string, item: Instance, root: Part) {
		super(item);
		this.label = label;
		this.root = root;

		// init UI:
		this.initUI();
	}

	private initUI() {
		const { root, bin } = this;

		// Instances
		const billboardGui = new Instance("BillboardGui");
		const container = new Instance("Frame");
		const name = new Instance("TextLabel");
		const list = new Instance("UIListLayout");
		const indicator = new Instance("Frame");

		// Properties
		billboardGui.AlwaysOnTop = true;
		billboardGui.Size = new UDim2(0, 400, 0, 60);
		billboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		container.AnchorPoint = new Vector2(0.5, 0);
		container.BackgroundTransparency = 1;
		container.Position = new UDim2(0.5, 0, 0.5, 3);

		name.BackgroundTransparency = 1;
		name.Font = Enum.Font.Nunito;
		name.Text = this.label;
		name.TextColor3 = new Color3(1, 1, 1);
		name.TextSize = 12;
		name.TextStrokeTransparency = 0.5;

		list.HorizontalAlignment = Enum.HorizontalAlignment.Center;
		list.Padding = new UDim(0, -3);
		list.SortOrder = Enum.SortOrder.LayoutOrder;

		indicator.AnchorPoint = new Vector2(0.5, 0.5);
		indicator.BackgroundColor3 = new Color3(1, 1, 1);
		indicator.BorderSizePixel = 0;
		indicator.Position = new UDim2(0.5, 0, 0.5, 0);
		indicator.Rotation = 45;
		indicator.Size = new UDim2(0, 6, 0, 6);

		// Initialization
		name.Size = new UDim2(1, 0, 0, name.TextBounds.Y);
		container.Size = new UDim2(1, 0, 0, list.AbsoluteContentSize.Y);

		name.Parent = container;
		list.Parent = container;
		container.Parent = billboardGui;
		indicator.Parent = billboardGui;
		billboardGui.Parent = root;

		bin.add(billboardGui);
		bin.add(
			name
				.GetPropertyChangedSignal("TextBounds")
				.Connect(() => (name.Size = new UDim2(1, 0, 0, name.TextBounds.Y))),
		);
		bin.add(
			list
				.GetPropertyChangedSignal("AbsoluteContentSize")
				.Connect(() => (container.Size = new UDim2(1, 0, 0, list.AbsoluteContentSize.Y))),
		);
	}
}

class MutantComponent extends BaseComponent<Model> {
	private readonly root: Part;

	private isActive = false;
	private isSeeking = false;
	private isChasing = false;

	constructor(rig: Model) {
		super(rig);
		this.root = rig.WaitForChild("HumanoidRootPart") as Part;

		// init configs:
		this.initConfigs();

		// init UI:
		this.initUI();
	}

	private initConfigs() {
		const root = this.root;
		const configs = this.object.WaitForChild("Config") as Folder;
		const seekingValue = configs.WaitForChild("Active") as BoolValue;
		const chasingValue = configs.WaitForChild("Chasing") as BoolValue;

		// Update Properties:
		this.isActive = root.Position.Y > -60;
		this.isSeeking = seekingValue.Value;
		this.isChasing = chasingValue.Value;
		display.setActive(this.isActive);
		display.setSeeking(this.isSeeking);
		display.setChasing(this.isChasing);

		// Listen to changes:
		root.GetPropertyChangedSignal("Position").Connect(() => {
			const active = root.Position.Y > -60;
			if (active === this.isActive) return;
			this.isActive = root.Position.Y > -60;
			display.setActive(this.isActive);
		});
		seekingValue.Changed.Connect((value) => {
			this.isSeeking = value;
			display.setSeeking(value);
		});
		chasingValue.Changed.Connect((value) => {
			this.isChasing = value;
			display.setChasing(value);
		});
	}

	private initUI() {
		const { root, bin } = this;

		// Instances
		const billboardGui = new Instance("BillboardGui");
		const container = new Instance("Frame");
		const name = new Instance("TextLabel");
		const data = new Instance("TextLabel");
		const list = new Instance("UIListLayout");
		const indicator = new Instance("Frame");

		// Properties
		billboardGui.AlwaysOnTop = true;
		billboardGui.Size = new UDim2(0, 400, 0, 60);
		billboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		container.AnchorPoint = new Vector2(0.5, 0);
		container.BackgroundTransparency = 1;
		container.Position = new UDim2(0.5, 0, 0.5, 8);

		name.BackgroundTransparency = 1;
		name.Font = Enum.Font.Nunito;
		name.Text = "Mutant";
		name.TextColor3 = new Color3(1, 0, 0);
		name.TextSize = 14;
		name.TextStrokeTransparency = 0.5;

		data.BackgroundTransparency = 1;
		data.Font = Enum.Font.Nunito;
		data.Text = "[DISTANCE]";
		data.TextColor3 = new Color3(1, 1, 1);
		data.TextSize = 12;
		data.TextStrokeTransparency = 0.5;

		list.HorizontalAlignment = Enum.HorizontalAlignment.Center;
		list.Padding = new UDim(0, -3);
		list.SortOrder = Enum.SortOrder.LayoutOrder;

		indicator.AnchorPoint = new Vector2(0.5, 0.5);
		indicator.BackgroundColor3 = new Color3(1, 0, 0);
		indicator.BorderSizePixel = 0;
		indicator.Position = new UDim2(0.5, 0, 0.5, 0);
		indicator.Rotation = 45;
		indicator.Size = new UDim2(0, 12, 0, 12);

		// Initialization
		name.Size = new UDim2(1, 0, 0, name.TextBounds.Y);
		data.Size = new UDim2(1, 0, 0, data.TextBounds.Y);
		container.Size = new UDim2(1, 0, 0, list.AbsoluteContentSize.Y);

		name.Parent = container;
		data.Parent = container;
		list.Parent = container;
		container.Parent = billboardGui;
		indicator.Parent = billboardGui;
		billboardGui.Parent = root;

		bin.add(billboardGui);
		bin.add(
			name
				.GetPropertyChangedSignal("TextBounds")
				.Connect(() => (name.Size = new UDim2(1, 0, 0, name.TextBounds.Y))),
		);
		bin.add(
			data
				.GetPropertyChangedSignal("TextBounds")
				.Connect(() => (data.Size = new UDim2(1, 0, 0, data.TextBounds.Y))),
		);
		bin.add(
			list
				.GetPropertyChangedSignal("AbsoluteContentSize")
				.Connect(() => (container.Size = new UDim2(1, 0, 0, list.AbsoluteContentSize.Y))),
		);
		bin.add(
			RunService.RenderStepped.Connect(() => {
				const position = root.Position;
				const shouldShow = position.Y > -60;
				if (shouldShow) {
					const distance = "%.1f".format(position.sub(CurrentCamera.CFrame.Position).Magnitude);
					data.Text = `[${distance}] studs`;
				}
				billboardGui.Enabled = shouldShow;
			}),
		);
	}
}

/*
	----------------
	Event Listeners
	----------------
	Manages all the functions that are triggered in response to various events throughout the code.

 */

// Runs on changes to fuel value:
const onFuelChanged = (value: number) => display.setGenerator(value);
onFuelChanged(FuelValue.Value);
FuelValue.Changed.Connect(onFuelChanged);

// Runs when the Fuse gets fried or replaced:
const onFuseStateChanged = (value: boolean) => display.setPower(!value);
onFuseStateChanged(FuseState.Value);
FuseState.Changed.Connect(onFuseStateChanged);

// Runs on the lights in the map
const onLight = (light: Instance) => {
	new SwitchComponent(light as Model);
};
const LightFolder = Workspace.WaitForChild("Lights");
LightFolder.ChildAdded.Connect(onLight);
const _lightFolderChildren = LightFolder.GetChildren();
for (const i of $range(0, _lightFolderChildren.size() - 1)) task.spawn(onLight, _lightFolderChildren[i]);

// Runs on every possible loot item:
const onPossibleLoot = (instance: Instance) => {
	const id = instance.Name;
	if (LOOTABLE_NAMES.has(id)) {
		const root = instance.WaitForChild("Handle", 10) as Part;
		new LootableComponent(id, instance, root);
	}
};

const onItemSpot = (item: Instance) => {
	item.ChildAdded.Connect(onPossibleLoot);
	const _itemChildren = item.GetChildren();
	for (const i of $range(0, _itemChildren.size() - 1)) task.spawn(onPossibleLoot, _itemChildren[i]);
};

ItemSpawns.ChildAdded.Connect(onItemSpot);
const _itemSpawnsChildren = ItemSpawns.GetChildren();
for (const i of $range(0, _itemSpawnsChildren.size() - 1)) task.spawn(onItemSpot, _itemSpawnsChildren[i]);

// Runs on every child added to the workspace:
const onWorkspaceChildAdded = (child: Instance) => {
	if (child.IsA("Model") && child.Name === "Mutant") {
		new MutantComponent(child);
	}
};

Workspace.ChildAdded.Connect(onWorkspaceChildAdded);
const _workspaceChildren = Workspace.GetChildren();
for (const i of $range(0, _workspaceChildren.size() - 1)) task.spawn(onWorkspaceChildAdded, _workspaceChildren[i]);

// Runs on the LocalPlayer's character:
const onCharacterAdded = (character: Model) => {
	new AvatarComponent(character);
};

LocalPlayer.CharacterAdded.Connect(onCharacterAdded);
const _lchar = LocalPlayer.Character;
if (_lchar) task.spawn(onCharacterAdded, _lchar);

/*
	----------------------
	Initiation & Execution
	----------------------
	All the code that is executed on startup is placed here.

 */

export = 0;
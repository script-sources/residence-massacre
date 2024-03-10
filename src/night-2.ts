import {
	CoreGui,
	Players,
	ReplicatedStorage,
	RunService,
	TweenService,
	UserInputService,
	Workspace,
} from "@rbxts/services";
import { Destructible, Node } from "types";

if (_G["program id"]) throw "This program is already running!";
_G["program id"] = true;

/************************************************************
 * CONFIGURATIONS
 * Description: User-defined settings and configurations
 * Last updated: Feb. 14, 2024
 ************************************************************/
const LOOTABLE_NAMES = new Set(["BloxyCola", "Wrench", "Battery"]);
const FLASHLIGHT_NAMES = new Set(["Flashlight", "BetterFlashlight"]);

/************************************************************
 * VARIABLES
 * Description: Variables referenced globally in the script
 * Last updated: Feb. 14, 2024
 ************************************************************/
const LocalPlayer = Players.LocalPlayer;

/************************************************************
 * UTILITIES
 * Description: Helper functions and classes
 * Last updated: Feb. 14, 2024
 ************************************************************/
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
	public add<T extends Destructible>(item: T): T {
		const node: Node = { item };
		this.head ??= node;
		if (this.tail) this.tail.next = node;
		this.tail = node;
		return item;
	}

	/**
	 * Adds multiple items into the Bin. This can be a:
	 * - `() => unknown`
	 * - RBXScriptConnection
	 * - thread
	 * - Object with `.destroy()` or `.Destroy()`
	 */
	public batch<T extends Destructible[]>(...args: T): T {
		for (const item of args) {
			const node: Node = { item };
			this.head ??= node;
			if (this.tail) this.tail.next = node;
			this.tail = node;
		}
		return args;
	}

	/**
	 * Destroys all items currently in the Bin:
	 * - Functions will be called
	 * - RBXScriptConnections will be disconnected
	 * - threads will be `task.cancel()`-ed
	 * - Objects will be `.destroy()`-ed
	 */
	public destroy(): void {
		while (this.head) {
			const item = this.head.item;
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
			this.head = this.head.next;
		}
	}

	/**
	 * Checks whether the Bin is empty.
	 */
	public isEmpty(): boolean {
		return this.head === undefined;
	}
}

const Library = (() => {
	class Window {
		private frame: Frame;
		private padding: UIPadding;
		private layout: UIListLayout;

		constructor() {
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
			onContentSize.Connect(
				() => (Frame.Size = new UDim2(0, 140, 0, UIListLayout.AbsoluteContentSize.Y + padding)),
			);
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
			ScreenGui.Parent = Players.LocalPlayer.WaitForChild("PlayerGui")!;

			this.frame = Frame;
			this.padding = UIPadding;
			this.layout = UIListLayout;
		}

		public section(name: string) {
			return new Section(name, this.frame);
		}
	}

	class Section {
		private frame: Frame;
		private layout: UIListLayout;

		constructor(name: string, parent: Frame) {
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
			Frame.Parent = parent;

			this.frame = Frame;
			this.layout = UIListLayout;
		}

		public label(text: string) {
			return new Label(text, this.frame);
		}

		public state(label: string) {
			return new State(label, this.frame);
		}
	}

	class Label {
		private label: TextLabel;

		constructor(label: string, parent: Frame) {
			// Instance
			const TextLabel = new Instance("TextLabel");

			// Properties
			TextLabel.BackgroundTransparency = 1;
			TextLabel.Font = Enum.Font.Code;
			TextLabel.Name = "Label";
			TextLabel.Size = new UDim2(1, 0, 0, 16);
			TextLabel.Text = label;
			TextLabel.TextColor3 = new Color3(1, 1, 1);
			TextLabel.TextSize = 14;
			TextLabel.TextStrokeTransparency = 0.6;
			TextLabel.TextWrapped = true;
			TextLabel.TextXAlignment = Enum.TextXAlignment.Left;

			// Initialize
			TextLabel.Parent = parent;

			this.label = TextLabel;
		}

		public setLabel(label: string) {
			this.label.Text = label;
			return this;
		}
	}

	class State {
		private label: TextLabel;
		private value: TextLabel;

		constructor(label: string, parent: Frame) {
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
			Entry.Parent = parent;

			this.label = Label;
			this.value = Value;
		}

		public setLabel(text: string) {
			this.label.Text = text;
			return this;
		}

		public setValue(value: string) {
			this.value.Text = value;
			return this;
		}

		public setColor(color: Color3) {
			this.value.TextColor3 = color;
			return this;
		}
	}

	return {
		window: () => new Window(),
	};
})();

/************************************************************
 * COMPONENTS
 * Description: Classes for specific entities/objects
 * Last updated: Feb. 14, 2024
 ************************************************************/
class BaseComponent<T extends Instance> {
	protected bin = new Bin();

	constructor(protected readonly instance: T) {}

	/**
	 * Terminates the component and all functionality.
	 */
	public destroy(): void {
		this.bin.destroy();
	}
}

class LootableComponent extends BaseComponent<Instance> {
	private readonly label: string;
	private readonly root: Part;

	constructor(instance: Instance) {
		super(instance);
		this.label = instance.Name;
		this.root = instance.WaitForChild("Handle", 10) as Part;

		// Initialize:
		this.createVisual();
	}

	private createVisual() {
		const { label, root, bin } = this;

		// Instances:
		const BillboardGui = new Instance("BillboardGui");
		const Indicator = new Instance("Frame");
		const Name = new Instance("TextLabel");

		// Properties:
		BillboardGui.Adornee = root;
		BillboardGui.AlwaysOnTop = true;
		BillboardGui.ResetOnSpawn = false;
		BillboardGui.Size = new UDim2(0, 100, 0, 100);
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		Indicator.AnchorPoint = new Vector2(0.5, 0.5);
		Indicator.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
		Indicator.BorderSizePixel = 0;
		Indicator.Position = new UDim2(0.5, 0, 0.5, 0);
		Indicator.Size = new UDim2(0, 8, 0, 8);

		Name.BackgroundTransparency = 1;
		Name.Font = Enum.Font.Nunito;
		Name.Position = new UDim2(0, 0, 0, 55);
		Name.Size = new UDim2(1, 0, 0, 12);
		Name.Text = label;
		Name.TextColor3 = Color3.fromRGB(255, 255, 255);
		Name.TextSize = 12;
		Name.TextStrokeTransparency = 0.5;

		// Initialize:
		Name.Parent = BillboardGui;
		Indicator.Parent = BillboardGui;
		BillboardGui.Parent = CoreGui;

		bin.add(BillboardGui);
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
		this.createVisual();
	}

	private createVisual() {
		const { detector: root, bin } = this;

		// Instances:
		const BillboardGui = new Instance("BillboardGui");
		const Frame = new Instance("Frame");

		// Properties:
		BillboardGui.Adornee = root;
		BillboardGui.AlwaysOnTop = true;
		BillboardGui.ResetOnSpawn = false;
		BillboardGui.Size = new UDim2(0.25, 0, 0.25, 0);
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		Frame.AnchorPoint = new Vector2(0.5, 0.5);
		Frame.BackgroundColor3 = Color3.fromRGB(255, 255, 150);
		Frame.BorderSizePixel = 0;
		Frame.Position = new UDim2(0.5, 0, 0.5, 0);
		Frame.Size = new UDim2(1, 0, 1, 0);

		// Initialize:
		Frame.Parent = BillboardGui;
		BillboardGui.Parent = CoreGui;

		bin.add(BillboardGui);
	}
}

class EntityComponent extends BaseComponent<Model> {
	public readonly root: BasePart;

	public id() {
		return "Entity";
	}

	private isActive = false;

	constructor(instance: Model) {
		super(instance);

		const { bin } = this;
		const root = instance.WaitForChild("HumanoidRootPart", 5) as BasePart | undefined;
		if (!root) throw "Entity is missing a HumanoidRootPart!";

		this.root = root;

		// Initialize
		const configs = instance.WaitForChild("Config", 5) as Folder;
		if (!configs) throw "Entity is missing Config folder!";
		const seekingValue = configs.WaitForChild("Active") as BoolValue;
		if (!seekingValue) throw "Entity is missing Active BoolValue!";
		const chasingValue = configs.WaitForChild("Chasing") as BoolValue;
		if (!chasingValue) throw "Entity is missing Chasing BoolValue!";

		this.createVisual();

		// Bindings
		bin.batch(
			root.GetPropertyChangedSignal("Position").Connect(() => {
				const active = root.Position.Y > -60;
				if (active === this.isActive) return;
				this.isActive = root.Position.Y > -60;
				DisplayController.setActive(this.isActive);
			}),
			seekingValue.Changed.Connect((value) => DisplayController.setSeeking(value)),
			chasingValue.Changed.Connect((value) => DisplayController.setChasing(value)),
		);
	}

	protected createVisual() {
		const { root, bin } = this;

		// Instances:
		const BillboardGui = new Instance("BillboardGui");
		const Indicator = new Instance("Frame");
		const Name = new Instance("TextLabel");
		const Info = new Instance("TextLabel");

		// Properties:
		BillboardGui.Adornee = root;
		BillboardGui.AlwaysOnTop = true;
		BillboardGui.ResetOnSpawn = false;
		BillboardGui.Size = new UDim2(0, 200, 0, 100);
		BillboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

		Indicator.AnchorPoint = new Vector2(0.5, 0.5);
		Indicator.BackgroundColor3 = Color3.fromRGB(255, 0, 0);
		Indicator.BorderMode = Enum.BorderMode.Inset;
		Indicator.BorderSizePixel = 0;
		Indicator.Position = new UDim2(0.5, 0, 0.5, 0);
		Indicator.Size = new UDim2(0, 12, 0, 12);

		Name.BackgroundTransparency = 1;
		Name.FontFace = new Font("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.Bold);
		Name.Position = new UDim2(0, 0, 0, 58);
		Name.Size = new UDim2(1, 0, 0, 14);
		Name.Text = this.id();
		Name.TextColor3 = Color3.fromRGB(255, 0, 0);
		Name.TextSize = 14;
		Name.TextStrokeTransparency = 0.5;

		Info.BackgroundTransparency = 1;
		Info.Font = Enum.Font.Nunito;
		Info.Position = new UDim2(0, 0, 0, 68);
		Info.Size = new UDim2(1, 0, 0, 14);
		Info.Text = "[∞] studs";
		Info.TextColor3 = Color3.fromRGB(255, 255, 255);
		Info.TextSize = 12;
		Info.TextStrokeTransparency = 0.5;

		Name.Parent = BillboardGui;
		Info.Parent = BillboardGui;
		Indicator.Parent = BillboardGui;
		BillboardGui.Parent = CoreGui;

		bin.add(BillboardGui);
		bin.add(
			RunService.RenderStepped.Connect(() => {
				const position = root.Position;
				const active = this.isActive;
				if (active) {
					const distance = "%.0f".format(position.sub(AgentController.getPosition()).Magnitude);
					Info.Text = `[${distance}] studs`;
				}
				BillboardGui.Enabled = active;
			}),
		);
	}
}

class MutantComponent extends EntityComponent {
	constructor(instance: Model) {
		super(instance);
	}

	public id(): string {
		return "Mutant";
	}
}

class StalkerComponent extends EntityComponent {
	constructor(instance: Model) {
		super(instance);
	}

	public id(): string {
		return "Stalker";
	}
}

/************************************************************
 * CONTROLLERS
 * Description: Singletons that are used once
 * Last updated: Feb. 14, 2024
 ************************************************************/
namespace DisplayController {
	const FuelValue = Workspace.WaitForChild("Shack").WaitForChild("Generator").WaitForChild("Fuel") as NumberValue;
	const FuseState = ReplicatedStorage.WaitForChild("GameState").WaitForChild("FusesFried") as BoolValue;

	const window = Library.window();
	const mutant = window.section("Mutant");
	const active = mutant.state("Active:");
	const seeking = mutant.state("Seeking:");
	const chasing = mutant.state("Chasing:");

	const residence = window.section("Residence");
	const power = residence.state("Power:");
	const generator = residence.state("Generator:");

	export function setActive(value: boolean) {
		active.setColor(value ? new Color3(1, 0, 0) : new Color3(1, 1, 1)).setValue(value ? "YES" : "NO");
	}

	export function setSeeking(value: boolean) {
		seeking.setColor(value ? new Color3(1, 0, 0) : new Color3(1, 1, 1)).setValue(value ? "YES" : "NO");
	}

	export function setChasing(value: boolean) {
		chasing.setColor(value ? new Color3(1, 0, 0) : new Color3(1, 1, 1)).setValue(value ? "YES" : "NO");
	}

	export function setPower(value: boolean) {
		power.setColor(value ? new Color3(1, 1, 1) : new Color3(1, 0, 0)).setValue(value ? "ON" : "OFF");
	}

	export function setGenerator(value: number) {
		generator.setColor(new Color3(1, 0, 0).Lerp(new Color3(1, 1, 1), value / 100)).setValue("%.0f".format(value));
	}

	export function __init() {
		setActive(false);
		setSeeking(false);
		setChasing(false);

		setPower(!FuseState.Value);
		setGenerator(FuelValue.Value);

		FuseState.Changed.Connect(() => setPower(!FuseState.Value));
		FuelValue.Changed.Connect(() => setGenerator(FuelValue.Value));
	}
}

namespace AgentController {
	export let instance: Model;
	export let root: BasePart;

	export function getPosition() {
		return root.Position;
	}

	const onCharacter = (character: Model) => {
		instance = character;
		root = character.WaitForChild("HumanoidRootPart") as BasePart;

		const client = instance.WaitForChild("Sprint") as Script;
		const stamina = client.WaitForChild("Stam") as NumberValue;
		stamina.Changed.Connect((value) => {
			if (value <= 1.05) stamina.Value = 1.05;
		});

		const bin = new Bin();
		const onChild = (child: Instance) => {
			const name = child.Name;
			if (FLASHLIGHT_NAMES.has(name)) {
				bin.destroy();
				const battery = child.WaitForChild("Battery") as NumberValue;
				const value = battery.Value;
				battery.Changed.Connect(() => (battery.Value = value));
			}
		};
		bin.add(character.ChildAdded.Connect(onChild));
		for (const child of character.GetChildren()) onChild(child);
	};

	export function __init() {
		const char = LocalPlayer.Character;
		if (char) onCharacter(char);

		LocalPlayer.CharacterAdded.Connect(onCharacter);
	}
}

namespace EntityController {
	export function __init() {
		const mutant = ReplicatedStorage.WaitForChild("Mutant") as Model | undefined;
		const stalker = ReplicatedStorage.WaitForChild("Stalker") as Model | undefined;
		if (mutant) new MutantComponent(mutant);
		if (stalker) new StalkerComponent(stalker);
		if (!mutant && !stalker) throw "No entities found!";
		if (!mutant) throw "No Mutant found!";
		if (!stalker) throw "No Stalker found!";
	}
}

namespace LootableController {
	const ItemSpawns = Workspace.WaitForChild("ItemSpots");

	const onPossibleLoot = (instance: Instance) => {
		const id = instance.Name;
		if (LOOTABLE_NAMES.has(id)) new LootableComponent(instance);
	};

	const onItemSpot = (item: Instance) => {
		item.ChildAdded.Connect(onPossibleLoot);
		for (const child of item.GetChildren()) task.defer(onPossibleLoot, child);
	};

	export function __init() {
		for (const child of ItemSpawns.GetChildren()) task.defer(onItemSpot, child);
		ItemSpawns.ChildAdded.Connect(onItemSpot);
	}
}

namespace SwitchController {
	const LightFolder = Workspace.WaitForChild("Lights");

	const onLight = (light: Instance) => {
		new SwitchComponent(light as Model);
	};

	export function __init() {
		for (const child of LightFolder.GetChildren()) task.defer(onLight, child);
		LightFolder.ChildAdded.Connect(onLight);
	}
}

/************************************************************
 * INITIALIZATION
 * Description: Initializes and starts the runtime
 * Last updated: Feb. 14, 2024
 ************************************************************/
DisplayController.__init();
AgentController.__init();
EntityController.__init();
LootableController.__init();
SwitchController.__init();

export = "Initialized Successfully";

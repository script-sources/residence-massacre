import { CoreGui, RunService, TweenService, UserInputService } from "@rbxts/services";

const Library = (() => {
	class Window {
		private frame: Frame;

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
			ScreenGui.Parent = CoreGui;

			this.frame = Frame;
		}

		public section(name: string) {
			return new Section(name, this.frame);
		}
	}

	class Section {
		private frame: Frame;

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

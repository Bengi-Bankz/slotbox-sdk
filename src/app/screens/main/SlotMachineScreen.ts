import { FancyButton } from "@pixi/ui";
import {
  BlurFilter,
  Color,
  Container,
  FillGradient,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from "pixi.js";

import { engine } from "../../getEngine";

interface Reel {
  container: Container;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter;
  [key: string]: any; // Index signature for tweening
}

interface Tween {
  object: { [key: string]: number };
  property: string;
  propertyBeginValue: number;
  target: number;
  easing: (t: number) => number;
  time: number;
  change?: (tween: Tween) => void;
  complete?: (tween: Tween) => void;
  start: number;
}

/** The slot machine screen */
export class SlotMachineScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  public mainContainer: Container;
  private spinButton!: FancyButton;
  private reels: Reel[] = [];
  private reelContainer!: Container;
  private running = false;
  private tweening: Tween[] = [];

  // Slot configuration for 5x5 grid
  private reelWidth = 120;
  private symbolSize = 100;
  private readonly REELS_COUNT = 5;
  private readonly SYMBOLS_PER_REEL = 5;
  private scaleFactor = 1;

  // Slot symbols - using placeholder textures for now
  private slotTextures: Texture[] = [];

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);

    this.calculateScale();
    this.initSlotTextures();
    this.createSlotMachine();
    this.createUI();

    // Add viewport boundary indicator for debugging
    this.addViewportBoundary();
  }

  private calculateScale(): void {
    const screenWidth = engine().screen.width;
    const screenHeight = engine().screen.height;

    // Base sizes for 5x5 grid
    const baseReelWidth = 120;
    const baseSymbolSize = 70; // Smaller symbols

    // Calculate required space for 5x5 grid
    const requiredWidth = baseReelWidth * this.REELS_COUNT;
    const requiredHeight = baseSymbolSize * this.SYMBOLS_PER_REEL;

    // Determine device type and orientation
    const isLandscape = screenWidth > screenHeight;
    const isMobile = Math.min(screenWidth, screenHeight) < 768;

    console.log(
      `Scale calculation - Screen: ${screenWidth}x${screenHeight}, Mobile: ${isMobile}, Landscape: ${isLandscape}`,
    );
    console.log(
      `Min dimension: ${Math.min(screenWidth, screenHeight)}, Mobile threshold: 768`,
    );

    // Mobile portrait is the most challenging - prioritize fitting the grid
    if (isMobile && !isLandscape) {
      // Mobile portrait: make grid fit with padding and space for button below
      const horizontalPadding = 10;
      const verticalPadding = 40;
      const buttonSpaceHeight = 80; // Reserve space for button below

      const availableWidth = screenWidth - horizontalPadding * 2;
      const availableHeight =
        screenHeight - verticalPadding * 2 - buttonSpaceHeight;

      // For mobile portrait, use width as primary constraint
      // Make symbols smaller but ensure 5x5 grid fits
      const maxSymbolWidth = availableWidth / this.REELS_COUNT - 2; // -2 for small gaps
      const maxSymbolHeight = availableHeight / this.SYMBOLS_PER_REEL - 2;

      // Scale based on the smaller dimension
      const symbolScale = Math.min(
        maxSymbolWidth / baseSymbolSize,
        maxSymbolHeight / baseSymbolSize,
      );

      // Ensure minimum usability
      this.scaleFactor = Math.max(0.35, Math.min(symbolScale, 0.8));

      // Adjust reel width to be slightly larger than symbol for better spacing
      this.reelWidth = this.scaleFactor * baseSymbolSize + 8; // More spacing between symbols
      this.symbolSize = baseSymbolSize * this.scaleFactor;

      console.log(
        `Mobile Portrait - Symbol Scale: ${symbolScale}, Final: ${this.scaleFactor}, Reel Width: ${this.reelWidth}`,
      );
    } else if (isMobile && isLandscape) {
      // Mobile landscape: height is constrained, need space for button on right
      const horizontalPadding = 20;
      const verticalPadding = 30;
      const buttonSpaceWidth = 150; // Reserve space for button on right

      const availableWidth =
        screenWidth - horizontalPadding * 2 - buttonSpaceWidth;
      const availableHeight = screenHeight - verticalPadding * 2;

      const widthScale = availableWidth / requiredWidth;
      const heightScale = availableHeight / requiredHeight;

      this.scaleFactor = Math.max(0.4, Math.min(widthScale, heightScale, 0.9));

      // Apply scale to dimensions
      this.reelWidth = baseReelWidth * this.scaleFactor;
      this.symbolSize = baseSymbolSize * this.scaleFactor;

      console.log(
        `Mobile Landscape - Width Scale: ${widthScale}, Height Scale: ${heightScale}, Final: ${this.scaleFactor}`,
      );
    } else {
      // Desktop: generous padding, need space for button on right
      const horizontalPadding = 80;
      const verticalPadding = 120;
      const buttonSpaceWidth = 250; // Reserve space for button on right

      const availableWidth =
        screenWidth - horizontalPadding * 2 - buttonSpaceWidth;
      const availableHeight = screenHeight - verticalPadding * 2;

      const widthScale = availableWidth / requiredWidth;
      const heightScale = availableHeight / requiredHeight;

      this.scaleFactor = Math.min(widthScale, heightScale, 1.2);

      // Apply scale to dimensions
      this.reelWidth = baseReelWidth * this.scaleFactor;
      this.symbolSize = baseSymbolSize * this.scaleFactor;

      console.log(
        `Desktop - Width Scale: ${widthScale}, Height Scale: ${heightScale}, Final: ${this.scaleFactor}`,
      );
    }

    console.log(
      `Final dimensions - Reel: ${this.reelWidth}, Symbol: ${this.symbolSize}`,
    );
  }

  private initSlotTextures(): void {
    // Define 12 colors for different symbol types
    const symbolColors = [
      // Card symbols (A, K, Q, J, 10)
      { color: 0xff4444, label: "A", type: "card" }, // Red for Ace
      { color: 0x4444ff, label: "K", type: "card" }, // Blue for King
      { color: 0x44ff44, label: "Q", type: "card" }, // Green for Queen
      { color: 0xffaa44, label: "J", type: "card" }, // Orange for Jack
      { color: 0xff44ff, label: "10", type: "card" }, // Magenta for 10

      // Premium symbols (1-5)
      { color: 0xffd700, label: "1", type: "premium" }, // Gold
      { color: 0xc0c0c0, label: "2", type: "premium" }, // Silver
      { color: 0xcd7f32, label: "3", type: "premium" }, // Bronze
      { color: 0x9932cc, label: "4", type: "premium" }, // Purple
      { color: 0x00ced1, label: "5", type: "premium" }, // Turquoise

      // Special symbols
      { color: 0xff1493, label: "B", type: "bonus" }, // Deep pink for Bonus
      { color: 0x32cd32, label: "S", type: "scatter" }, // Lime green for Scatter
    ];

    symbolColors.forEach((symbolData) => {
      const graphics = new Graphics();

      // Create the main symbol container with baby blue border and black outline
      const borderWidth = 4;
      const outlineWidth = 2;
      const symbolSize = this.symbolSize;

      // Black outline (outermost)
      graphics.rect(0, 0, symbolSize, symbolSize);
      graphics.fill({ color: 0x000000 });

      // Baby blue border (#87CEEB)
      graphics.rect(
        outlineWidth,
        outlineWidth,
        symbolSize - outlineWidth * 2,
        symbolSize - outlineWidth * 2,
      );
      graphics.fill({ color: 0x87ceeb });

      // Inner symbol area (slightly smaller to show border)
      const innerSize = symbolSize - borderWidth * 2 - outlineWidth * 2;
      const innerOffset = borderWidth + outlineWidth;
      graphics.rect(innerOffset, innerOffset, innerSize, innerSize);
      graphics.fill({ color: symbolData.color });

      // Create question mark pattern overlay
      this.addQuestionMarkPattern(graphics, innerOffset, innerSize);

      // Add upload placeholder text
      const uploadText = new Text("UPLOAD\nSYMBOL", {
        fontSize: Math.floor(12 * this.scaleFactor),
        fill: 0xffffff,
        fontWeight: "bold",
        align: "center",
        fontFamily: "Arial",
      });
      uploadText.anchor.set(0.5);
      uploadText.x = symbolSize / 2;
      uploadText.y = symbolSize / 2 - 10;
      graphics.addChild(uploadText);

      // Add symbol type identifier at bottom
      const typeText = new Text(`${symbolData.label}`, {
        fontSize: Math.floor(16 * this.scaleFactor),
        fill: 0x000000,
        fontWeight: "bold",
        fontFamily: "Arial",
      });
      typeText.anchor.set(0.5);
      typeText.x = symbolSize / 2;
      typeText.y = symbolSize - 15;
      graphics.addChild(typeText);

      // Add small type indicator in corner
      const cornerText = new Text(symbolData.type.toUpperCase(), {
        fontSize: Math.floor(8 * this.scaleFactor),
        fill: 0xffffff,
        fontWeight: "bold",
        fontFamily: "Arial",
      });
      cornerText.x = 3;
      cornerText.y = 3;
      graphics.addChild(cornerText);

      this.slotTextures.push(engine().renderer.generateTexture(graphics));
    });
  }

  private addQuestionMarkPattern(
    graphics: Graphics,
    offset: number,
    innerSize: number,
  ): void {
    // Create a subtle question mark pattern overlay
    const questionMarkSize = 6;
    const spacing = 12;

    for (let x = offset + spacing; x < offset + innerSize; x += spacing) {
      for (let y = offset + spacing; y < offset + innerSize; y += spacing) {
        const questionMark = new Text("?", {
          fontSize: Math.floor(questionMarkSize * this.scaleFactor),
          fill: 0xffffff,
          fontWeight: "bold",
          fontFamily: "Arial",
        });
        questionMark.alpha = 0.3; // Set alpha on the object
        questionMark.anchor.set(0.5);
        questionMark.x = x;
        questionMark.y = y;
        graphics.addChild(questionMark);
      }
    }
  }

  private createSlotMachine(): void {
    this.reelContainer = new Container();

    // Calculate the total size needed for all symbols and their spacing
    const reelSpacing = 15; // Space between reels
    const symbolSpacing = 8; // Space between symbols within a reel
    const padding = 10; // Extra padding around the entire grid

    // Calculate total dimensions including all spacing
    const totalWidth =
      this.REELS_COUNT * this.symbolSize +
      (this.REELS_COUNT - 1) * reelSpacing +
      2 * padding;
    const totalHeight =
      this.SYMBOLS_PER_REEL * this.symbolSize +
      (this.SYMBOLS_PER_REEL - 1) * symbolSpacing +
      2 * padding;

    // Create a single large background rectangle with rounded corners
    const background = new Graphics();
    background.roundRect(0, 0, totalWidth, totalHeight, 10); // Rounded corners for better appearance
    background.fill({ color: 0x87ceeb }); // Baby blue background
    background.stroke({ color: 0x000000, width: 3 }); // Black border around the entire background
    this.reelContainer.addChild(background);

    this.mainContainer.addChild(this.reelContainer);

    // Build the reels for 5x5 grid with better spacing for animations
    for (let i = 0; i < this.REELS_COUNT; i++) {
      const rc = new Container();
      // Position reel containers with padding offset and spacing
      rc.x = padding + i * (this.symbolSize + reelSpacing);
      this.reelContainer.addChild(rc);

      const reel: Reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Build the symbols with increased spacing
      for (let j = 0; j < this.SYMBOLS_PER_REEL; j++) {
        const symbol = new Sprite(
          this.slotTextures[
            Math.floor(Math.random() * this.slotTextures.length)
          ],
        );

        // Position symbols with padding and spacing
        symbol.y = padding + j * (this.symbolSize + symbolSpacing);

        // Keep symbols at their original size (no scaling)
        symbol.scale.set(1);
        symbol.x = 0; // Align to left edge of reel container

        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      this.reels.push(reel);
    }

    // Position the reel container (centered with consideration for button placement)
    const totalReelWidth = totalWidth; // Use the calculated total width
    const totalReelHeight = totalHeight; // Use the calculated total height

    // Determine device type and orientation for positioning
    const screenWidth = engine().screen.width;
    const screenHeight = engine().screen.height;
    const isLandscape = screenWidth > screenHeight;
    const isMobile = Math.min(screenWidth, screenHeight) < 768;

    // Horizontal centering is always the same
    this.reelContainer.x = Math.round((screenWidth - totalReelWidth) / 2);

    // Vertical centering depends on button placement
    if (isMobile && !isLandscape) {
      // Mobile portrait: center in upper portion, leaving space for button below
      const buttonSpaceHeight = 100; // Reserve more space for button and margins
      const availableHeight = screenHeight - buttonSpaceHeight;
      this.reelContainer.y = Math.round(
        (availableHeight - totalReelHeight) / 2,
      );

      // Ensure minimum top margin
      this.reelContainer.y = Math.max(20, this.reelContainer.y);
    } else {
      // Desktop and mobile landscape: center normally (button goes to the right)
      this.reelContainer.y = Math.round((screenHeight - totalReelHeight) / 2);
    }

    // Add title and background without problematic masks
    this.createTitle();
  }

  private createTitle(): void {
    // Create gradient fill for text
    const fill = new FillGradient(0, 0, 0, 2);
    const colors = [0xffffff, 0x00ff99].map((color) =>
      Color.shared.setValue(color).toNumber(),
    );
    colors.forEach((number, index) => {
      const ratio = index / colors.length;
      fill.addColorStop(ratio, number);
    });

    // Add title text with responsive sizing
    const screenWidth = engine().screen.width;
    const screenHeight = engine().screen.height;
    const isLandscape = screenWidth > screenHeight;
    const isMobile = Math.min(screenWidth, screenHeight) < 768;

    // For mobile portrait, minimize title or skip it if space is tight
    if (isMobile && !isLandscape) {
      // Check if we have space for title
      const minTitleSpace = 40;
      if (this.reelContainer.y > minTitleSpace) {
        // Very compact title for mobile portrait
        const titleStyle = new TextStyle({
          fontFamily: "Arial",
          fontSize: Math.floor(18 * this.scaleFactor),
          fontWeight: "bold",
          fill: 0xffffff,
        });

        const titleText = new Text("SLOT 5x5", titleStyle);
        titleText.x = Math.round((engine().screen.width - titleText.width) / 2);
        titleText.y = Math.round((this.reelContainer.y - titleText.height) / 2);
        this.mainContainer.addChild(titleText);
      }
    } else {
      // Full title for desktop and mobile landscape
      let titleFontSize = 36;
      if (isMobile && isLandscape) {
        titleFontSize = 20;
      }

      const titleStyle = new TextStyle({
        fontFamily: "Arial",
        fontSize: Math.floor(titleFontSize * this.scaleFactor),
        fontStyle: "italic",
        fontWeight: "bold",
        fill: { fill },
        stroke: {
          color: 0x4a1850,
          width: Math.max(2, Math.floor(3 * this.scaleFactor)),
        },
        dropShadow: {
          color: 0x000000,
          angle: Math.PI / 6,
          blur: 4,
          distance: 6,
        },
      });

      const titleText = new Text("PIXI SLOT MACHINE 5x5!", titleStyle);
      titleText.x = Math.round((engine().screen.width - titleText.width) / 2);

      // Position title in available space above reels
      const titleSpaceTop = Math.max(
        10,
        this.reelContainer.y - titleText.height - 10,
      );
      titleText.y = Math.round(titleSpaceTop / 2);

      // Only add title if there's enough space
      if (this.reelContainer.y > titleText.height + 20) {
        this.mainContainer.addChild(titleText);
      }
    }
  }

  private createUI(): void {
    // Create spin button with responsive sizing
    const screenWidth = engine().screen.width;
    const screenHeight = engine().screen.height;
    const isLandscape = screenWidth > screenHeight;
    const isMobile = Math.min(screenWidth, screenHeight) < 768;

    // Adjust button size based on device and orientation
    let buttonWidth = 200;
    let buttonHeight = 60;

    if (isMobile) {
      if (isLandscape) {
        buttonWidth = 120; // Smaller in mobile landscape
        buttonHeight = 50;
      } else {
        buttonWidth = 180; // Medium in mobile portrait
        buttonHeight = 55;
      }
    }

    const scaledButtonWidth = Math.floor(buttonWidth * this.scaleFactor);
    const scaledButtonHeight = Math.floor(buttonHeight * this.scaleFactor);

    this.spinButton = new FancyButton({
      defaultView: new Graphics()
        .rect(0, 0, scaledButtonWidth, scaledButtonHeight)
        .fill({ color: 0x00aa00 }),
      text: new Text("SPIN!", {
        fontSize: Math.floor(24 * this.scaleFactor),
        fill: 0xffffff,
        fontWeight: "bold",
      }),
      anchor: 0.5,
      animations: {
        hover: {
          props: {
            scale: { x: 1.1, y: 1.1 },
          },
          duration: 100,
        },
        pressed: {
          props: {
            scale: { x: 0.9, y: 0.9 },
          },
          duration: 100,
        },
      },
    });

    // Position button based on layout mode
    const reelBottom =
      this.reelContainer.y + this.symbolSize * this.SYMBOLS_PER_REEL;
    const reelRight = this.reelContainer.x + this.reelWidth * this.REELS_COUNT;
    const reelCenterY =
      this.reelContainer.y + (this.symbolSize * this.SYMBOLS_PER_REEL) / 2;

    // Debug logging
    console.log(
      `Button positioning - Mobile: ${isMobile}, Landscape: ${isLandscape}, Screen: ${screenWidth}x${screenHeight}`,
    );
    console.log(
      `Reel bottom: ${reelBottom}, Reel right: ${reelRight}, Reel center Y: ${reelCenterY}`,
    );

    // Force mobile portrait condition for debugging
    const isMobilePortrait = isMobile && !isLandscape;
    console.log(`Mobile portrait condition: ${isMobilePortrait}`);

    if (isMobilePortrait) {
      // Mobile portrait: position button below the grid (centered)
      console.log("Positioning button below grid for mobile portrait");
      this.spinButton.x = screenWidth / 2;
      this.spinButton.y = reelBottom + scaledButtonHeight / 2 + 20;

      // Ensure button doesn't go off screen
      this.spinButton.y = Math.min(
        this.spinButton.y,
        screenHeight - scaledButtonHeight / 2 - 10,
      );

      console.log(
        `Button positioned at: ${this.spinButton.x}, ${this.spinButton.y}`,
      );
    } else {
      // Desktop and mobile landscape: position button to the right of the grid
      console.log("Positioning button to the right of grid");
      const availableRightSpace = screenWidth - reelRight;
      const buttonMargin = 30;

      // Position horizontally to the right of the grid
      if (availableRightSpace > scaledButtonWidth + buttonMargin * 2) {
        // Enough space - center in the right area
        this.spinButton.x = reelRight + availableRightSpace / 2;
      } else {
        // Limited space - position with minimum margin from right edge
        this.spinButton.x = Math.max(
          reelRight + scaledButtonWidth / 2 + buttonMargin,
          screenWidth - scaledButtonWidth / 2 - 20,
        );
      }

      // Position vertically centered with the grid
      this.spinButton.y = reelCenterY;

      console.log(
        `Button positioned at: ${this.spinButton.x}, ${this.spinButton.y}`,
      );
    }

    this.spinButton.onPress.connect(() => this.startSpin());

    this.mainContainer.addChild(this.spinButton);
  }

  private startSpin(): void {
    if (this.running) return;
    this.running = true;

    // Update spin button
    this.spinButton.text = "SPINNING...";
    this.spinButton.enabled = false;

    // Start spinning each reel with different timing
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      const extra = Math.floor(Math.random() * 3);
      // Reduce the target since we have fewer symbols
      const target = r.position + 5 + i * 2 + extra;
      const time = 2500 + i * 600 + extra * 600;

      this.tweenTo(
        r,
        "position",
        target,
        time,
        this.backout(0.5),
        undefined,
        i === this.reels.length - 1 ? () => this.reelsComplete() : undefined,
      );
    }
  }

  private reelsComplete(): void {
    this.running = false;
    this.spinButton.text = "SPIN!";
    this.spinButton.enabled = true;
  }

  private tweenTo(
    object: { [key: string]: number },
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    onchange?: (tween: Tween) => void,
    oncomplete?: (tween: Tween) => void,
  ): Tween {
    const tween: Tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    this.tweening.push(tween);
    return tween;
  }

  private lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
  }

  private backout(amount: number): (t: number) => number {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  public onUpdate(): void {
    // Update reel animations
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // Update blur filter based on speed
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // Update symbol positions
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * this.symbolSize;

        // Keep symbols within the visible area
        if (s.y >= this.symbolSize * this.SYMBOLS_PER_REEL) {
          s.y -= this.symbolSize * this.SYMBOLS_PER_REEL;
        }

        // Randomize texture when symbol position changes significantly
        if (Math.abs(s.y - j * this.symbolSize) > this.symbolSize * 2) {
          s.texture =
            this.slotTextures[
              Math.floor(Math.random() * this.slotTextures.length)
            ];
          s.scale.x = s.scale.y = Math.min(
            this.symbolSize / s.texture.width,
            this.symbolSize / s.texture.height,
          );
          s.x = Math.round((this.symbolSize - s.width) / 2);
        }
      }
    }

    // Update tweening
    const now = Date.now();
    const remove: Tween[] = [];

    for (let i = 0; i < this.tweening.length; i++) {
      const t = this.tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = this.lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase),
      );
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }

    for (let i = 0; i < remove.length; i++) {
      this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
    }
  }

  public onShow(): void {
    // Called when screen is shown
  }

  public onHide(): void {
    // Called when screen is hidden
  }

  public onResize(): void {
    // Recalculate scale for new screen size
    this.calculateScale();

    // Clear existing UI elements
    this.mainContainer.removeChildren();
    this.reelContainer = new Container();
    this.mainContainer.addChild(this.reelContainer);

    // Recreate textures with new scale
    this.slotTextures = [];
    this.initSlotTextures();

    // Recreate reels with new dimensions
    this.reels = [];
    for (let i = 0; i < this.REELS_COUNT; i++) {
      const rc = new Container();
      rc.x = i * this.reelWidth;
      this.reelContainer.addChild(rc);

      const reel: Reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Build the symbols (only 5 visible symbols for the 5x5 grid)
      for (let j = 0; j < this.SYMBOLS_PER_REEL; j++) {
        const symbol = new Sprite(
          this.slotTextures[
            Math.floor(Math.random() * this.slotTextures.length)
          ],
        );

        symbol.y = j * this.symbolSize;
        symbol.scale.x = symbol.scale.y = Math.min(
          this.symbolSize / symbol.width,
          this.symbolSize / symbol.height,
        );
        symbol.x = Math.round((this.symbolSize - symbol.width) / 2);

        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      this.reels.push(reel);
    }

    // Reposition everything
    const totalReelWidth = this.reelWidth * this.REELS_COUNT;
    const totalReelHeight = this.symbolSize * this.SYMBOLS_PER_REEL;

    // Determine device type and orientation for positioning
    const screenWidth = engine().screen.width;
    const screenHeight = engine().screen.height;
    const isLandscape = screenWidth > screenHeight;
    const isMobile = Math.min(screenWidth, screenHeight) < 768;

    // Horizontal centering is always the same
    this.reelContainer.x = Math.round((screenWidth - totalReelWidth) / 2);

    // Vertical centering depends on button placement
    if (isMobile && !isLandscape) {
      // Mobile portrait: center in upper portion, leaving space for button below
      const buttonSpaceHeight = 100; // Reserve more space for button and margins
      const availableHeight = screenHeight - buttonSpaceHeight;
      this.reelContainer.y = Math.round(
        (availableHeight - totalReelHeight) / 2,
      );

      // Ensure minimum top margin
      this.reelContainer.y = Math.max(20, this.reelContainer.y);
    } else {
      // Desktop and mobile landscape: center normally (button goes to the right)
      this.reelContainer.y = Math.round((screenHeight - totalReelHeight) / 2);
    }

    // Recreate masks and UI
    this.createTitle();
    this.createUI();
  }

  private addViewportBoundary(): void {
    // Create a thin border around the viewport for debugging
    const border = new Graphics();

    // Draw viewport boundary
    border.rect(0, 0, engine().screen.width, engine().screen.height);
    border.stroke({ color: 0xff0000, width: 2, alpha: 0.5 });

    // Add corner markers
    const cornerSize = 20;
    const corners = [
      { x: 0, y: 0 }, // top-left
      { x: engine().screen.width, y: 0 }, // top-right
      { x: 0, y: engine().screen.height }, // bottom-left
      { x: engine().screen.width, y: engine().screen.height }, // bottom-right
    ];

    corners.forEach((corner, index) => {
      const marker = new Graphics();
      marker.rect(-cornerSize / 2, -cornerSize / 2, cornerSize, cornerSize);
      marker.fill({ color: 0xff0000, alpha: 0.7 });
      marker.x = corner.x;
      marker.y = corner.y;

      // Add corner label
      const label = new Text(`${index + 1}`, {
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: "bold",
      });
      label.anchor.set(0.5);
      label.x = corner.x;
      label.y = corner.y;

      this.mainContainer.addChild(marker);
      this.mainContainer.addChild(label);
    });

    // Add viewport info text
    const infoText = new Text(
      `Viewport: ${engine().screen.width}x${engine().screen.height}`,
      {
        fontSize: 14,
        fill: 0xffffff,
        fontWeight: "bold",
      },
    );
    infoText.x = 10;
    infoText.y = 10;

    this.mainContainer.addChild(border);
    this.mainContainer.addChild(infoText);
  }
}

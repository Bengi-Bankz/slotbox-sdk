# SlotBox SDK

<div align="center">
  <img src="public/assets/main/logo-white.svg" alt="SlotBox SDK Logo" width="200"/>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/typescript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
  [![PixiJS](https://img.shields.io/badge/pixi.js-8.8.1-green.svg)](https://pixijs.com/)
  [![Vite](https://img.shields.io/badge/vite-6.2.0-purple.svg)](https://vitejs.dev/)
</div>

## 🎰 The Future of iGaming is Here

SlotBox SDK is a revolutionary, dynamic SDK for building casino games with unprecedented ease and creativity. Built on the powerful **PixiJS 9** engine, it provides a complete plug-and-play platform with drag-and-drop functionality, enabling developers to create unique, personalized casino experiences with stunning visuals and innovative game mechanics.

## ✨ Key Features

### 🎨 **Dynamic Game Creation**

- **Plug & Play Architecture**: Start with a fully functioning slot machine that scales dynamically
- **Drag & Drop Interface**: Intuitive design tools with visual feedback
- **Personalized Art Integration**: Upload custom artwork, animations, and symbols
- **Dynamic Scaling**: Responsive design that adapts to any screen size

### 🎲 **Advanced Game Mechanics**

- **Multiple Mathematical Variants**: Configurable RTP and payout structures
- **Unique Symbol Systems**: Color-coded squares for static symbols with PNG sequence support
- **Reel Customization**: Fully customizable reel frames and animations
- **Scatter & Bonus Features**: Intensive suspense modifiers and bonus triggers

### 🔧 **Professional Development Tools**

- **Built-in Texture Packer**: Create sprite sheets with JSON and atlas files
- **FFmpeg Integration**: Convert 10-second videos to sprite sequences
- **Screenshot & Recording**: Capture gameplay with annotation tools
- **Real-time Preview**: See changes instantly in the viewport

### 🎯 **Resolution & Orientation Support**

- **Multi-Resolution Variants**: Extensive resolution options in the selection menu
- **Size-based Selection**: Choose by specific dimensions
- **Orientation Support**: Portrait and landscape modes
- **Responsive Design**: Automatic scaling for all devices

### 🌐 **Collaboration & AI Features**

- **Networked Connectivity**: Team collaboration tools (coming soon)
- **Built-in AI Assistant**: Suggestions and problem-solving support
- **Debugging Help**: AI-powered error detection and solutions
- **Smart Recommendations**: Intelligent game design suggestions

### 🔥 **Game State Management**

- **"Burn" Functionality**: Save complete game states like a 90s CD
- **Export to Stake Engine**: Direct integration with gaming platforms
- **CSV Math Files**: Comprehensive outcome calculations using Rust/Cargo
- **RTP Balancing**: Automated return-to-player optimization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/Bengi-Bankz/slotbox-sdk.git
cd slotbox-sdk

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Quick Start

```bash
# Start the development server
npm start

# Build for production
npm run build

# Run linting
npm run lint
```

## 🎮 Usage

### Basic Setup

```typescript
import { CreationEngine } from "./src/engine/engine";
import { SlotMachineScreen } from "./src/app/screens/main/SlotMachineScreen";

// Initialize the engine
const engine = new CreationEngine();
await engine.init({
  background: "#1E1E1E",
  resizeOptions: {
    minWidth: 280,
    minHeight: 480,
  },
});

// Create your slot machine
const slotMachine = new SlotMachineScreen();
engine.screen.addChild(slotMachine);
```

### Creating Custom Symbols

```typescript
// Upload PNG sequences for animated symbols
const animatedSymbol = await loadPNGSequence("path/to/sequence");

// Create static symbols with color coding
const staticSymbol = new ColorCodedSymbol({
  color: "#FF6B6B",
  type: "cherry",
});
```

### Mathematical Configuration

```typescript
// Configure RTP and payout structures
const mathConfig = {
  rtp: 96.5,
  volatility: "medium",
  paylines: 25,
  bonusFrequency: 1 / 100,
};
```

## 🏗️ Architecture

### Core Components

- **Engine**: PixiJS-based rendering engine with custom plugins
- **Screens**: Modular screen management system
- **Audio**: Advanced audio management with @pixi/sound
- **Navigation**: Seamless screen transitions
- **Resize**: Responsive layout handling
- **UI Components**: Reusable UI elements (buttons, labels, sliders)

### Plugin System

- **AudioPlugin**: Sound management and effects
- **NavigationPlugin**: Screen routing and transitions
- **ResizePlugin**: Dynamic viewport handling
- **Custom Plugins**: Extensible architecture for new features

## 🎨 Asset Pipeline

### Supported Formats

- **Images**: PNG, JPEG, WebP, SVG
- **Audio**: MP3, OGG, WAV
- **Video**: MP4 (converted to sprite sequences)
- **Animations**: PNG sequences, Spine animations
- **Textures**: Custom sprite sheets with JSON atlases

### Asset Processing

```typescript
// Automatic sprite sheet generation
const spriteSheet = await createSpriteSheet({
  images: ["symbol1.png", "symbol2.png"],
  output: "symbols.json",
  algorithm: "maxrects",
});

// FFmpeg video conversion
const sequence = await convertVideoToSprites({
  input: "bonus_animation.mp4",
  duration: 10,
  fps: 24,
});
```

## 🔧 Configuration

### Game Settings

```json
{
  "game": {
    "name": "My Custom Slot",
    "rtp": 96.5,
    "volatility": "medium",
    "reels": 5,
    "rows": 3,
    "paylines": 25
  },
  "graphics": {
    "theme": "modern",
    "resolution": "auto",
    "effects": true
  },
  "audio": {
    "bgm": true,
    "sfx": true,
    "volume": 0.8
  }
}
```

### Build Configuration

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [
    assetpack({
      pipes: [texturePacker(), webp(), compress()],
    }),
  ],
});
```

## 🌟 Advanced Features

### AI Integration

- **Smart Symbol Placement**: AI-suggested optimal symbol positioning
- **RTP Optimization**: Automatic mathematical balancing
- **Bug Detection**: AI-powered debugging assistance
- **Performance Optimization**: Intelligent resource management

### Collaboration Tools

- **Real-time Editing**: Multiple developers working simultaneously
- **Version Control**: Built-in asset versioning
- **Comment System**: Annotate designs and code
- **Review Process**: Streamlined approval workflows

### Export Options

- **Stake Engine**: Direct deployment to gaming platforms
- **HTML5 Export**: Standalone web games
- **Mobile Apps**: Export for iOS/Android
- **Desktop**: Electron-based applications

## 📱 Platform Support

### Web Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Devices

- iOS 14+
- Android 8+
- Responsive design for all screen sizes

### Desktop

- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 20.04+)

## 💰 Pricing & Commercial Use

### 🆓 **Community Edition (Free)**

- Basic slot machine functionality
- Up to 3 reels, 3 rows
- Standard symbols and animations
- Local development only
- Community support

### 🚀 **Professional Edition ($29/month)**

- Unlimited reels and rows
- Custom symbol upload
- Advanced animations and effects
- Screenshot & recording tools
- Priority support
- Commercial license included

### 🏢 **Enterprise Edition ($99/month)**

- Everything in Professional
- AI-powered suggestions
- Stake Engine integration
- White-label options
- Custom branding
- Dedicated support
- Priority revenue sharing (reduced rates)

### 📊 **Revenue Share Tiers**

#### 🌟 **Starter Games** (First $1,000/month)

- **SlotBox Share**: 15%
- **Developer Share**: 85%
- **Benefits**: Standard support, basic analytics

#### 🚀 **Growing Games** ($1,000 - $10,000/month)

- **SlotBox Share**: 10%
- **Developer Share**: 90%
- **Benefits**: Priority support, advanced analytics, marketing assistance

#### 💎 **Successful Games** ($10,000+/month)

- **SlotBox Share**: 7%
- **Developer Share**: 93%
- **Benefits**: Dedicated account manager, custom features, co-marketing

#### 🏆 **Enterprise Partners** (Custom)

- **SlotBox Share**: 5% (negotiable)
- **Developer Share**: 95%
- **Benefits**: White-label options, custom development, direct partnership

> **The more successful your games become, the less we take. We're invested in your long-term success!** 💪

### 💎 **Revenue Share Program**

- **Free to Use** - No upfront costs
- **We Take 10%** - Only when your game makes money
- **Built-in Analytics** - Real-time revenue tracking
- **Monthly Payouts** - Automated payments to developers
- **Stake Engine Integration** - Direct deployment with revenue tracking
- **Performance Bonuses** - Reduced rates for high-performing games

> **Why Revenue Share?** We succeed when you succeed. Build amazing games, we handle the tech and take a small cut of the profits. It's a win-win! 🚀

### 🎯 **Custom Development**

- Bespoke game creation: $500-2000
- Integration services: $200-500
- Training and consulting: $100/hour

> **Ready to upgrade?** [Contact us](mailto:sales@slotbox-sdk.com) or visit our [pricing page](https://slotbox-sdk.com/pricing)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork the repository
git fork https://github.com/Bengi-Bankz/slotbox-sdk.git

# Create a feature branch
git checkout -b feature/amazing-new-feature

# Make your changes and commit
git commit -m "Add amazing new feature"

# Push and create a pull request
git push origin feature/amazing-new-feature
```

## 📚 Documentation

- [API Reference](docs/api.md)
- [Game Design Guide](docs/game-design.md)
- [Asset Creation Tutorial](docs/assets.md)
- [Mathematical Configuration](docs/math.md)
- [Deployment Guide](docs/deployment.md)

## 🎯 Roadmap

### Phase 1 (Current)

- ✅ Core engine with PixiJS 9
- ✅ Basic slot machine functionality
- ✅ Asset pipeline
- ✅ Responsive design

### Phase 2 (Q3 2025)

- 🔄 AI integration for suggestions
- 🔄 Advanced collaboration tools
- 🔄 FFmpeg video processing
- 🔄 Enhanced debugging tools

### Phase 3 (Q4 2025)

- 📋 Network multiplayer support
- 📋 Advanced mathematical modeling
- 📋 Performance analytics
- 📋 Mobile app exports

### Phase 4 (2026)

- 📋 VR/AR support
- 📋 Blockchain integration
- 📋 Advanced AI game generation
- 📋 Platform marketplace

## 🏆 Success Stories

> "SlotBox SDK transformed our game development process. We went from months to weeks in creating engaging slot experiences." - _Gaming Studio XYZ_

> "The drag-and-drop interface made it possible for our artists to directly contribute to game mechanics without coding knowledge." - _Creative Director, ABC Games_

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PixiJS Team**: For the incredible rendering engine
- **Vite Team**: For the lightning-fast build system
- **TypeScript Team**: For type safety and developer experience
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

- **Documentation**: [docs.slotbox-sdk.com](https://docs.slotbox-sdk.com)
- **Community**: [Discord Server](https://discord.gg/slotbox-sdk)
- **Issues**: [GitHub Issues](https://github.com/Bengi-Bankz/slotbox-sdk/issues)
- **Email**: support@slotbox-sdk.com

---

<div align="center">
  <p><strong>Made with ❤️ by the SlotBox SDK Team</strong></p>
  <p>🎰 <em>The Future of iGaming Starts Here</em> 🎰</p>
</div>

## 🤝 **Strategic Partnerships**

### 🎰 **Stake Engine Partnership**

SlotBox SDK is designed to work seamlessly with Stake's gaming platform through our revolutionary **three-way revenue sharing model**:

#### **How It Works:**

1. **Developers** create games using SlotBox SDK (free)
2. **SlotBox** provides tools, support, and quality assurance
3. **Stake** hosts and operates the games on their platform
4. **Revenue flows** to all three parties based on game performance

#### **Revenue Distribution:**

- **Developer**: 85-93% (based on performance tiers)
- **SlotBox**: 5-15% (decreasing as games grow)
- **Stake**: Standard platform fees (negotiated separately)

#### **Benefits for Stake:**

- **Curated Content**: Pre-tested, high-quality games
- **Reduced Development Costs**: No upfront payments to developers
- **Innovation Pipeline**: Access to cutting-edge game mechanics
- **Risk Mitigation**: Only successful games generate costs
- **Market Expansion**: Unique games attract new players

#### **Quality Assurance:**

- **Technical Standards**: All games tested for performance and compatibility
- **Mathematical Validation**: RTP and volatility verified using Rust/Cargo
- **Regulatory Compliance**: Games built to meet licensing requirements
- **Performance Monitoring**: Real-time analytics and optimization

> **Interested in Partnership?** Contact us at [partnerships@slotbox-sdk.com](mailto:partnerships@slotbox-sdk.com) to discuss integration opportunities.

### 🌟 **Multi-Platform Strategy**

While our primary focus is Stake integration, SlotBox SDK supports multiple deployment targets:

#### **Gaming Platforms:**

- **Stake**: Primary partner with deep integration
- **Roobet**: Secondary target for game deployment
- **DraftKings**: Exploring sports betting integration
- **FanDuel**: Potential casino game partnership

#### **Independent Deployments:**

- **White-label Casinos**: Direct B2B sales
- **Mobile Apps**: iOS/Android game exports
- **Web Platforms**: Standalone casino websites
- **Blockchain Gaming**: Crypto-powered slot games

#### **Revenue Optimization:**

- **A/B Testing**: Built-in game performance optimization
- **Player Analytics**: Deep insights into player behavior
- **Dynamic RTP**: Adjust payout rates based on performance
- **Seasonal Campaigns**: Holiday and event-themed games

> **The goal is to make every game a success story, benefiting developers, platforms, and players alike.** 🎯

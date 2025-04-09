# AI Widget Documentation

A customizable AI chat widget that can be easily integrated into any web application.

## Table of Contents
- [Installation & Deployment Options](#installation--deployment-options)
  - [NPM Package](#npm-package)
  - [CDN Distribution](#cdn-distribution)
  - [Self-hosted Bundle](#self-hosted-bundle)
- [Integration Guide](#integration-guide)
  - [Basic Setup](#basic-setup)
  - [Configuration](#configuration)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Deployment Guides](#deployment-guides)
  - [CDN Deployment (Cloudflare)](#cdn-deployment-cloudflare)
  - [NPM Package Deployment](#npm-package-deployment)

## Installation & Deployment Options

### NPM Package

1. Install the package:
```bash
npm install @your-org/ai-widget
# or
yarn add @your-org/ai-widget
```

2. Import and use in your project:
```javascript
import { Widget } from '@your-org/ai-widget';

// React component usage
function App() {
  return <Widget name="Custom.ai" />;
}

// JavaScript initialization
Widget.init('#widget-container', 'Custom.ai');
```

### CDN Distribution

Add the widget directly to your HTML using a script tag:

```html
<!-- Add to your HTML head or body -->
<script src="https://cdn.your-domain.com/widget.js"></script>

<script>
  // Initialize the widget
  window.addEventListener('load', function() {
    const container = document.createElement('div');
    container.id = 'ai-widget-container';
    document.body.appendChild(container);

    Widget.init('#ai-widget-container', 'Custom.ai');
  });
</script>
```

### Self-hosted Bundle

1. Download the latest release from the releases page
2. Host the `widget.js` file on your server
3. Include it in your HTML:

```html
<script src="/path/to/your/widget.js"></script>
<script>
  Widget.init('#ai-widget-container', 'Custom.ai');
</script>
```

## Integration Guide

### Basic Setup

1. Create a container element:
```html
<div id="ai-widget-container"></div>
```

2. Initialize the widget:
```javascript
Widget.init('#ai-widget-container', 'Custom.ai');
```

### Configuration

The widget accepts the following configuration options:

```javascript
Widget.init(container, name, options);
```

Parameters:
- `container` (required): CSS selector or DOM element where the widget will be mounted
- `name` (optional): Custom name for the AI assistant (default: "LAWMA.ai")
- `options` (optional): Additional configuration object (coming soon)

## API Reference

### Methods

#### `init(container: string | Element, name?: string): void`
Initializes the widget in the specified container.

```javascript
Widget.init('#widget-container', 'Custom.ai');
```

### Components

#### `<Widget>`
React component for direct integration in React applications.

Props:
- `name` (optional): Custom name for the AI assistant (default: "LAWMA.ai")

```javascript
import { Widget } from '@your-org/ai-widget';

function App() {
  return <Widget name="Custom.ai" />;
}
```

## Examples

### Plain HTML Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Widget Example</title>
</head>
<body>
    <div id="ai-widget-container"></div>

    <script src="path/to/widget.js"></script>
    <script>
        window.addEventListener('load', function() {
            Widget.init('#ai-widget-container', 'Custom.ai');
        });
    </script>
</body>
</html>
```

### React/Next.js Integration

```javascript
// pages/index.tsx
import { Widget } from '@your-org/ai-widget';

export default function Home() {
  return (
    <main>
      <h1>My App</h1>
      <Widget name="Custom.ai" />
    </main>
  );
}
```

### Building from Source

If you want to build the widget from source:

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-widget
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Build the widget:
```bash
npm run build
# or
yarn build
```

The built files will be available in the `dist` directory.

## Deployment Guides

### CDN Deployment (Cloudflare)

#### 1. Build Setup

First, create a production build of your widget:

```bash
# Install dependencies if you haven't already
npm install
# Build the widget
npm run build
```

The build will create the following files in the `dist` directory:
- `widget.js` - Minified UMD bundle
- `widget.js.map` - Source map
- `widget.esm.js` - ESM module
- `widget.d.ts` - TypeScript declarations

#### 2. Cloudflare Setup

1. Sign up for [Cloudflare Pages](https://pages.cloudflare.com)

2. Create a new project:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create a new project
wrangler pages project create ai-widget
```

3. Configure build settings in `wrangler.toml`:
```toml
name = "ai-widget"
main = "dist/widget.js"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
entry-point = "workers-site"

[build]
command = "npm run build"
output_directory = "dist"

[cache]
[cache.browser]
control = "public, max-age=14400"
```

4. Deploy to Cloudflare:
```bash
wrangler pages publish
```

Your widget will be available at: `https://ai-widget.[your-subdomain].pages.dev/widget.js`

#### 3. Custom Domain Setup

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Click "Custom domains"
4. Add your domain (e.g., `cdn.yourdomain.com`)
5. Follow DNS configuration instructions

#### 4. Cache Configuration

Add cache headers in `_headers` file:
```
/widget.js
  Cache-Control: public, max-age=86400
  Content-Type: application/javascript
```

### NPM Package Deployment

#### 1. Package Preparation

1. Update `package.json`:
```json
{
  "name": "@your-org/ai-widget",
  "version": "1.0.0",
  "description": "AI Chat Widget",
  "main": "dist/widget.js",
  "module": "dist/widget.esm.js",
  "types": "dist/widget.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "npm run build:widget && npm run build:types",
    "build:widget": "your-build-command",
    "build:types": "tsc --emitDeclarationOnly",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

2. Create `.npmignore`:
```
src/
tests/
examples/
.github/
.vscode/
*.log
```

#### 2. Publishing Process

1. Create an NPM account and organization:
```bash
# Create NPM account if you don't have one
npm adduser

# Create organization (optional)
npm org add @your-org
```

2. Publish the package:
```bash
# First time publishing
npm publish --access public

# Subsequent updates
npm version patch # or minor/major
npm publish
```

#### 3. CI/CD Setup with GitHub Actions

Create `.github/workflows/publish.yml`:
```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

### Using the Deployed Widget

#### CDN Usage
```html
<script src="https://cdn.yourdomain.com/widget.js"></script>
<script>
  Widget.init('#ai-widget-container', 'Custom.ai');
</script>
```

#### NPM Usage
```bash
npm install @your-org/ai-widget
```

```javascript
import { Widget } from '@your-org/ai-widget';
// Use as shown in earlier examples
```

## License

[Your License Here]

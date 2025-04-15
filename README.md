# Chat Widget Documentation

A customizable React chat widget that can be easily integrated into any web application. The widget provides a modern, responsive interface with support for text messages, image uploads, and AI interactions.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Features](#features)

## Installation

### Vanilla JavaScript
```html
<script src="https://cdn.jsdelivr.net/gh/00mikhael/widget-sample@main/dist/widget.js"></script>
<script>
    LAWMAai.init({
        name: "Your Widget Name",
        apiKey: "your-api-key",
        primaryColor: "#007bff",
        position: "bottom-right"
    });
</script>
```

### Vue.js
```vue
<script src="https://cdn.jsdelivr.net/gh/00mikhael/widget-sample@main/dist/widget.js"></script>
<script>
    LAWMAai.init({
        name: "Your Widget Name",
        apiKey: "your-api-key",
        primaryColor: "#007bff",
        position: "bottom-right"
    });
</script>
```

### React (Next.js)
```typescript
'use client';
import Script from 'next/script';

export default function LoadWidget() {
  return (
    <div>
      <Script
        src="https://cdn.jsdelivr.net/gh/00mikhael/widget-sample@main/dist/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.LAWMAai) {
            window.LAWMAai.init({
              name: "Your Widget Name",
              apiKey: "your-api-key",
              primaryColor: "#007bff",
              position: "bottom-right"
            });
          }
        }}
        onError={(e) => console.error('Script failed to load', e)}
      />
    </div>
  );
}
```


## Configuration

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | The name of your widget instance |
| `apiKey` | string | API key for authentication |

### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `primaryColor` | string | #1f2937 | Primary color for the widget theme |
| `position` | ButtonPosition | 'center-right' | Position of the chat button |
| `welcomeMessages` | string[] | ["Ask AI about..."] | Array of welcome messages to display |

### Button Positions

Available positions for the chat button:
- `top-right`
- `center-right`
- `bottom-right`
- `top-left`
- `center-left`
- `bottom-left`

## API Reference

### Widget Initialization

```typescript
interface WidgetProps {
  name: string;
  apiKey: string;
  primaryColor?: string;
  position?: ButtonPosition;
  welcomeMessages?: string[];
}

ChatWidget.init(options: WidgetProps)
```


## Features

### Chat Window
- Slide-in panel interface
- Fullscreen mode support
- Responsive design (auto-fullscreen on mobile)
- Message history preservation
- Auto-scrolling to latest messages

### Message Types
- Text messages
- Image uploads (with preview)
- Typing indicators
- Timestamp display

### Welcome Messages
- Configurable welcome message array
- Typing animation effect
- Automatic cycling through messages

### File Upload Support
- Image file uploads
- File preview
- Remove uploaded files
- Error handling for invalid files


## Mobile Responsiveness

The widget automatically switches to full-width mode when:
- Screen width is less than 512px (32rem)
- Fullscreen mode is enabled
- Manual fullscreen toggle is clicked

This ensures optimal usability on mobile devices while maintaining a contained experience on larger screens.

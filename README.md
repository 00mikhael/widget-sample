# Chat Widget Documentation

A customizable React chat widget that can be easily integrated into any web application. The widget provides a modern, responsive interface with support for text messages, image uploads, and AI interactions.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Features](#features)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Monitoring and Analytics](#monitoring-and-analytics)

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

## Monitoring and Analytics

The chat widget includes comprehensive monitoring capabilities using Sentry and Mixpanel. This provides insights into performance, errors, and user behavior.

### Setup

1. Create accounts and get API keys from:
   - [Sentry](https://sentry.io)
   - [Mixpanel](https://mixpanel.com)

2. Set your API keys in `src/config.ts`:
```typescript
// Monitoring configuration
export const SENTRY_DSN = 'your_sentry_dsn';
export const MIXPANEL_TOKEN = 'your_mixpanel_token';
```

### Monitored Events

#### Performance Monitoring (Sentry)
- Widget initialization time
- Message sending latency
- Error tracking with stack traces
- Automatic transaction tracking

#### User Behavior Analytics (Mixpanel)
- Widget initialization
- Chat toggling (open/close)
- Message sending with context
- File upload success/failure tracking

### Event Details

1. **Widget Initialization**
   - Event: `widget_initialized`
   - Tracked data: widget name
   - Performance measurement from load to ready state

2. **Chat Toggle**
   - Event: `toggle_chat`
   - Tracked data: open/close state
   - User interaction patterns

3. **Message Sending**
   - Event: `message_sent`
   - Tracked data: message type, media presence
   - Performance timing for message delivery

4. **File Uploads**
   - Success Event: `file_upload_success`
   - Failure Event: `file_upload_failed`
   - Tracked data: file type, size, failure reasons

### Error Tracking

Automatic error capture includes:
- Stack traces
- User context
- State information
- Network failures
- API errors

### Best Practices

1. Configure sampling rates for production:
```javascript
tracesSampleRate: 0.1 // Adjust based on traffic
```

2. Set up error alerts in Sentry for:
   - High error rates
   - Critical failures
   - Performance degradation

3. Create Mixpanel dashboards for:
   - User engagement metrics
   - Feature adoption rates
   - Usage patterns
   - Conversion tracking

4. Regularly analyze:
   - Error patterns
   - Performance bottlenecks
   - User behavior trends
   - Feature usage statistics

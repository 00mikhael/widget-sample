# LAWMA AI Widget Documentation

A customizable AI chat widget that can be easily integrated into any web application.

## Features
- Easy integration with any web application
- Customizable chat interface

## Installation & Setup

### Vanilla JavaScript
```html
<script src="https://cdn.jsdelivr.net/gh/00mikhael/widget-sample@latest/dist/widget.js"></script>
<script>
    LAWMAai.init({
        name: 'Custom.ai',
        apiKey: 'your-api-key'
    });
</script>
```

### Vue.js
```vue
<script src="https://cdn.jsdelivr.net/gh/00mikhael/widget-sample@latest/dist/widget.js"></script>
<script>
    LAWMAai.init({
        name: 'Custom.ai',
        apiKey: 'your-api-key'
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
        src="https://cdn.jsdelivr.net/gh/00mikhael/widget-sample@latest/dist/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.LAWMAai) {
            window.LAWMAai.init({
              name: 'Custom.ai',
              apiKey: 'your-api-key'
            });
          }
        }}
        onError={(e) => console.error('Script failed to load', e)}
      />
    </div>
  );
}
```

## Configuration Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| name | string | Custom name for the chat widget | Yes |
| apiKey | string | Your API key for authentication | Yes |

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

# IconPicker Component

A reusable component for selecting social media and platform icons from a predefined set of Lucide icons.

## Usage

```tsx
import { IconPicker } from '@/features/shared/components/IconPicker';

function MyComponent() {
  const [selectedIcon, setSelectedIcon] = useState('Facebook');
  
  return (
    <IconPicker 
      value={selectedIcon} 
      onChange={setSelectedIcon}
      disabled={false}
    />
  );
}
```

## Props

- `value` (string): Currently selected icon name
- `onChange` (function): Callback when icon is selected
- `disabled` (boolean, optional): Disable the picker

## Available Icons

The component includes the following social media and platform icons:
- Facebook
- Instagram
- LinkedIn
- Youtube
- Twitter
- Github
- TikTok
- WhatsApp
- Telegram
- Discord
- Snapchat
- Pinterest
- Website
- Email

## Features

- Grid layout for easy icon selection
- Visual preview of selected icon
- Popover interface for clean UI
- Fully typed with TypeScript
- Accessible and keyboard navigable

'use client'

import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter, 
  Github, 
  MessageCircle, 
  Globe, 
  Mail, 
  Phone,
  Share2,
  Video,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SOCIAL_ICONS = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Youtube: Youtube,
  Twitter: Twitter,
  Github: Github,
  TikTok: Music,
  WhatsApp: Phone,
  Telegram: MessageCircle,
  Discord: MessageCircle,
  Snapchat: Video,
  Pinterest: Share2,
  Website: Globe,
  Email: Mail,
} as const;

export type IconName = keyof typeof SOCIAL_ICONS;

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  disabled?: boolean;
}

export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  
  const SelectedIcon = SOCIAL_ICONS[value as IconName] || Globe;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start"
          disabled={disabled}
          type="button"
        >
          <SelectedIcon className="mr-2 h-4 w-4" />
          {value || "Select icon..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(SOCIAL_ICONS).map(([name, Icon]) => (
            <Button
              key={name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-20 gap-1",
                value === name && "bg-accent"
              )}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              type="button"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

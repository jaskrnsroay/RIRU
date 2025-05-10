export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatars: Avatar[];
  status: UserStatus;
  theme: UserTheme;
  contactInfo: ContactInfo;
  preferences: UserPreferences;
}

export interface Avatar {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationPreferences {
  messages: boolean;
  mentions: boolean;
  reactions: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts';
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  onlineStatus: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  messageSpacing: 'compact' | 'comfortable';
}

export interface UserTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export enum UserStatus {
  Online = 'online',
  Away = 'away',
  Busy = 'busy',
  Offline = 'offline'
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  privacy: 'public' | 'private' | 'unlisted';
  tags: string[];
  subscribers: string[];
  content: ChannelContent[];
  customization: ChannelCustomization;
}

export interface ChannelContent {
  id: string;
  type: 'post' | 'draft';
  title: string;
  content: string;
  media: Media[];
  createdAt: Date;
  scheduledFor?: Date;
  tags: string[];
  reactions: Reaction[];
}

export interface Media {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  mimeType: string;
  size: number;
}

export interface ChannelCustomization {
  banner?: string;
  theme: UserTheme;
  layout: 'grid' | 'list';
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isEncrypted: boolean;
  selfDestruct: boolean;
  selfDestructTime?: number;
  isTranslated: boolean;
  isDeleted: boolean;
}

export interface MessageFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface VoiceMessage {
  url: string;
  duration: number;
  waveform: number[];
}

export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: ChatRoomType;
  participants: string[];
  tags: string[];
  createdAt: Date;
  isModerated: boolean;
  messages: Message[];
}

export enum ChatRoomType {
  Direct = 'direct',
  Group = 'group',
  Anonymous = 'anonymous',
  Topic = 'topic'
}
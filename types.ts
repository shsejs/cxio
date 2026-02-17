
export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export interface User {
  username: string;
  fullName: string;
  profilePic?: string;
  password?: string; // Simulated for this local-storage demo
  createdAt: number;
}

export interface Message {
  id: string;
  to: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface TranslationStrings {
  appName: string;
  tagline: string;
  getStarted: string;
  login: string;
  register: string;
  username: string;
  fullName: string;
  password: string;
  usernamePlaceholder: string;
  fullNamePlaceholder: string;
  passwordPlaceholder: string;
  createAccount: string;
  yourLink: string;
  copyLink: string;
  copied: string;
  shareOn: string;
  inbox: string;
  noMessages: string;
  sendMessage: string;
  send: string;
  anonymousPlaceholder: string;
  aiSuggest: string;
  logout: string;
  backToHome: string;
  success: string;
  errorUsernameTaken: string;
  errorAuth: string;
  welcomeBack: string;
  loading: string;
  settings: string;
  saveChanges: string;
  shareCard: string;
  download: string;
  close: string;
}

export type Translations = Record<Language, TranslationStrings>;

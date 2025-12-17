import React from 'react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  color?: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface ToolItem {
  title: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export enum ChatSender {
  USER = 'user',
  AI = 'model'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: Date;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}
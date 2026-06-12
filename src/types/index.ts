// Common types used across the portfolio

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: {
    light: string;
    dark: string;
  };
  video?: string;
  details?: string;
  tags: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  status?: 'live' | 'building' | 'coming-soon';
}

export interface Skill {
  category: string;
  items: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  readingTime?: number;
}

export interface GitHubUser {
  username: string;
  name: string;
  bio: string;
  location: string;
  avatar: string;
  followers: number;
  following: number;
  publicRepos: number;
  stargazersCount?: number;
}

export interface WorkItem {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
  stars?: number;
  href?: string;
  updatedAt: string; // ISO date string — controls sort order and "4 most recent" default
}

/** @deprecated use WorkItem */
export interface Project {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars?: number;
  isPublic?: boolean;
  href?: string;
}

export interface Badge {
  label: string;
  emoji: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface ActivityRepo {
  name: string;
  commits: number;
  width: number;
}

export interface ActivityItem {
  label: string;
  repos: ActivityRepo[];
}

export interface ActivityGroup {
  month: string;
  items: ActivityItem[];
}

export interface NavLink {
  href: string;
  label: string;
}

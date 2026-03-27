export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  coverImage: string;
  icon: string;
  sourceLink: string;
  addedDate?: string;
  playTime?: string;
  difficulty?: 1 | 2 | 3;
  tags?: string[];
}

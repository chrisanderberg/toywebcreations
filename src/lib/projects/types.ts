export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  coverImage: string;
  icon: string;
  sourceLink: string;
  eyebrow: string;
}

export interface ProjectAboutSection {
  title: string;
  body: string[];
}

export interface ProjectAboutContent {
  intro: string;
  sections: ProjectAboutSection[];
}

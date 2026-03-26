import type { ProjectMeta } from '../../lib/projects/types';
import { getProjectSourceUrl } from '../../lib/github';

const base = import.meta.env.BASE_URL;

export const meta: ProjectMeta = {
  slug: 'tower-of-hanoi',
  title: 'Tower of Hanoi',
  description: 'Classic three-peg puzzle — manual moves or watch an optimal auto-solve.',
  featured: true,
  coverImage: `${base}images/projects/tower-of-hanoi/cover.svg`,
  icon: `${base}images/projects/tower-of-hanoi/icon.svg`,
  sourceLink: getProjectSourceUrl('tower-of-hanoi'),
};

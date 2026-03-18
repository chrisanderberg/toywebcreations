import type { ProjectMeta } from '../../lib/projects/types';
import { projectSourceLink } from '../../lib/github';
import { assetPath } from '../../lib/site';

export const meta: ProjectMeta = {
  slug: 'tower-of-hanoi',
  title: 'Tower of Hanoi',
  description: 'Classic recursive puzzle — play manually or watch the optimal solver animate every move.',
  featured: true,
  coverImage: assetPath('images/projects/tower-of-hanoi/cover.svg'),
  icon: assetPath('images/projects/tower-of-hanoi/icon.svg'),
  sourceLink: projectSourceLink('tower-of-hanoi'),
};

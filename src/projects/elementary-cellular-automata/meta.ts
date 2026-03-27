import type { ProjectMeta } from '../../lib/projects/types';
import { projectSourceLink } from '../../lib/github';
import { assetPath } from '../../lib/site';

export const meta: ProjectMeta = {
  slug: 'elementary-cellular-automata',
  title: '1D Cellular Automata',
  description: 'Explore all 256 elementary rules — watch simple local rules create complexity, chaos, and fractals.',
  featured: true,
  coverImage: assetPath('images/projects/elementary-cellular-automata/cover.svg'),
  icon: assetPath('images/projects/elementary-cellular-automata/icon.svg'),
  sourceLink: projectSourceLink('elementary-cellular-automata'),
  addedDate: '2025-01-01',
  playTime: '2–5 min',
  difficulty: 1,
  tags: ['simulation', 'visual'],
};

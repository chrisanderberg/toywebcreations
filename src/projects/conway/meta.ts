import type { ProjectMeta } from '../../lib/projects/types';
import { projectSourceLink } from '../../lib/github';
import { assetPath } from '../../lib/site';

export const meta: ProjectMeta = {
  slug: 'conway',
  title: "Conway's Game of Life",
  description: "Cellular automaton simulation — draw cells, watch emergent life unfold.",
  featured: true,
  coverImage: assetPath('images/projects/conway/cover.svg'),
  icon: assetPath('images/projects/conway/icon.svg'),
  sourceLink: projectSourceLink('conway'),
  addedDate: '2024-06-01',
  playTime: '2–5 min',
  difficulty: 1,
  tags: ['simulation', 'visual'],
};

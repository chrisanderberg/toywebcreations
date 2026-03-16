import type { ProjectMeta } from '../../lib/projects/types';
import { projectSourceLink } from '../../lib/github';

export const meta: ProjectMeta = {
  slug: 'conway',
  title: "Conway's Game of Life",
  description: "Cellular automaton simulation — draw cells, watch emergent life unfold.",
  featured: true,
  coverImage: '/toywebcreations/images/projects/conway/cover.svg',
  icon: '/toywebcreations/images/projects/conway/icon.svg',
  sourceLink: projectSourceLink('conway'),
};

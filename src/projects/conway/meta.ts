import type { ProjectMeta } from '../../lib/projects/types';
import { getProjectSourceUrl } from '../../lib/github';

const base = import.meta.env.BASE_URL;

export const meta: ProjectMeta = {
  slug: 'conway',
  title: "Conway's Game of Life",
  description: 'Cellular automaton on a toroidal grid — watch patterns evolve.',
  featured: true,
  coverImage: `${base}images/projects/conway/cover.svg`,
  icon: `${base}images/projects/conway/icon.svg`,
  sourceLink: getProjectSourceUrl('conway'),
};

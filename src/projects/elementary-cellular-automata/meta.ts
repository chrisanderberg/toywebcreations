import type { ProjectMeta } from '../../lib/projects/types';
import { getProjectSourceUrl } from '../../lib/github';

const base = import.meta.env.BASE_URL;

export const meta: ProjectMeta = {
  slug: 'elementary-cellular-automata',
  title: '1D Cellular Automata Explorer',
  description: 'Pick any elementary rule (0–255) and watch a 1D pattern unfold row by row.',
  featured: true,
  coverImage: `${base}images/projects/elementary-cellular-automata/cover.svg`,
  icon: `${base}images/projects/elementary-cellular-automata/icon.svg`,
  sourceLink: getProjectSourceUrl('elementary-cellular-automata'),
};

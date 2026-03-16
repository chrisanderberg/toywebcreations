import type { ProjectMeta } from '../../lib/projects/types';
import { projectSourceLink } from '../../lib/github';

export const meta: ProjectMeta = {
  slug: 'elementary-cellular-automata',
  title: '1D Cellular Automata',
  description: 'Explore all 256 elementary rules — watch simple local rules create complexity, chaos, and fractals.',
  featured: true,
  coverImage: '/toywebcreations/images/projects/elementary-cellular-automata/cover.svg',
  icon: '/toywebcreations/images/projects/elementary-cellular-automata/icon.svg',
  sourceLink: projectSourceLink('elementary-cellular-automata'),
};

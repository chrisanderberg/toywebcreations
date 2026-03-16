import type { ProjectMeta } from '../../lib/projects/types';
import { projectSourceLink } from '../../lib/github';

export const meta: ProjectMeta = {
  slug: 'sudoku',
  title: 'Sudoku',
  description: 'A classic 9×9 Sudoku puzzle with auto-generation and constraint highlighting.',
  featured: true,
  coverImage: '/toywebcreations/images/projects/sudoku/cover.svg',
  icon: '/toywebcreations/images/projects/sudoku/icon.svg',
  sourceLink: projectSourceLink('sudoku'),
};

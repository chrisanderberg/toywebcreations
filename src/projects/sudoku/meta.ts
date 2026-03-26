import type { ProjectMeta } from '../../lib/projects/types';
import { getProjectSourceUrl } from '../../lib/github';

const base = import.meta.env.BASE_URL;

export const meta: ProjectMeta = {
  slug: 'sudoku',
  title: 'Sudoku',
  description: 'Classic 9×9 logic puzzle — fill the grid with digits 1–9.',
  featured: true,
  coverImage: `${base}images/projects/sudoku/cover.svg`,
  icon: `${base}images/projects/sudoku/icon.svg`,
  sourceLink: getProjectSourceUrl('sudoku'),
};

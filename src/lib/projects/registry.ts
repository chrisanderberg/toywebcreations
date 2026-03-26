import type { ProjectMeta } from './types';
import { meta as sudoku } from '../../projects/sudoku/meta';
import { meta as conway } from '../../projects/conway/meta';
import { meta as towerOfHanoi } from '../../projects/tower-of-hanoi/meta';
import { meta as elementaryCellularAutomata } from '../../projects/elementary-cellular-automata/meta';

export const projects: ProjectMeta[] = [
  sudoku,
  conway,
  towerOfHanoi,
  elementaryCellularAutomata,
];

export function getProjects(): ProjectMeta[] {
  return projects;
}

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

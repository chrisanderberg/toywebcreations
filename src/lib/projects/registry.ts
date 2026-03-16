import type { ProjectMeta } from './types';
import { meta as sudokuMeta } from '../../projects/sudoku/meta';
import { meta as conwayMeta } from '../../projects/conway/meta';
import { meta as towerOfHanoiMeta } from '../../projects/tower-of-hanoi/meta';
import { meta as elementaryCellularAutomataMeta } from '../../projects/elementary-cellular-automata/meta';

export const projects: ProjectMeta[] = [sudokuMeta, conwayMeta, towerOfHanoiMeta, elementaryCellularAutomataMeta];

export function getProjects(): ProjectMeta[] {
  return projects;
}

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

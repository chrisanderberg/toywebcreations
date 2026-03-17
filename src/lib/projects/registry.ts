import type { ProjectAboutContent, ProjectMeta } from "./types";
import { meta as conwayMeta } from "../../projects/conway/meta";
import { about as conwayAbout } from "../../projects/conway/about";
import { meta as elementaryCellularAutomataMeta } from "../../projects/elementary-cellular-automata/meta";
import { about as elementaryCellularAutomataAbout } from "../../projects/elementary-cellular-automata/about";
import { meta as sudokuMeta } from "../../projects/sudoku/meta";
import { about as sudokuAbout } from "../../projects/sudoku/about";
import { meta as towerOfHanoiMeta } from "../../projects/tower-of-hanoi/meta";
import { about as towerOfHanoiAbout } from "../../projects/tower-of-hanoi/about";

export interface ProjectRecord {
  meta: ProjectMeta;
  about: ProjectAboutContent;
}

const projectRecords = [
  { meta: sudokuMeta, about: sudokuAbout },
  { meta: conwayMeta, about: conwayAbout },
  { meta: elementaryCellularAutomataMeta, about: elementaryCellularAutomataAbout },
  { meta: towerOfHanoiMeta, about: towerOfHanoiAbout }
] as const satisfies readonly ProjectRecord[];

export type ProjectSlug = (typeof projectRecords)[number]["meta"]["slug"];

function cloneProjectMeta(meta: ProjectMeta): ProjectMeta {
  return { ...meta };
}

function cloneProjectRecord(record: ProjectRecord): ProjectRecord {
  return {
    ...record,
    meta: cloneProjectMeta(record.meta)
  };
}

export function getProjectRecords(): ProjectRecord[] {
  return projectRecords.map((record) => cloneProjectRecord(record));
}

export function getProjects(): ProjectMeta[] {
  return projectRecords.map((record) => cloneProjectMeta(record.meta));
}

export function getProject(slug: string): ProjectRecord | undefined {
  const record = projectRecords.find((projectRecord) => projectRecord.meta.slug === slug);
  return record ? cloneProjectRecord(record) : undefined;
}

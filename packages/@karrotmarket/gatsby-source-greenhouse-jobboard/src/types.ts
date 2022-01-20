import type { Node, NodeInput } from 'gatsby';
import type {
  Job,
  JobContentFields,
  JobQuestionFields,
  Department,
  DepartmentListItem,
} from 'greenhouse-jobboard-js';

export type PluginOptions = {
  boardToken: string,
  forceGC: boolean,
};

export type GreenhouseJobBoardJobNodeSource = (
  & Omit<Job & JobContentFields & JobQuestionFields, 'id'>
  & { ghId: number; boardToken: string }
);

export type GreenhouseJobBoardJobNode = (
  & Node
  & Omit<Job & JobContentFields & JobQuestionFields, 'id'>
  & { ghId: number; boardToken: string }
);

export type GreenhouseJobBoardDepartmentNodeSource = (
  & Omit<Department & DepartmentListItem, 'id'>
  & { ghId: number; boardToken: string }
);

export type GreenhouseJobBoardDepartmentNode = (
  & Node
  & Omit<Department & DepartmentListItem, 'id'>
  & { ghId: number; boardToken: string }
);

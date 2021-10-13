import type { Node, NodeInput } from 'gatsby';
import type {
  Job,
  JobContentFields,
  JobQuestionFields,
} from 'greenhouse-jobboard-js';

export type PluginOptions = {
  boardToken: string,
  forceGC: boolean,
};

export type GreenhouseJobBoardJobNodeSource = (
  & NodeInput
  & Omit<Job & JobContentFields & JobQuestionFields, 'id'>
  & { ghId: number; boardToken: string }
);

export type GreenhouseJobBoardJobNode = (
  & Node
  & Omit<Job & JobContentFields & JobQuestionFields, 'id'>
  & { ghId: number; boardToken: string }
);

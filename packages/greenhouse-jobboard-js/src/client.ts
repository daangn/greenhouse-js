import type { Job, JobQuestionFields, JobContentFields } from './types';

type JobBoardClientV1Options = {
  boardToken: string,
  client: JsonClient,
};

interface JsonClient {
  get(url: URL): Promise<unknown>;
}

export class JobBoardClientV1 {
  #client: JsonClient;
  endpoint: string;
  boardToken: string;

  static baseURL = 'https://boards-api.greenhouse.io/v1';

  constructor({
    boardToken,
    client,
  }: JobBoardClientV1Options) {
    this.#client = client;
    this.boardToken = boardToken;
    this.endpoint = `${JobBoardClientV1.baseURL}/${boardToken}`;
  }

  getJobList(): Promise<Job[]> {
    const url = new URL(`${this.endpoint}/jobs`);

    return this.#client.get(url) as Promise<Job[]>;
  }

  getJobListWithContent(): Promise<(Job & JobContentFields)[]> {
    const url = new URL(`${this.endpoint}/jobs`);
    url.searchParams.set('content', 'true');

    return this.#client.get(url) as Promise<(Job & JobContentFields)[]>;
  }

  getJob(jobId: string): Promise<Job & JobContentFields> {
    const url = new URL(`${this.endpoint}/job/${jobId}`);

    return this.#client.get(url) as Promise<Job & JobContentFields>;
  }

  getJobWithQuestions(jobId: string): Promise<Job & JobContentFields & JobQuestionFields> {
    const url = new URL(`${this.endpoint}/job/${jobId}`);
    url.searchParams.set('questions', 'true');

    return this.#client.get(url) as Promise<Job & JobContentFields & JobQuestionFields>;
  }
}

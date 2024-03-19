import type {
  Job,
  JobQuestionFields,
  JobContentFields,
  Department,
  DepartmentListItem,
  DepartmentTreeNode,
} from './types';

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
    this.endpoint = `${JobBoardClientV1.baseURL}/boards/${boardToken}`;
  }

  async getJobList(): Promise<Job[]> {
    const url = new URL(`${this.endpoint}/jobs`);

    const data = await this.#client.get(url);
    if (!(data && typeof data === 'object')) {
      throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
    }

    if ('status' in data && data.status === 404) {
      // If jobs empty, Greenhouse treats it as "not found" error
      return [];
    }

    if ('jobs' in data) {
      return data.jobs as Job[];
    }

    throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
  }

  async getJobListWithContent(): Promise<Array<Job & JobContentFields>> {
    const url = new URL(`${this.endpoint}/jobs`);
    url.searchParams.set('content', 'true');

    const data = await this.#client.get(url);
    if (!(data && typeof data === 'object')) {
      throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
    }

    if ('status' in data && data.status === 404) {
      // If jobs empty, Greenhouse treats it as "not found" error
      return [];
    }

    if ('jobs' in data) {
      return data.jobs as Array<Job & JobContentFields>;
    }

    throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
  }

  getJob(jobId: Job['id']): Promise<Job & JobContentFields> {
    const url = new URL(`${this.endpoint}/jobs/${jobId}`);

    return this.#client.get(url) as Promise<Job & JobContentFields>;
  }

  getJobWithQuestions(jobId: Job['id']): Promise<Job & JobContentFields & JobQuestionFields> {
    const url = new URL(`${this.endpoint}/jobs/${jobId}`);
    url.searchParams.set('questions', 'true');

    return this.#client.get(url) as Promise<Job & JobContentFields & JobQuestionFields>;
  }

  async getDepartmentList(): Promise<Array<Department & DepartmentListItem>> {
    const url = new URL(`${this.endpoint}/departments`);
    url.searchParams.set('render_as', 'list');

    const data = await this.#client.get(url);
    if (!(data && typeof data === 'object')) {
      throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
    }

    if ('status' in data && data.status === 404) {
      // If departments empty, Greenhouse treats it as "not found" error
      return [];
    }

    if ('departments' in data) {
      return data.departments as Array<Department & DepartmentListItem>;
    }

    throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
  }

  async getDepartmentTree(): Promise<Array<Department & DepartmentTreeNode>> {
    const url = new URL(`${this.endpoint}/departments`);
    url.searchParams.set('render_as', 'tree');

    const data = await this.#client.get(url);
    if (!(data && typeof data === 'object')) {
      throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);
    }

    if ('status' in data && data.status === 404) {
      // If departments empty, Greenhouse treats it as "not found" error
      return [];
    }

    if ('departments' in data) {
      return data.departments as Array<Department & DepartmentTreeNode>;
    }

    throw new Error(`Unexpected response type: ${JSON.stringify(data)}`);

    return (data as any).departments;
  }

  getDepartmentAsListItem(departmentId: Department['id']): Promise<Department & DepartmentListItem> {
    const url = new URL(`${this.endpoint}/departments/${departmentId}`);
    url.searchParams.set('render_as', 'list');

    return this.#client.get(url) as Promise<Department & DepartmentListItem>;
  }

  getDepartmentAsTreeNode(departmentId: Department['id']): Promise<Department & DepartmentTreeNode> {
    const url = new URL(`${this.endpoint}/departments/${departmentId}`);
    url.searchParams.set('render_as', 'tree');

    return this.#client.get(url) as Promise<Department & DepartmentTreeNode>;
  }
}

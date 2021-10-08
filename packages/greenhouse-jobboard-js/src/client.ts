import type { Job, JobQuestionsFields } from './types';

type GetJobsParams = {
  content?: boolean;
};

type GetRetriveJobArgs = {
  jobId: string;
};
type GetRetriveJobParams = {
  questions?: boolean;
};

interface JsonClient {
  get(url: string, params?: Record<string,any>): Promise<unknown>;
}

export class JobBoardClientV1 {
  client: JsonClient;
  boardToken: string;
  static baseURL = 'https://boards-api.greenhouse.io/v1';

  constructor(boardToken: string, jsonClient: JsonClient) {
    this.boardToken = boardToken;
    this.client = jsonClient
  }

  getJobs = (params?: GetJobsParams) =>
    this._request<Job[]>(`/jobs`, {
      params,
    });

  getRetrieveJob = async (args: GetRetriveJobArgs, params?: GetRetriveJobParams) => {
    if (params?.questions) {
      return await this._request<Job & JobQuestionsFields>(`/jobs/${args.jobId}`, { params });
    } else {
      return await this._request<Job>(`/jobs/${args.jobId}`);
    }
  };

  _request = async <T = never>(path:string, params?:Record<string,any>) => {
    try {
      return this.client.get(`${JobBoardClientV1.baseURL}/boards/${this.boardToken}${path}`, params) as Promise<T>
    } catch (error) {
      this._onError(error as Error);
    }
    return null;
  };

  _onError = (error: Error) => {
    console.error(error);
  };
}

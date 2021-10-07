import axios, { AxiosRequestConfig } from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
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

export class JobBoardClientV1 {
  private client: AxiosInstance;
  boardToken: string;
  static baseURL = 'https://boards-api.greenhouse.io/v1';

  constructor(boardToken: string) {
    this.boardToken = boardToken;
    this.client = axios.create({
      baseURL: `${JobBoardClientV1.baseURL}/boards/${boardToken}`,
    });
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

  _request = async <T = never>(url:string, config?:AxiosRequestConfig<T>) => {
    try {
      const { data } = await this.client.request({
        method: 'GET',
        ...config,
        url,
      });
      return data;
    } catch (error) {
      this._onError(error as AxiosError);
    }
    return null;
  };

  _onError = (error:AxiosError) => {
    console.error(error);
  };
}

export type Job = {
  id: number,
  title: string,
  absolute_url: string,
  updated_at: string,
  requisition_id: string,
  internal_job_id: number,
  location: JobLocation,
  metadata: JobCustomFieldMetadata[],
};

type JobDepartment = Omit<Department, 'jobs'> & DepartmentListItem;

export type JobContentFields = {
  content: string,
  departments: JobDepartment[],
};

export type JobQuestionFields = {
  questions: JobQuestion[],
  location_questions: JobLocationQuestion[],
  data_compliance: JobCompliance[],
};

export type JobQuestion = {
  required: boolean,
  label: string,
  fields: JobQuestionField[],
};

export type JobQuestionField = (
  | {
    type: 'input_file',
    name: string,
    description: string | null,
    values: [],
  }
  | {
    type: 'input_text',
    name: string,
    description: string | null,
    values: [],
  }
  | {
    type: 'input_hidden',
    name: string,
    description: string | null,
    values: [],
  }
  | {
    type: 'textarea',
    name: string,
    description: string | null,
    values: [],
  }
  | {
    type: 'multi_value_single_select',
    name: string,
    description: string | null,
    values: JobQuestionFieldValue[],
  } 
  | {
    type: 'multi_value_multi_select',
    name: string,
    description: string | null,
    values: JobQuestionFieldValue[],
  } 
);

export type JobQuestionFieldValue = {
  name: string,
  value: number,
};

export type JobLocation = {
  name: string,
};

export type JobLocationQuestion = JobQuestion;

export type JobCompliance = (
  | {
    type: 'gdpr',
    requires_consent: boolean,
    retention_period: number,
  }
);

export type JobCustomFieldMetadata = (
  | {
    id: number,
    name: string,
    value_type: JobCustomFieldStringValueType,
    value: string | null,
  }
  | {
    id: number,
    name: string,
    value_type: JobCustomFieldBooleanValueType,
    value: boolean | null,
  }
);

type JobCustomFieldStringValueType = (
  | 'short_text'
  | 'long_text'
  | 'single_select'
  | 'multi_select'
  | 'currency'
  | 'date'
  | 'url'
  | 'user'
  | 'currency_range'
  | 'number_range'
);

type JobCustomFieldBooleanValueType = (
  | 'yes_no'
);

export type JobCustomFieldValueType = (
  | JobCustomFieldStringValueType
  | JobCustomFieldBooleanValueType
);

export type Department = {
  id: number,
  name: string,
  jobs: DepartmentJob[],
};

type DepartmentJob = Pick<Job, (
  | 'id'
  | 'title'
  | 'location'
  | 'updated_at'
  | 'absolute_url'
)>;

export type DepartmentListItem = {
  parent_id: number | null,
  child_ids: number[],
};

export type DepartmentTreeNode = {
  children: Department[],
};

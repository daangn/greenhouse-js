export type Job = {
  id: number,
  title: string,
  absolute_url: string,
  updated_at: string,
  requisition_id: string,
  content: string,
  internal_job_id: number,
  location: JobLocation,
  metadata: JobCustomFieldMetadata[],
};

export type JobQuestionsFields = {
  questions: JobQuestion[],
  location_questions: JobLocationQuestion[],
  data_compliance: JobCompliance[],
};

type JobQuestion = {
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

type JobQuestionFieldValue = {
  name: string,
  value: number,
};

type JobLocation = {
  name: string,
};

type JobLocationQuestion = JobQuestion;

export type JobCompliance = (
  | {
    type: 'gdpr',
    requires_consent: boolean,
    retention_period: number,
  }
);

type JobCustomFieldMetadata = (
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

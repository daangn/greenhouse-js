type GreenhouseJobQuestion = {
  label: string,
  name: string,
  description: string | null,
  required: boolean,
};

export type GreenhouseJobPost = {
  questions: GreenhouseJobQuestion[],
};


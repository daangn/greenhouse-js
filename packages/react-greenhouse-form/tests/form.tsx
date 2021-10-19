import type { GreenhouseJobApplication } from '../src/types';

const jobForm = useGreenhouseJobPostForm();
jobForm.errors

const lastNameField = jobForm.questions.field('firstname');

const portfolioField = jobForm.questions.fieldByLabel('포트폴리오');

const element = (
  <form {...jobForm.getFormProps()}>
    <QuestionField {...jobForm.questions.field("firstname")}>
      {({ label, name, required, description, inputProps, error }) => (
        <>
          <input {...inputProps} placeholder={error?.type === 'required' ? "이름을 입력하세요" : description} classNames={""} />
        </>
      )}
    </QuestionField>

    <input {...lastNameField.getInputProps()} type="hidden" value="\u200b" />

    <input {...jobForm.questions.field("phone").getInputProps()} type="text" />

    <input {...jobForm.questions.field("email").getInputProps()} />

    <input {...jobForm.questions.field("resume").getInputProps()} />

    <Field
      label={portfolioField.getLabel()}
      required={portfolioField.isRequired()}
      helpText={portfolioField.getDescription()}
      inputProps={{...portfolioField.getInputProps()}}
    />

    {jobForm.questions.restFields().map(question => {

    })}
  </form>
);

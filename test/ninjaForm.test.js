const fields = require("../fields.json");
const { request_fields, user_fields } = fields._embedded;

const testStepsData = [
  {
    fields: request_fields,
    title: "Title Test Step 1",
    subtitle: "Subtitle Test Step 1",
    buttonText: "Step 1",
    active: true
  },
  {
    fields: user_fields,
    title: "Test Step 2",
    subtitle: "Subtitle Test Step 2",
    buttonText: "Step 2",
    active: false
  },
  {
    title: "Test Step 3",
    subtitle: "Subtitle Test Step 3",
    active: false
  }
];

const {
  Step,
  Form,
  Field,
  Textarea,
  Select,
  Input,
  SubmitButton,
  Heading
} = require("../demo/ninjaForm");

const steps = testStepsData.map(step => new Step(step));

describe("Steps", () => {
  it("is an instance of Step", () => {
    expect(steps[0]).toBeInstanceOf(Step);
  });

  it("contains a title", () => {
    expect(steps[0].title).toBeInstanceOf(Heading);
  });

  it("contains a subtitle", () => {
    expect(steps[0].subtitle).toBeInstanceOf(Heading);
  });

  it("step 1 is active", () => {
    expect(steps[0].element.classList.contains("container__step--active")).toBe(
      true
    );
  });

  it("step 2 is not active", () => {
    expect(
      steps[1].element.classList.contains("container__step--active")
    ).not.toBe(true);
  });
});

describe("Form", () => {
  it("is an instance of Form", () => {
    expect(steps[0].form).toBeInstanceOf(Form);
  });

  it("has fields", () => {
    for (field of steps[0].form.fields) expect(field).toBeInstanceOf(Field);
  });

  it("has a submit button", () => {
    expect(steps[0].form.submitButton).toBeInstanceOf(SubmitButton);
  });
});

describe("Fields", () => {
  const fields = steps[0].form.fields;

  it("is an instance of Field", () => {
    for (field of fields) expect(field).toBeInstanceOf(Field);
  });
});

describe("Select", () => {
  const select = steps[0].form.fields.find(
    field => field.type === "enumerable"
  );

  it("is an instance of Select", () => {
    expect(select.field).toBeInstanceOf(Select);
  });
});

describe("Textarea", () => {
  const textarea = steps[0].form.fields.find(
    field => field.type === "big_text"
  );

  it("is an instance of Textarea", () => {
    expect(textarea.field).toBeInstanceOf(Textarea);
  });
});

describe("Input", () => {
  const input = steps[1].form.fields.find(field => field.type === "small_text");

  it("is an instance of Input", () => {
    expect(input.field).toBeInstanceOf(Input);
  });
});

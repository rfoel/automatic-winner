class Step {
  constructor({ fields = [], title, subtitle, buttonText, active }) {
    this.element = document.createElement("div");
    this.element.className = "container__step";
    this.title = new Heading({
      size: 2,
      cssClass: "container__title",
      text: title
    });
    this.subtitle = new Heading({
      size: 5,
      cssClass: "container__subtitle",
      text: subtitle
    });
    this.element.appendChild(this.title.element);
    this.element.appendChild(this.subtitle.element);

    if (active) this.element.classList.add("container__step--active");

    if (fields.length) {
      this.form = new Form(fields, this.element, buttonText);
      this.element.appendChild(this.form.element);
    }
  }
}

class Form {
  constructor(fields, parent, buttonText) {
    this.element = document.createElement("form");
    this.element.className = "form";
    this.fields = fields.map(field => new Field(field));
    this.parent = parent;

    for (const field of this.fields) {
      this.element.appendChild(field.element);
    }

    this.submitButton = new SubmitButton(buttonText);
    this.element.appendChild(this.submitButton.element);

    this.element.onsubmit = event => {
      event.preventDefault();
      this.submit();
    };
  }

  submit() {
    this.fields.map(field => field.field.element.onblur());
    if (this.fields.some(field => field.invalid)) return;
    if (this.parent.nextElementSibling) {
      this.parent.classList.remove("container__step--active");
      this.parent.nextElementSibling.classList.add("container__step--active");
    }
  }
}

class Field {
  constructor({ placeholder, required, values, mask, type, label }) {
    this.invalid = false;
    this.type = type;
    this.element = document.createElement("div");
    this.element.className = "form__field";
    const fieldLabel = document.createElement("label");
    fieldLabel.className = "form__label";
    fieldLabel.innerText = label;
    this.element.appendChild(fieldLabel);

    this.onblur = () => {
      const element = this.field.element;
      const { required } = this.field;

      const value = element.value;

      if (
        (required && !value) ||
        (required &&
          element.type === "select-one" &&
          value === element[0].innerText)
      ) {
        element.classList.add("form__input--invalid");
        fieldMessage.classList.add("form__message--invalid");
        fieldMessage.innerHTML = "Este campo é requerido";
        this.invalid = true;
      } else {
        element.classList.remove("form__input--invalid");
        fieldMessage.classList.remove("form__message--invalid");
        fieldMessage.innerHTML = "";
        this.invalid = false;
      }
    };

    if (this.type === "big_text") {
      this.field = new Textarea({ placeholder, required });
    } else if (this.type === "enumerable") {
      this.field = new Select({ required, values, mask });
    } else {
      this.field = new Input({ placeholder, required, type });
    }
    this.field.element.onblur = this.onblur;
    this.element.appendChild(this.field.element);

    const fieldMessage = document.createElement("span");
    fieldMessage.className = "form__message";
    this.element.appendChild(fieldMessage);
  }
}

class Textarea {
  constructor({ placeholder, required }) {
    this.required = required;
    this.element = document.createElement("textarea");
    this.element.placeholder = placeholder;
    this.element.className = "form__input";
    this.element.rows = 3;
    if (required) this.element.required = true;
  }
}

class Select {
  constructor({ required, values, mask }) {
    this.required = required;

    this.element = document.createElement("select");
    this.element.className = "form__input";

    const optionElement = document.createElement("option");
    optionElement.innerText = mask[0].toUpperCase() + mask.slice(1);
    optionElement.selected = true;

    if (this.required) {
      this.element.required = true;
      optionElement.disabled = true;
    }

    this.element.appendChild(optionElement);

    Object.keys(values).map(key => {
      const optionElement = document.createElement("option");
      optionElement.value = key;
      optionElement.innerText = values[key];
      this.element.appendChild(optionElement);
    });
  }
}

class Input {
  constructor({ placeholder, required, type }) {
    this.required = required;
    this.type = type;

    this.element = document.createElement("input");
    this.element.placeholder = placeholder;
    this.element.className = "form__input";

    // if (required) this.element.required = true;

    if (["email", "phone"].includes(type)) {
      this.element.type = type;
    } else {
      this.element.type = "text";
    }

    if (type === "cep") {
      this.element.onkeydown = event => {
        const key = event.which ? event.which : event.keyCode;
        const value = event.target.value.replace(/\D/g, "");
        if (
          (key > 31 && (key < 48 || key > 57)) ||
          (value.length >= 8 && key !== 8)
        )
          return false;
      };
      this.element.onkeyup = event => {
        const key = event.which ? event.which : event.keyCode;
        let value = event.target.value.replace(/\D/g, "");

        if (value.length === 6 && key === 8) {
          value = value.substring(0, value.length - 1);
        }

        if (value.length === 6)
          event.target.value = `${value.substring(0, 5)}-${value.substring(
            5,
            7
          )}`;
      };
    }

    if (type === "phone") {
      this.element.onkeydown = event => {
        const key = event.which ? event.which : event.keyCode;
        const value = event.target.value.replace(/\D/g, "");
        if (
          (key > 31 && (key < 48 || key > 57)) ||
          (value.length >= 11 && key !== 8)
        )
          return false;
      };
      this.element.onkeyup = event => {
        const key = event.which ? event.which : event.keyCode;
        let value = event.target.value.replace(/\D/g, "");

        if ([2, 6].includes(value.length) && key === 8) {
          value = value.substring(0, value.length - 1);
        }

        if ([1].includes(value.length)) event.target.value = `(${value}`;
        else if ([2, 3, 4, 5].includes(value.length))
          event.target.value = `(${value.substring(0, 2)}) ${value.substring(
            2,
            6
          )}`;
        else if ([6, 7, 8, 9, 10].includes(value.length))
          event.target.value = `(${value.substring(0, 2)}) ${value.substring(
            2,
            6
          )}-${value.substring(6, 10)}`;
        else if ([11].includes(value.length))
          event.target.value = `(${value.substring(0, 2)}) ${value.substring(
            2,
            7
          )}-${value.substring(7, 11)}`;
      };
    }
  }
}

class SubmitButton {
  constructor(buttonText) {
    this.element = document.createElement("button");
    this.element.className = "form__button";
    this.element.type = "submit";
    this.element.innerText = buttonText;
  }
}

class Heading {
  constructor({ size, cssClass, text }) {
    this.element = document.createElement(`h${size}`);
    this.element.innerText = text;
    this.element.className = cssClass;
  }
}

export { Step, Form, Field, Textarea, Select, Input, SubmitButton, Heading };

import { LitElement, html } from 'lit';

export class SpForm extends LitElement {

  static properties = {
    _form: {
      state: true
    },
    _inputs: {
      state: true
    },
    _standardInputs: {
      state: true
    },
    _groupedInputs: {
      state: true
    }
  };

  firstUpdated() {

    const slot = this.shadowRoot.querySelector('slot');
    const children = slot.assignedElements({ flatten: true });
    this._form = children[0];

    if (this._form.tagName !== 'FORM') {
      throw new Error('Only form allowed as child');
    }

    if (children.length > 1) {
      throw new Error('Only one child allowed');
    }

    this._form.setAttribute('novalidate', true);

    let inputs = this._form.querySelectorAll('input, textarea');
    this._inputs = Array.from(inputs);

    this._setupInputValidation(inputs);

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this._form.checkValidity()) {
        this._form.requestSubmit();
      } else {
        this._standardInputs.forEach(input => {
          if(input.validity.valid === false) {
            this.addErrorMessage({ input });
          }
        });
      }
    });
  }

  _setupInputValidation() {

    this._standardInputs = this._inputs.filter(input => (
      ['text', 'email'].some(type => type === input.getAttribute('type'))
      || input.nodeName === 'TEXTAREA'
    ));

    const radioInputs = this._inputs.filter(input => input.getAttribute('type') === 'radio');

    const groupedInputs = {};

    radioInputs.forEach(input => {
      const key = input.getAttribute('name');
      const oldValue = groupedInputs[key] || [];
      groupedInputs[key] = [...oldValue, input];
    });

    this._groupedInputs = groupedInputs;

    this._validateStandardInputs();
  }

  _validateStandardInputs() {
    this._standardInputs.forEach(input => input.addEventListener('blur', event => {
      const field = event.target;
      const { valid } = field.validity;

      if (!valid) this.addErrorMessage({ input: field });
      if (valid) this.removeErrorMessage({ input: field });
    }));
  }

  addErrorMessage({ input }) {
    const isRadio = input.getAttribute('type') === 'radio';
    const invalidationNode = isRadio ? input.getClosest('fieldset') : input;
    const errorId = input.id + '-error';
    invalidationNode.setAttribute('aria-invalid', true);
    invalidationNode.setAttribute('aria-describedby', errorId);

    const errorSpan = document.createElement('span');
    errorSpan.setAttribute('id', errorId);
    errorSpan.innerText = input.validationMessage;

    if (!isRadio) {
      input.insertAdjacentElement('beforebegin', errorSpan);
    } else {
      console.log('hello!');
    }
  }

  removeErrorMessage({ input }) {
    const isRadio = input.getAttribute('type') === 'radio';
    const invalidationNode = isRadio ? input.getClosest('fieldset') : input;
    const errorId = input.id + '-error';
    invalidationNode.removeAttribute('aria-invalid');
    invalidationNode.removeAttribute('aria-describedby');

    document.getElementById(errorId).remove();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
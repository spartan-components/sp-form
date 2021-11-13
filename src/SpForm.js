import { html, LitElement } from 'lit';

export class SpForm extends LitElement {
  // static get styles() {
  //   return css`
  //     :host {
  //       display: block;
  //       padding: 25px;
  //       color: var(--sp-form-text-color, #000);
  //     }
  //   `;
  // }

  static get properties() {
    return {
      valid: { type: String }
    }
  }

  // constructor() {
  //   super();
  //   this.title = 'Hey there';
  //   this.counter = 5;
  // }

  // __increment() {
  //   this.counter += 1;
  // }

  get form() {
    return this.querySelector('form');
  }

  _validateForm() {
    // get reference to form
    const { form } = this;

    // listen for blur events on all inputs (blur = lost focus)
    form.addEventListener('blur', (e) => {
      
      // get reference to blurred field
      const field = e.target;
      // get reference to sp-input-group
      const parent = field.closest('sp-input-group');

      // exclude fields from checking
      if (
        field.disabled
        || field.type === 'file'
        || field.type === 'reset'
        || field.type === 'submit'
        || field.type === 'button'
      ) return;

      if (e.target.validity.valid === true) {
        // field is valid: reset aria-invalid to communicate the state of the input to assistive technologies
        field.setAttribute('aria-invalid', false);
        // also reset the message
        parent.setAttribute('error', '');
      } else {
        field.setAttribute('aria-invalid', true);
        parent.setAttribute('error', field.validationMessage);
      }
    }, true);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.checkValidity() === true) form.submit();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // disable native browser validation
    this.form.setAttribute('novalidate', true);
    // call form validation
    this._validateForm();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

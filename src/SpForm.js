import { html, LitElement } from 'lit';

export class SpForm extends LitElement {

  // static get properties() {
  //   return {
  //     hintEmail: {
  //       attribute: 'hint-email'
  //     },
  //     hintOverflow: {
  //       attribute: 'hint-overflow'
  //     },
  //     hintRequired: {
  //       attribute: 'hint-required'
  //     },
  //     hintUnderflow: {
  //       attribute: 'hint-underflow'
  //     }
  //   }
  // }

  // constructor() {
  //   super();
  //   this.hintEmail = '';
  //   this.hintOverflow = '';
  //   this.hintRequired = '';
  //   this.hintUnderflow = '';
  // }

  // // mapping errors to hints
  // get hints() {
  //   return {
  //     email: this.hintEmail,
  //     overflow: this.hintOverflow,
  //     required: this.hintRequired,
  //     underflow: this.hintUnderflow
  //   }
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

      if (field.validity.valid === true) {
        // field is valid: reset aria-invalid to communicate the state of the input to assistive technologies
        field.setAttribute('aria-invalid', false);
        // also reset the message
        parent.setAttribute('error', '');
      } else {
        // setCustomValidity(field, this.hints);
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

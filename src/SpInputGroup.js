import { html, LitElement } from 'lit';

export class SpInputGroup extends LitElement {

  static get properties() {
    return {
      error: {
        type: String
      },
      id: {
        type: String
      }
    }
  }

  constructor() {
    super();
    this.error = '';
    this.id = '';
  }
  
  firstUpdated() {
    super.firstUpdated();
    // get reference to the input field
    const input = this.querySelector('input,textarea');
    // get id of input field
    const id = input.getAttribute('id');
    // generate id for error message
    this.id = `${id}-error`;
    // link input field to error message field
    input.setAttribute('aria-describedby', this.id);
  }

  render() {
    // get input element, so we can move it underneath the error text
    const input = this.querySelector('input');

    return html`
      <span id=${this.id}>${this.error}</span>
      ${input}
    `;
  }

  createRenderRoot() {
    return this;
  }
}

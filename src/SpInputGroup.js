import { html, LitElement } from 'lit';

export class SpInputGroup extends LitElement {
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
      error: {
        type: String
      },
      id: {
        type: String
      },
      hydrated: {
        type: Boolean,
        reflect: true
      }
    }
  }

  constructor() {
    super();
    this.error = '';
    this.id = '';
    this.hydrated = true;
  }

  // __increment() {
  //   this.counter += 1;
  // }

  // connectedCallback() {
  //   super.connectedCallback();
  // }
  
  firstUpdated() {
    super.firstUpdated();
    // get reference to the input field
    const input = this.querySelector('input');
    // get id of input field
    const id = input.getAttribute('id');
    // generate id for error message
    this.id = `${id}-error`;
    // link input field to error message field
    input.setAttribute('aria-describedby', this.id);
  }

  render() {
    return html`
      <span id=${this.id}>${this.error}</span>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

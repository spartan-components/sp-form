import { LitElement, html } from 'lit';

export class SpForm extends LitElement {

  static properties = {
    _form: {
      state: true
    }
  }

  firstUpdated() {

    const slot = this.shadowRoot.querySelector('slot');
    const children = slot.assignedElements({ flatten: true });
    const form = children[0];

    if (form.tagName !== 'FORM') {
      throw new Error('Only form allowed as child');
    }

    if (children.length > 1) {
      throw new Error('Only one child allowed');
    }

    this._form = form;

    form.setAttribute('novalidate', true);

    let inputs = form.querySelectorAll('input, textarea');

    inputs = Array.from(inputs);

    inputs = inputs.map(input => {
      const type = input.getAttribute('type');
      let label;
      if (type === 'radio') {
        const parent = input.closest('fieldset');
        label = parent.querySelector('legend');
      } else {
        label = document.querySelector(`label[for=${input.id}]`);
      }
      return {
        element: input,
        label
      }
    });

    inputs.forEach(input =>
      input.element.addEventListener('blur', event => {
      const field = event.target;
      const { valid } = field.validity;

      if (!valid) this.addErrorMessage({ input });
      if (valid) this.removeErrorMessage({ input });
    }));
  }

  addErrorMessage({ input }) {
    this.removeErrorMessage({ input });
    const { element, label } = input;
    const isRadio = element.getAttribute('type') === 'radio';
    const invalidationNode = isRadio ? element.closest('fieldset') : element;
    const identifier = isRadio ? element.getAttribute('name') : element.id;
    const errorId = `${identifier}-error`;
    invalidationNode.setAttribute('aria-invalid', true);
    invalidationNode.setAttribute('aria-describedby', errorId);

    const errorSpan = document.createElement('span');
    errorSpan.setAttribute('id', errorId);
    errorSpan.innerText = input.element.validationMessage;

    label.insertAdjacentElement('afterend', errorSpan);
  }

  removeErrorMessage({ input }) {
    const { element } = input;
    const isRadio = element.getAttribute('type') === 'radio';
    const invalidationNode = isRadio ? element.closest('fieldset') : element;
    const identifier = isRadio ? element.getAttribute('name') : element.id;
    const errorId = `${identifier}-error`;
    invalidationNode.removeAttribute('aria-invalid');
    invalidationNode.removeAttribute('aria-describedby');

    this._form.querySelector(`#${errorId}`)?.remove();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
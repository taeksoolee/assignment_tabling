const props = {
  text: 'text',
}

export default class PageTitle extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return Object.values(props);
  }

  connectedCallback() {
    this.render();
  }

  adoptCallback() { }

  async attributeChangedCallback(attrName, oldVal, newVal) {
    this.render();
  }

  render() {
    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerText = this.title;
    this.appendChild(title);
  }
}

window.customElements.define('page-title', PageTitle);
export default class PageBackground extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.render();
  }

  render() {
    console.log(this.slot);
  }
}

window.customElements.define('page-background', PageBackground);
class TabLink {
  constructor(element) {
    this.element = element;
    this.toggleBtn = document.querySelector('.top-toggle');
    this.dataset = element.dataset.tab;
    this.tabContentElem = document.querySelector(
      `.tab-content[data-tab="${this.dataset}"]`
    );
    this.tabContent = new TabContent(this.tabContentElem);

    // btns
    this.backBtn = element.querySelector('.back-btn.svg-icon');
    this.starBtn = element.querySelector('.star-btn.svg-icon');

    //Events
    this.element.addEventListener('click', this.select.bind(this));
    this.toggleBtn.addEventListener('click', this.toggle);
  }
  toggle() {
    const arrow = document.querySelector('.down-arrow svg');
    arrow.classList.toggle('active');
    const body = document.querySelector('.ref_body');
    body.classList.toggle('active');
  }
  select() {
    const tabs = document.querySelectorAll('.tablink');
    tabs.forEach(tab => tab.classList.remove('active'));
    this.element.classList.add('active');
    this.tabContent.select();
  }
}

class TabContent {
  constructor(element) {
    this.element = element;
  }
  select() {
    const tabCons = document.querySelectorAll('.tab-content');
    tabCons.forEach(tabCon => tabCon.classList.remove('active'));
    this.element.classList.add('active');
  }
}
const tabs = document.querySelectorAll('.tablink');
tabs.forEach(tab => new TabLink(tab));

import 'fpsmeter';

class Engine {
  constructor() {
    this.content = document.querySelector('.content');
    this.rendererLinks = this.content.querySelectorAll('.selector.renderer > a');
    this.countLinks = this.content.querySelectorAll('.selector.count > a');

    this.width = Math.min(this.content.clientWidth, 800);
    this.height = this.content.clientHeight * 0.75;

    this.initFpsmeter();

    this.rendered = '';
    this.count = 0;

    this.initSettings();
  }

  initFpsmeter() {
    this.meter = new window.FPSMeter(
      this.content, {
        graph: 1,
        heat: 1,
        theme: 'light',
        history: 25,
        top: 0,
        left: `${this.width}px`,
        transform: 'translateX(-100%)',
      },
    );
  }

  initSettings() {
    this.rendererLinks.forEach((link, index) => {
      if (link.classList.contains('selected')) {
        this.rendered = { index: index, name: link.innerText };
      }

      link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        this.rendererLinks[this.rendered.index].classList.toggle('selected', false);
        this.rendered = { index: index, name: link.innerText };
        this.rendererLinks[this.rendered.index].classList.toggle('selected', true);

        this.render();
      });
    });

    this.countLinks.forEach((link, index) => {
      if (link.classList.contains('selected')) {
        this.count = { index: index, value: parseInt(link.innerText) };
      }

      link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        this.countLinks[this.count.index].classList.toggle('selected', false);
        this.count = { index: index, value: parseInt(link.innerText) };
        this.countLinks[this.count.index].classList.toggle('selected', true);

        this.render();
      });
    });
  }

  render() {}
}

export default Engine;

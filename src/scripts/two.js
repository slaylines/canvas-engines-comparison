import 'fpsmeter';
import Two from 'two.js';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.content');
  const rendererLinks = content.querySelectorAll('.selector > a');
  const countInput = content.querySelector('.count input');

  const width = content.clientWidth * 0.5;
  const height = content.clientHeight * 0.75;

  const meter = new window.FPSMeter(
    content, {
      graph: 1,
      heat: 1,
      theme: 'light',
      history: 25,
      top: 0,
      left: `${width}px`,
      transform: 'translateX(-100%)',
    },
  );

  let two = null;
  let rendered = '';
  let count = 100;
  let speed = 0.1;

  const render = () => {
    if (two) {
      two.unbind('update');
      two.clear();
      Two.Utils.release(two);
      two.renderer.domElement.remove();
    }

    two = new Two({
      width,
      height,
      type: Two.Types[rendered.name],
      autostart: true,
    }).appendTo(content);

    const rects = [...Array(count).keys()].map(i => {
      const x = Math.random() * two.width;
      const y = Math.random() * two.height;
      const size = 10 + Math.random() * 40;

      return two.makeRectangle(x, y, size, size);
    });

    two.bind('update', () => {
      rects.forEach(r => r.rotation += speed);
      meter.tick();
    });
  };

  rendererLinks.forEach((link, index) => {
    if (link.classList.contains('selected')) {
      rendered = { index: index, name: link.innerText };
    }

    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      rendererLinks[rendered.index].classList.toggle('selected', false);
      rendered = { index: index, name: link.innerText };
      rendererLinks[rendered.index].classList.toggle('selected', true);
      render();
    });
  });

  countInput.value = count;
  countInput.addEventListener('change', () => {
    count = parseInt(countInput.value);
    render();
  });

  render();
});

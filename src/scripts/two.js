import Two from '../../node_modules/two.js/build/two.min.js';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.content');
  const rendererLinks = content.querySelectorAll('.selector > a');

  const width = content.clientWidth * 0.5;
  const height = content.clientHeight * 0.75;

  let two = null;
  let rendered = '';
  let count = 100;

  const render = () => {
    if (two) {
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

      return {
        speed: Math.random(),
        element: two.makeRectangle(x, y, size, size),
      };
    });

    two.bind('update', () => {
      rects.forEach(r => r.element.rotation += r.speed);
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

  render();
});

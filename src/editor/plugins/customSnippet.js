const plugin = {};

const addEvent = (editor) => {
  const customFieds = document.querySelector('span.ql-custom_snippet');
  const label = customFieds.querySelector('.ql-picker-label');
  const fields = customFieds.querySelectorAll('.ql-picker-item');

  let range;

  label.addEventListener('mousedown', (event) => {
    range = editor.getSelection();
    event.preventDefault();
  });

  [...fields].forEach((field) => {
    field.addEventListener('click', (event) => {
      const item = event.target;
      const trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (item == null) return;
      if (trigger) {
        if (typeof Event === 'function') {
          item.dispatchEvent(new Event('change'));
        }
        item.parentNode.parentNode.classList.remove('ql-expanded');
        item.setAttribute('aria-expanded', 'false');
        item.setAttribute('aria-hidden', 'true');
        editor.emitter.emit('text-change');
      }
    });
    field.addEventListener('mousedown', (event) => {
      if (!range) return;
      const element = event.target;

      if (element) {
        const { index, length } = range;
        if (length === 0) {
          return;
        }
        const value = element.getAttribute('data-css');
        let text = '';

        text = editor.getText(index, length);
        const localName = window.getSelection().anchorNode.parentElement.localName;
        if (localName === 'a') {
          window.getSelection().anchorNode.parentElement.setAttribute('class', value);
          return;
        }
        editor.deleteText(index, length);
        const delta = {
          ops: [
            { retain: index > 0 ? index : index + 1 },
            { insert: text, attributes: { link: '#' } },
          ],
        };
        editor.updateContents(delta);
        if (index === 0) {
          editor.deleteText(index, 1);
        }
        if (window.getSelection().getRangeAt(0).startContainer.nextSibling) {
          window.getSelection().getRangeAt(0).startContainer.nextSibling.setAttribute('class', value);
          return;
        }
        window.getSelection().getRangeAt(0).startContainer.parentNode.setAttribute('class', value);
      }
    });
  });
};

export const fillSnippets = (editor, snippets) => {
  const optionsElement = document.querySelector('span.ql-custom_snippet > span.ql-picker-options');

  snippets.forEach((snippet) => {

    const newSpan = document.createElement('span');

    newSpan.className = 'ql-picker-item';
    newSpan.innerText = snippet.name;
    newSpan.setAttribute('data-value', snippet.name);
    newSpan.setAttribute('data-css', snippet.css_class);
    newSpan.setAttribute('role', 'button');
    newSpan.setAttribute('tabindex', 0);

    optionsElement.appendChild(newSpan);
  });

  addEvent(editor);
};

plugin.name = 'customSnippet';

plugin.instance = addEvent;

export default plugin;

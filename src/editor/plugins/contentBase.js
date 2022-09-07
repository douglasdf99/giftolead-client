export default (options = {}) => {
  const { editor, styleKey, key } = options;
  const customFieds = document.querySelector(`span.ql-${key}`);
  const label = customFieds.querySelector('.ql-picker-label');
  const fields = customFieds.querySelectorAll('.ql-picker-item');

  editor.emitter.on('text-change', () => {
    label.dataset.value = options.onTextChange(editor.root.style[styleKey]);
  });

  Array.from(fields).forEach((field) => {
    field.addEventListener('mousedown', (event) => {
      editor.root.style[styleKey] = options.onMouseDown(event.currentTarget.dataset.value);

      editor.emitter.emit('text-change');
    });
  });
};


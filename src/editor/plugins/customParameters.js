const plugin = {};

plugin.name = 'customParameters';

plugin.instance = (editor) => {
  const customFieds = document.querySelector('span.ql-custom_parameters');
  const label = customFieds.querySelector('.ql-picker-label');
  const fields = customFieds.querySelectorAll('.ql-picker-item');
  let lastIndex;

  label.addEventListener('mousedown', (event) => {
    const range = editor.getSelection();
    event.preventDefault();

    if (range) {
      lastIndex = range.index;
    }
  });

  Array.from(fields).forEach((field) => {
    field.addEventListener('mousedown', (event) => {
      const element = event.target;
      let value;

      if (element && lastIndex) {
        value = element.getAttribute('data-value');
        editor.insertText(lastIndex, `%Subscriber:${value}%`);
      }
    });
  });
};

export default plugin;

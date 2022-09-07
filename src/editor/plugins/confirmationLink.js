import i18n from '../../i18n/i18n.js';

const plugin = {};

plugin.name = 'confirmationLink';

plugin.instance = (editor) => {
  const element = document.querySelector('.ql-confirmation_link');

  element.addEventListener('mousedown', () => {
    const range = editor.getSelection();
    const { index, length } = range;
    let text = i18n.t('email.editor.confirmation_link');

    if (length > 0) {
      text = editor.getText(index, length);
      editor.deleteText(index, length);
    }

    editor.insertText(
      index,
      text,
      'link',
      '%Link:Confirmation%',
    );
  });
};

export default plugin;

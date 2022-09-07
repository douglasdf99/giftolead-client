import ImageHandler from '../handlers/image';

const plugin = {};

plugin.name = 'customSignatureLogo';

plugin.instance = (editor) => {
  const element = document.querySelector('.ql-custom_signature_logo');

  element.addEventListener('mousedown', () => {
    const imageHandler = ImageHandler(editor, true);
    imageHandler.callback();
  });
};

export default plugin;

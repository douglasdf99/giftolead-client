import base from './contentBase';

const plugin = {};

plugin.name = 'contentWidth';

plugin.instance = (editor) => {
  const onTextChange = maxWidth => maxWidth || 'no_content_width_limit';
  const onMouseDown = value => (value === 'no_content_width_limit' ? null : value);

  base({
    key: 'content_width',
    styleKey: 'maxWidth',
    editor,
    onTextChange,
    onMouseDown,
  });
};

export default plugin;

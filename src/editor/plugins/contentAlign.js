import base from './contentBase';

const plugin = {};

const alignTypes = {
  '0 auto': 'email_on_center',
  0: 'email_on_left',
};

plugin.name = 'contentAlign';

plugin.instance = (editor) => {
  const onTextChange = margin => alignTypes[margin.replace('px', '')] || 'email_on_left';
  const onMouseDown = value => (value === 'email_on_center' ? '0 auto' : '0');

  base({
    key: 'content_align',
    styleKey: 'margin',
    editor,
    onTextChange,
    onMouseDown,
  });
};

export default plugin;

import Quill from 'quill';

import ImageResize from './plugins/imageResizer/ImageResize';
import LogoImage from './plugins/logoImage/LogoImage';
import handlers from './handlers';
import plugins from './plugins';

import {toolbar, fontSize, fontFamily} from './config';

export default (options = {}) => {
	const Align = Quill.import('attributors/style/align');
	const Font = Quill.import('attributors/style/font');
	const Size = Quill.import('attributors/style/size');

	Quill.register('modules/imageResize', ImageResize);
	Quill.register({'formats/logoImage': LogoImage});

	let debounce;

	Font.whitelist = fontFamily;
	Size.whitelist = fontSize;

	Quill.register(Align, true);
	Quill.register(Font, true);
	Quill.register(Size, true);

	const editor = new Quill(options.element, {
		theme: 'snow',
		modules: {
			toolbar: toolbar(),
			imageResize: {},
		},
	});

	editor.on('text-change', () => {
		if (debounce) {
			clearTimeout(debounce);
		}

		debounce = setTimeout(() => {
			options.onChange(editor.container.firstChild.innerHTML, editor.container.firstChild);
		}, 500);
	});

	editor.once('text-change', () => {
		options.onReady(editor);
	});

	handlers.forEach((handler) => {
		const instance = handler(editor);

		editor.getModule('toolbar').addHandler(instance.name, instance.callback);
	});

	plugins.forEach((plugin) => {
		plugin.instance(editor);
	});

	return editor;
};

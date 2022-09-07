export default (editor, isLogo = false) => {
	/*const addToEditor = (imageUrl) => {
		const range = editor.getSelection();

		const format = isLogo ? 'logoImage' : 'image';

		editor.insertEmbed(range.index, format, `https://${imageUrl}`);
	};*/

	const uploadImage = (image) => {
		const data = new FormData();
		data.editor = editor;
		data.isLogo = isLogo;

		data.append('attachment[image]', image);

		// axios.post(data)
		// 	.then((response) => {
		// 		addToEditor(response.data.url);
		// 	}).catch((error) => {
		// 	let message = 'Não foi possível realizar o upload da imagem. ';
		//
		// 	if (error.response && error.response.status === 422) {
		// 		message += 'Arquivos permitidos: .jpg, .jpeg, .gif, .png';
		// 	}
		//
		// 	this.$vs.notify({
		// 		title: 'Error',
		// 		text: message,
		// 		iconPack: 'feather',
		// 		icon: 'icon-alert-circle',
		// 		color: 'danger'
		// 	})
		// });
	};

	const callback = () => {
		const input = document.createElement('input');

		input.setAttribute('type', 'file');
		input.click();

		input.onchange = () => {
			const file = input.files[0];

			if (/^image\//.test(file.type)) {
				return uploadImage(file);
			}

			return null;
		};
	};

	return {
		name: 'image',
		callback,
	};
};

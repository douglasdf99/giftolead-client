<template>
	<div>
		<div :id="'editor-' + $route.params.id" class="bg-white border-none"/>
	</div>
</template>

<script>
import editor from '@/editor';

export default {
	name: "Editor",
	props: ['content', 'changed'],
	data() {
		return {
			options: {
				modules: {
					toolbar: '#toolbar'
				},
				placeholder: 'Componha a mensagem',
				readOnly: false,
				theme: 'snow'
			},
		};
	},
	async mounted() {
		this.editor = document.querySelector('#editor-' + + this.$route.params.id);

		await this.createEditor();
		if (this.content) {
			this.loadContent(this.content, this.editor);
		}
	},
	methods: {
		createEditor() {
			return editor({
				element: this.editor,
				onChange: (text, container) => {
					const content = document.createElement('div');
					const {maxWidth, margin} = container.style;

					content.style.maxWidth = maxWidth;
					content.style.margin = margin;
					content.innerHTML = text;
					content.classList.add('email-content');

					this.$emit('changed', content.outerHTML);
				},
				onReady: (editor) => {
					this.$emit('ready', editor);
				}
			});
		},
		loadContent: (value, element) => {
			const editor = element.querySelector('.ql-editor');

			if (!editor) {
				return;
			}

			const contentWrapper = document.createElement('div');

			contentWrapper.innerHTML = value;

			const editorContent = contentWrapper.querySelector('.email-content');

			if (!editorContent) {
				editor.innerHTML = value;
				return;
			}

			const {maxWidth, margin} = editorContent.style;

			editor.style.maxWidth = maxWidth;
			editor.style.margin = margin;
			editor.innerHTML = editorContent.innerHTML;
		},
	}
};
</script>

<style>
.ql-toolbar.ql-snow {
	margin-top: 1rem;
	background: white;
}
</style>

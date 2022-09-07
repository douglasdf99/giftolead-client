const contentWidth = [
	'no_content_width_limit',
	'400px',
	'500px',
	'600px',
	'700px',
	'800px',
];

const contentAlign = [
	'email_on_left',
	'email_on_center',
];

export const fontSize = [
	'8px',
	'9px',
	'10px',
	'11px',
	'12px',
	'14px',
	'18px',
	'24px',
	'30px',
	'36px',
	'48px',
	'60px',
	'72px',
	'96px',
];

export const fontFamily = [
	'Arial',
	'Comic Sans MS',
	'Courier New',
	'Georgia',
	'Lucida Sans Unicode',
	'Tahoma',
	'Times New Roman',
	'Trebuchet MS',
	'Verdana',
];

export const toolbar = () => {
	const customTools = {
		//customParameters: { custom_parameters: fields },
		contentWidth: {content_width: contentWidth},
		contentAlign: {content_align: contentAlign},
		//confirmationLink: 'confirmation_link',
		//customSignatureLogo: 'custom_signature_logo',
		//customSnippet: { custom_snippet: [] },
	};

	const tools = [
		[{font: fontFamily}],
		[{size: fontSize}],
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],
		[{'list': 'ordered'}, {'list': 'bullet'}],
		[{'indent': '-1'}, {'indent': '+1'}],
		[{'color': []}, {'background': []}],
		[{'align': []}],
		['link', 'image'],
		['clean']
	];

	Object.keys(customTools).forEach((key) => {
		tools.push([customTools[key]]);
	});

	return tools;
};

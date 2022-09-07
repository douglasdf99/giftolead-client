
export default {
	check: state => (value) => {
		return state.extensoes.find(element => element.type === value);
	}
};

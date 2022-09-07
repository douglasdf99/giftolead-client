export default {
	loggedIn(state) {
		return state.token != null;
	},
	menuClone(items) {
		let clone = items.slice();

		for (let [index, item] of items.entries()) {
			if (item.header && item.items.length && (index || 1)) {
				let i = clone.findIndex(ix => ix.header === item.header);
				for (let [subIndex, subItem] of item.items.entries()) {
					clone.splice(i + 1 + subIndex, 0, subItem);
				}
			}
		}
	}
};

export const subscribe = (feature) => {
	window.localStorage.setItem(`feature:${feature}`, true);
};

export const unsubscribe = (feature) => {
	window.localStorage.removeItem(`feature:${feature}`);
};

export const subscribed = (feature) => {
	return window.localStorage.getItem(`feature:${feature}`) ? true : false;
};

export const register = (features) => {
	window.features = {
		subscribe,
		unsubscribe,
		subscribed,
	};
	features.forEach((feature) => {
		subscribe(feature);
	});
};

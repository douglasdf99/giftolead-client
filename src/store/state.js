/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import navbarSearchAndPinList from "@/layouts/components/navbar/navbarSearchAndPinList";
import themeConfig from "@/../themeConfig.js";
import auth from "@/auth/authService";
import firebase from 'firebase/app';
import 'firebase/auth';
import paginas from "@/paginas";

const userDefaults = {
	uid: 0,          // From Auth
	displayName: "John Doe", // From Auth
	about: "",
	email: "",
	photoURL: null, // From Auth
	status: "online",
	userRole: "Administrador",
	menu_rapido:'[]'
};

const userInfoLocalStorage = JSON.parse(localStorage.getItem("userInfo")) || {};

// Set default values for active-user
// More data can be added by auth provider or other plugins/packages
const getUserInfo = () => {
	let userInfo = {};

	// Update property in user
	Object.keys(userDefaults).forEach((key) => {
		// If property is defined in localStorage => Use that
		userInfo[key] = userInfoLocalStorage[key] ? userInfoLocalStorage[key] : userDefaults[key];
	});

	// Include properties from localStorage
	Object.keys(userInfoLocalStorage).forEach((key) => {
		if (userInfo[key] == undefined && userInfoLocalStorage[key] != null) userInfo[key] = userInfoLocalStorage[key];
	});

	return userInfo;
};

// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////
let pages = paginas.pages;
if (localStorage.getItem('userInfo')) {
	let user = JSON.parse(localStorage.getItem('userInfo'));
	pages = JSON.parse(user.menu_rapido);
}

const state = {
	route:'teste',
	AppActiveUser: getUserInfo(),
	bodyOverlay: false,
	isVerticalNavMenuActive: true,
	isVerticalNavMenuActive2: true,
	mainLayoutType: themeConfig.mainLayoutType || "vertical",
	navbarSearchAndPinList: navbarSearchAndPinList,
	reduceButton: themeConfig.sidebarCollapsed,
	verticalNavMenuWidth: "default",
	verticalNavMenuItemsMin: false,
	scrollY: 0,
	starredPages: pages.filter((page) => page.is_bookmarked),
	pages: pages,
	theme: themeConfig.theme || "light",
	themePrimaryColor: "#181830",
	animacaoMenu: '',
	menuAtivo: true,
	menuSelecionado: '',
	submenu: {},
	items: [],
	pagination: {},
	urlBack: 'home',
	// Can be used to get current window with
	// Note: Above breakpoint state is for internal use of sidebar & navbar component
	windowWidth: null,
	token: localStorage.getItem("accessToken") || null,
	//mainMenu: [...navMenuItems],
	isUserLoggedIn: () => {
		let isAuthenticated = false;

		// get firebase current user
		const firebaseCurrentUser = firebase.auth().currentUser;

		if (auth.isAuthenticated() || firebaseCurrentUser) isAuthenticated = true;
		else isAuthenticated = false;

		return (localStorage.getItem('userInfo') && isAuthenticated);
	},
	globalSearch: '',
	extensoesState: {
		melhorEnvio: {installed: false},
		slack: {installed: false},
		zenvia: {installed: false}
	}
};

export default state;

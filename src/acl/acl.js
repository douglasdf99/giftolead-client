import Vue from "vue";
import {AclCreate, AclInstaller, AclRule} from "vue-acl";
import store from '../store/store';
import router from "@/router";

Vue.use(AclInstaller);

let initialRole = "public";

let userInfo = store.getters.getUserInfoLocalStorage();
if (userInfo && userInfo.userRole) initialRole = userInfo.userRole;

let permissoes = store.getters.getPermissionsLocalStorage();

if (!permissoes) {
	permissoes = {};
	permissoes['Administrador'] = new AclRule("Administrador").generate();
	permissoes['editor'] = new AclRule("editor").generate();
	permissoes['public'] = new AclRule("public").or("Administrador").or("editor").generate();
}


export default new AclCreate({
	initial: initialRole,
	notfound: "/nao-autorizado",
	router,
	acceptLocalRules: true,
	globalRules: permissoes
});



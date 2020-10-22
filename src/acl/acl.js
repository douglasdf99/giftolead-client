import Vue from "vue"
import {AclCreate, AclInstaller, AclRule} from "vue-acl"
import router from "@/router"

Vue.use(AclInstaller)

let initialRole = "public";

let userInfo = JSON.parse(localStorage.getItem("userInfo"));
if (userInfo && userInfo.userRole) initialRole = userInfo.userRole;

let permissoes = null;

permissoes = JSON.parse(localStorage.getItem("permissoes"));

if (!permissoes){
  permissoes = {};
  permissoes['Administrador']= new AclRule("Administrador").generate();
//permissoes['configuracao']= new AclRule("Administrador").generate();
  permissoes['editor']= new AclRule("Administrador").generate();

  permissoes['public'] = new AclRule("public").or("Administrador").or("editor").generate()
}


console.log('permissoes no acl',permissoes)


export default new AclCreate({
        initial: initialRole,
        notfound: "/nao-autorizado",
        router,
        acceptLocalRules: true,
        // globalRules: {
        //     Administrador: new AclRule("Administrador").generate(),
        //     configuracao: new AclRule("Administrador").generate(),
        //     editor: new AclRule("editor").or("Administrador").generate(),
        //     public: new AclRule("public").or("Administrador").or("editor").generate(),
        //
        // }
        globalRules:permissoes,

    });



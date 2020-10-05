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
}
permissoes['admin']= new AclRule("admin").generate();
//permissoes['configuracao']= new AclRule("admin").generate();
permissoes['editor']= new AclRule("admin").generate();
permissoes['public']= new AclRule("public").or("admin").or("editor").generate()
console.log('permissoes no acl',permissoes)


// function getPermissoes() {
//     return new Promise(resolve => {
//         axios.get('/permissions').then(response => {
//             console.log('permissions_banco', response.data.data);
//             response.data.data.forEach(item => {
//                 if (item.permission_role.length > 0) {
//                     var ac = new AclRule('admin');
//                     item.permission_role.forEach(perfil => {
//                         ac = ac.or(perfil.role.nome)
//                     });
//                     permissoes[item.name] = ac.generate();
//                     //permissoes.push({'permissao':item.name, 'funcoes':ac.generate()});
//                 }
//                 else {
//                     permissoes[item.name] = new AclRule('admin').generate();
//                     //permissoes.push({'permissao':item.name, 'funcoes':new AclRule('admin').generate()});
//                 }
//             });
//             console.log('permissoes', permissoes);
//
//             resolve(permissoes)
//         })
//     })
// }
// getPermissoes();


export default new AclCreate({
        initial: initialRole,
        notfound: "/nao-autorizado",
        router,
        acceptLocalRules: true,
        // globalRules: {
        //     admin: new AclRule("admin").generate(),
        //     configuracao: new AclRule("admin").generate(),
        //     editor: new AclRule("editor").or("admin").generate(),
        //     public: new AclRule("public").or("admin").or("editor").generate(),
        //
        // }
        globalRules:permissoes,

    });



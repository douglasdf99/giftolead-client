import sso, { bootstrap } from '@/auth/sso';
import store   from '@/store/store';
import router from '../../router';
import component from './Authorize';

export const COMPANY_CONTEXT_KEY    =           'companyContext';
export const USER_INFO_STORAGE_KEY    =           'userInfo';
export const PERMISSIONS_STORAGE_KEY  =         'permissoes';
export const ACCESS_TOKEN_STORAGE_KEY =        'accessToken';
export const SET_BEARER_EVENT         =     'auth/setBearer';
export const GET_USER_INFO_EVENT      =  'auth/getUserLogin';
export const GET_USER_PERMISSIONS     = 'auth/getPermissoes';
export const AuthorizerComponent      = component;
export const initAuthSSO   = async () =>{ 
  if (!store.state.token) {
    store.dispatch('auth/getUser')
      .then(() => {
      console.log('logado');
      }).catch(() => {
        router.push({name: 'login'});
      });
  } else{
    try {
      await authorizeUser(producer);
    }catch(error) {
      throw error;
    }
  }
};
export const getUserFromSSO  = () =>{ 
  return  sso.getUser();
};
export const redirectUserToSSO =       () =>   bootstrap.start();
export const authorizeUser  = async (ssoUser) => {
  await setAuthenticationHeaders(ssoUser);
  try {
    await loadUser(ssoUser);
  }catch(error) {
    throw error;
  }
};
export const traitContext = (slug) =>{
  if (getCompanyContext() !== slug) {
    console.log('context diferent',getCompanyContext() , slug );
    setCompanyContext(slug);
    cleanInfos();
  }else{
    console.log('context same',getCompanyContext() , slug );
  }
 
 // getCompanyContext();
};

export const logOut = () => {
  bootstrap.logout();
};

const loadUser = async ssoUser => {
    
  try {
    await loadUserInfo(ssoUser);
  }catch(error) {
    throw error;
  }
  
  if ( !getPermissionsFromStorage() ) {
    await loadUserPermissions(ssoUser);
    window.onload = (event) => {
      console.log('The page has fully loaded');
    };
    // router.go()
    goToCompanyContext();
    //router.push({name:'dashboard'});
    //window.location.reload(true);
  } 
  return getUserInfoFromStorage();
};
export const goToCompanyContext = () => {
  if (getCompanyContext())
    window.location.href= `/${getCompanyContext()}/dashboard`;
  else
    window.location.href= `/`;
};
export const removeCompanyContext = (slug) => localStorage.removeItem(COMPANY_CONTEXT_KEY);

const setCompanyContext = (slug) => localStorage.setItem(COMPANY_CONTEXT_KEY,slug);

export const getCompanyContext = () => localStorage.getItem(COMPANY_CONTEXT_KEY);
const getPermissionsFromStorage = () => localStorage.getItem(PERMISSIONS_STORAGE_KEY);
const getUserInfoFromStorage    = () => localStorage.getItem(USER_INFO_STORAGE_KEY);
const getAccessTokenFromSotrage = () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);


export const cleanInfos = () => {
  localStorage.removeItem(USER_INFO_STORAGE_KEY);
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
}; 


const loadUserInfo = ssoUser => store.dispatch( GET_USER_INFO_EVENT, ssoUser.id_token);
const loadUserPermissions = ssoUser => store.dispatch(GET_USER_PERMISSIONS, ssoUser.id_token);
const setAuthenticationHeaders = async ssoUser => {
  if ( !getAccessTokenFromSotrage() ) await store.dispatch(SET_BEARER_EVENT, ssoUser.id_token);
}; 
// const setAuthenticationHeaders  = ssoUser => console.log('dispatch',store.dispatch);

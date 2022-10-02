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
  if (!store.getters.getToken) {
        router.push({name: 'login'});
  } else{
    try {
      await authorizeUser();
    }catch(error) {
      throw error;
    }
  }
};

export const authorizeUser  = async () => {
  await setAuthenticationHeaders();
  try {
    await loadUser();
  }catch(error) {
    throw error;
  }
};
export const traitContext = (slug) =>{
  if (getCompanyContext() !== slug) {
    setCompanyContext(slug);
    cleanInfos();
  }else{
    getCompanyContext();
  }
 
 // getCompanyContext();
};

export const logOut = () => {
  //bootstrap.logout();
};

const loadUser = async () => {
    
  try {
    await loadUserInfo();
  }catch(error) {
    throw error;
  }
  
  if ( !getPermissionsFromStorage() ) {
    await loadUserPermissions();
    window.onload = (event) => {
      console.log('The page has fully loaded');
    };
    goToCompanyContext();
  } 
  return getUserInfoFromStorage();
};
export const goToCompanyContext = () => {
  if (getCompanyContext())
    window.location.href= `/${getCompanyContext()}/dashboard`;
  else
    window.location.href= `/`;
};
export const removeCompanyContext = () => localStorage.removeItem(COMPANY_CONTEXT_KEY);

const setCompanyContext = (slug) => localStorage.setItem(COMPANY_CONTEXT_KEY,slug);

export const getCompanyContext = () => localStorage.getItem(COMPANY_CONTEXT_KEY);
const getPermissionsFromStorage = () => localStorage.getItem(PERMISSIONS_STORAGE_KEY);
const getUserInfoFromStorage    = () => localStorage.getItem(USER_INFO_STORAGE_KEY);
const getAccessTokenFromSotrage = () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);


export const cleanInfos = () => {
  localStorage.removeItem(USER_INFO_STORAGE_KEY);
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
}; 


const loadUserInfo = () => store.dispatch( GET_USER_INFO_EVENT, store.state.token);
const loadUserPermissions = () => store.dispatch(GET_USER_PERMISSIONS, store.state.token);
const setAuthenticationHeaders = async () => {
  if ( !getAccessTokenFromSotrage() ) await store.dispatch(SET_BEARER_EVENT, store.state.token);
}; 
// const setAuthenticationHeaders  = ssoUser => console.log('dispatch',store.dispatch);

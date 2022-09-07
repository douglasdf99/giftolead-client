import AuthService, { Bootstrap } from '@hotmart/cas-js';

const DEFAULT_SCOPE = ["openid","profile","email"];


const authService = new AuthService({
  env: process.env.VUE_APP_NODE_ENV === 'production' ? 'production' : 'development',
  client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
  scope: DEFAULT_SCOPE,
});

const bootstrapConfig = { revalidateOnFocus: false };

const bootstrap = new Bootstrap(authService,bootstrapConfig);

export { bootstrap };

export default authService;
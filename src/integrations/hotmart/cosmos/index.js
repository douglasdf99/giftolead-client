import components from './components';

window.cosmos = { tokens: [], components: [] };

const installHotmartCosmosTokens     = () => {
  const tokens = require('@hotmart/cosmos-tokens/dist/cosmos/base/json/web.json');
  window.cosmos.tokens = tokens;
};

const installHotmartCosmosStyles     = () => require('./styles');
const installHotmartCosmosComponents = () => window.cosmos['components'] = components;

export const defaultOptions = { tokens: true, styles: true, components: true };

const VueHotmartCosmosComponents = {
  install: async Vue => {
    await installHotmartCosmosComponents();
    if ( Vue.config.ignoredElements) Vue.config.ignoredElements = [];
    console.log('installlll', window.cosmos);
    Vue.config.ignoredElements.concat(window.cosmos.components);
    Vue.prototype.cosmos.components = window.cosmos.components;
  }
};

export const VueHotmartCosmosStyles = { install: async () => await installHotmartCosmosStyles() };

export const VueHotmartCosmosTokens = { 
  install: async Vue => {
    await installHotmartCosmosTokens();
    Vue.prototype.cosmos.tokens = window.cosmos.tokens;
  }
};


const VueHotmartCosmos = {
  install: async ( Vue, options = defaultOptions ) => {
    if ( options.components ) VueHotmartCosmosComponents.install(Vue);
    if ( options.styles )     VueHotmartCosmosStyles.install();
    if ( options.tokens )     VueHotmartCosmosTokens.install(Vue);
  }
};

export default VueHotmartCosmos;
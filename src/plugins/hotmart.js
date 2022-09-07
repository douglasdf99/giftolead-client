import cas, { bootstrap } from '@/auth/sso';
import components from '../integrations/hotmart/cosmos/components';

import baseWeb from '@hotmart/cosmos-tokens/dist/cosmos/base/json/web.json';
import baseFlat from '@hotmart/cosmos-tokens/dist/cosmos/base/json/web_flat.json';
import baseFull from '@hotmart/cosmos-tokens/dist/cosmos/base/json/web_full.json';
import darkWeb from '@hotmart/cosmos-tokens/dist/cosmos/dark/json/web.json';
import darkFlat from '@hotmart/cosmos-tokens/dist/cosmos/dark/json/web_flat.json';
import darkFull from '@hotmart/cosmos-tokens/dist/cosmos/dark/json/web_full.json';

import colors from "@/assets/utils/color";

import "@hotmart/cosmos/dist/structure";
import "@hotmart/cosmos/dist/header";
import "@hotmart/cosmos/dist/menu";
import "@hotmart/cosmos/dist/menu-item";
import "@hotmart/cosmos/dist/content";
import "@hotmart/cosmos/dist/content-menu";

import "@hotmart/cosmos/dist/styles/theme.css";
import "@hotmart/cosmos/dist/styles/reset.css";
import "@hotmart/cosmos/dist/styles/base.css";

const HotmartCasMethods = {
  login:  bootstrap.start,
  logout: bootstrap.logout
};

export const VueHotmartCAS = {

  install(Vue) {
    (
      async () => {
        const user = await cas.userManager.getUser();

        if ( !user ) {
          bootstrap.start();
        } else {
          Vue.prototype.hotmart = {
            auth: HotmartCasMethods
          };
        }
      }
    )();
  }
};

const cosmos = {
  tokens: {
    base: {
      flat: baseFlat,
      full: baseFull,
      web:  baseWeb,
    },
    dark: {
      flat: darkFlat,
      full: darkFull,
      web:  darkWeb,
    }
  }
};

export const VueHotmartCosmos = {
  install(Vue) {
    Vue.config.ignoredElements = components;
    Vue.prototype.tokens = cosmos.tokens;
    colors.setCssVariable('--primarylight', baseWeb.color.primary[100])
  }
};
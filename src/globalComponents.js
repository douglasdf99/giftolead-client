/*=========================================================================================
  File Name: globalComponents.js
  Description: Here you can register components globally
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue';
import VxTooltip from './layouts/components/vx-tooltip/VxTooltip.vue';
import VxCard  from './components/vx-card/VxCard.vue';
import VxList  from './components/vx-list/VxList.vue';
import VxBreadcrumb  from './layouts/components/VxBreadcrumb.vue';
import FeatherIcon  from './components/FeatherIcon.vue';
import VxInputGroup  from './components/vx-input-group/VxInputGroup.vue';
import footerSave  from './components/actionbar/DougAction.vue';
import nenhumregistro  from './views/components/NenhumRegistro';
import CustomPopup from "@/components/CustomPopup";
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component(VxTooltip.name, VxTooltip);
Vue.component(VxCard.name, VxCard);
Vue.component(VxList.name, VxList);
Vue.component(VxBreadcrumb.name, VxBreadcrumb);
Vue.component(FeatherIcon.name, FeatherIcon);
Vue.component(VxInputGroup.name, VxInputGroup);
Vue.component('footer-doug', footerSave);
Vue.component('nenhum-registro', nenhumregistro);
Vue.component("custom-popup", CustomPopup);


// v-select component
import vSelect from 'vue-select';

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'XIcon',
        svgClasses: 'w-4 h-4 mt-1'
      }
    }),
  },
  OpenIndicator: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'ChevronDownIcon',
        svgClasses: 'w-5 h-5'
      }
    }),
  },
});

Vue.component(vSelect);

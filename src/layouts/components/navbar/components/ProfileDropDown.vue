<template>
    <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">
      <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
        <div class="flex items-center">
          <div class="con-img mr-3">
          <vs-avatar
            color="primary"	
            size="40px"
            :text="activeUserInfo.displayName"
          />
          </div>
          <div class="text-left leading-tight hidden sm:block">
              <p class="font-semibold">{{ activeUserInfo.displayName }}</p>
              <p class="text-sm">{{ activeUserInfo.userRole }}</p>
          </div>
        </div>
        <vs-dropdown-menu class="vx-navbar-dropdown">
          <ul style="min-width: 9rem">
            <!-- <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/perfil')">
              <feather-icon icon="UserIcon" svgClasses="w-4 h-4"/>
              <span class="ml-2">Perfil</span>
            </li> -->
            <!-- <vs-divider class="m-1"/> -->
            <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logout">
              <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"/>
              <span class="ml-2">Logout</span>
            </li>
          </ul>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>
</template>

<script>
//import SSO from '@/auth/sso';
import authService from '@/auth/authService';

export default {
    data() {
        return {};
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.AppActiveUser;
        }
    },
    methods: {
        logout() {
          authService.logOut();
          this.$router.push('/login');
        },
    }
};
</script>

<template>
  <home-user-page v-if="isLoggedIn()"></home-user-page>
  <home-guest-page v-else></home-guest-page>
</template>

<script setup>
import {useUserStore} from "@/store/user.store.js";
import HomeGuestPage from "@/views/HomeGuestPage.vue";
import HomeUserPage from "@/views/HomeUserPage.vue";

const userStore = useUserStore();
const isLoggedIn = () => userStore.isLoggedIn;
</script>

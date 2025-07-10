<template>
  <svg
      viewBox="0 0 500 500"
      fill="none"
      v-bind="props"
  >
    <path
        :stroke="color"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="12"
        d="M302.21 108c0 70.86-105.21 70.86-105.21 141.71 0 70.86 105.21 70.86 105.21 141.71"
    />
    <path
        :stroke="color"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="12"
        d="M197 108c0 70.86 105.21 70.86 105.21 141.71 0 70.86-105.21 70.86-105.21 141.71"
    />
    <path
        :stroke="color"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="6"
        d="M201.85 249.71h95.5M206.51 282.72h87.58M210.41 351.29h77.41M201.85 379.04h95.5M201.85 120.38h95.5M210.41 148.13h77.41M201.85 218.97h95.5"
    />
  </svg>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "adn-icon",
  props: {
    color: {
      type: String,
      default: "#EB2726",
    },
    props: Object,
  },
});
</script>

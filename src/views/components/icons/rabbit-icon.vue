<template>
  <svg
      viewBox="0 0 500 500"
      fill="none"
      v-bind="props"
  >
    <path
        :stroke="color"
        stroke-linejoin="round"
        stroke-width="7"
        d="M203.29 192.51s-68.87-8.68-82.29 63.77c10.78 37.12 102.41 30.41 107.33-7.16 4.92-37.57 0-39.36 0-39.36S303.01 179.8 294.07 85c-38.91 16.1-58.58 29.43-90.78 107.51Z"
    />
    <path
        :fill="color"
        d="M181.78 227.66c0 5.9-4.78 10.69-10.69 10.69-5.9 0-10.69-4.78-10.69-10.69 0-5.91 4.78-10.69 10.69-10.69 5.9 0 10.69 4.78 10.69 10.69Z"
    />
    <path
        :stroke="color"
        stroke-miterlimit="10"
        stroke-width="7"
        d="M291.84 89.48s-33.54 82.64-67.53 103.04M171.09 282.67s-12.88 21.02-10.69 38.46c2.19 17.44 25.44 38.46 23.21 54.56-2.24 16.1-16.55 19.23-25.49 23.7-8.94 4.47-6.71 15.92 4.92 15.92h34.88s9.69-.72 9.99-14.13c.3-13.42 7.45-24.15 11.03-31.75 3.58-7.6 6.26-23.25 0-38.01"
    />
    <path
        :stroke="color"
        stroke-miterlimit="10"
        stroke-width="7"
        d="m220.67 264.06 5.74 6.84a6.755 6.755 0 0 0 5.92 2.38c19.48-2.15 112.73-8.41 114.96 68.58v.58c-1.64 36.39-5.83 46.26-16.56 51.77-2.21 1.14-3.55 3.47-3.55 5.96v6.31a6.78 6.78 0 0 1-6.78 6.78h-90.78c-3.43 0-6.32-2.55-6.73-5.96-.6-5.05.34-11.49 9.03-11.49 6.48 0 14.42-.18 21.18-.38 5.44-.16 8.43-6.31 5.28-10.75-6.78-9.57-12.81-24.69-.3-40.29 20.8-25.94 50.76-17.89 50.76-17.89M213.37 380.53l25.07 16.45"
    />
    <path
        :fill="color"
        d="M379.45 362.34c0 13.08-10.6 23.68-23.68 23.68-3.34 0-11.15-2.49-13.05-7.09-2.02-4.9 4.59-10.06 5.13-16.59.93-11.33-2.14-23.68 2.46-23.68 13.08 0 29.14 10.6 29.14 23.68Z"
    />
  </svg>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "rabbit-icon",
  props: {
    color: {
      type: String,
      default: "#EB2726",
    },
    props: Object,
  },
});
</script>

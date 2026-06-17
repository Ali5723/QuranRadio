<script setup>
import { Heart, Play } from "@lucide/vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  isArLang: {
    type: Boolean,
    required: true,
  },
  favoriteList: {
    type: Array,
    required: true,
  },
  favoritePass: {
    type: Function,
    required: true,
  },
});

function handleClick() {
  props.favoritePass(props.title)
}
</script>

<template>
  <div class="card">
    <div>
      <h2>{{ title }}</h2>
      <Heart :class="favoriteList.includes(title) ? 'favorite' : ''" @click="handleClick" />
    </div>
    <button><Play /> {{ isArLang ? "تشغيل" : "Play" }}</button>
    <!-- ايقاف -->
  </div>
</template>

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
  mainId: {
    type: String,
    required: true,
  },
  setPlay: {
    type: Function,
    required: true,
  },
});

function handleGo() {
  props.setPlay(props.mainId)
}
function handleFavorite() {
  props.favoritePass(props.mainId);
}
</script>

<template>
  <div class="card">
    <div>
      <h2>{{ title }}</h2>
      <Heart
        :class="favoriteList.includes(mainId) ? 'favorite' : ''"
        @click="handleFavorite"
      />
    </div>
    <button @click="handleGo"><Play /> {{ isArLang ? "تشغيل" : "Play" }}</button>
    <!-- ايقاف -->
  </div>
</template>

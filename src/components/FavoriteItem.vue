<script setup>
import { Pause, Play } from "@lucide/vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  run: {
    type: String,
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
</script>

<template>
  <div :class="['favorite-item', active ? 'active' : '']" @click="handleGo">
    <Pause v-if="active" /> <Play v-else /> {{ title }}
  </div>
</template>

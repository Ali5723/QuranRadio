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
    required: true
  }
});

function handleClick() {
console.log(props.run)
}
</script>

<template>
  <div :class="['favorite-item', active ? 'active' : '']" @click="handleClick">
    <Pause v-if="active" /> <Play v-else /> {{ title }}
  </div>
</template>

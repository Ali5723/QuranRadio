<script setup>
import { Mic, Pause, Play, Radio, Search, Volume2, VolumeX } from "@lucide/vue";
import { onBeforeMount, ref, watch } from "vue";
import { useDataStore } from "./stores/dataStore";
import { Moon } from "@lucide/vue";
import { Heart } from "@lucide/vue";
import FavoriteItem from "./components/FavoriteItem.vue";
import CardItem from "./components/CardItem.vue";

// import { useStream } from "@/composables/useStream";
// const stream = useStream();
// onMounted(() => {
//   stream.start("https://your-stream-url");
// });
// onUnmounted(() => {
//   stream.stop();
// });

let themeIcon = ref(Moon);
let langExt = ref("en");
let numberOfReciters = ref(0);
let cardsData = ref([]);

const apiPrefix = import.meta.env.VITE_API_PREFIX;
const dataStore = useDataStore();
onBeforeMount(async () => {
  await fetch("/src/assets/data.json")
    .then((res) => res.json())
    .then((res) => {
      dataStore.setData(res, localStorage);
    });
});
watch(
  () => dataStore.counter,
  () => {
    numberOfReciters.value = dataStore.numberOfReciters;
    themeIcon.value = dataStore.themeIcon;
    langExt.value = dataStore.langExt;
    cardsData.value = dataStore.cardsData;
  },
);
</script>

<template>
  <div>
    <header class="container">
      <div class="logoPart">
        <div class="logo">
          <Radio />
        </div>
        <h1>Quran Radio</h1>
        <p>Listen to the Holy Quran - {{ numberOfReciters }} reciters</p>
      </div>
      <div class="switchers">
        <div class="main-border" @click="dataStore.toggleTheme()">
          <component :is="themeIcon" />
        </div>
        <div class="main-border" @click="dataStore.toggleLang()">
          <p>{{ langExt }}</p>
        </div>
      </div>
      <div class="searchContainer">
        <Search />
        <input
          type="text"
          placeholder="Search reciters, styles, or origins…"
          class="main-border"
        />
      </div>
    </header>
    <hr />
    <main :class="['container', langExt === 'ar' ? 'rtl' : '']">
      <div class="favorites" v-if="dataStore.favorites.length">
        <h2>
          <Heart />
          Favorites
        </h2>
        <div class="favorite-items">
          <FavoriteItem
            v-for="(item, index) in dataStore.favorites"
            :title="item"
            :key="`${item}-${index}`"
            :run="item"
          />
        </div>
      </div>
      <div class="tags">
        <div
          :class="['tag', { active: dataStore.activeTag === item }]"
          v-for="(item, index) in dataStore.tags"
          :key="`${item}-${index}`"
          @click="dataStore.getTag(item)"
        >
          {{ item }}
        </div>
      </div>
      <div class="cards">
        <CardItem
          :is-ar-lang="langExt === 'ar'"
          v-for="(item, index) in cardsData"
          :key="`${item}-${index}`"
          :title="item"
          :favorite-list="dataStore.favorites"
          :favorite-pass="dataStore.toggleFavorite"
        />
      </div>
    </main>
    <footer v-show="false">
      <div class="logoPart">
        <div class="logo">
          <Mic />
        </div>
        <h2>Name</h2>
      </div>
      <div class="controllers">
        <Volume2 />
        <VolumeX />
        <div class="control">
          <Play />
          <Pause />
        </div>
      </div>
    </footer>
  </div>
</template>

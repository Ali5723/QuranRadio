<script setup>
import { Mic, Pause, Play, Radio, Search, Volume2, VolumeX } from "@lucide/vue";
import { computed, onBeforeMount, ref, watch } from "vue";
import { capitalize, useDataStore } from "./stores/dataStore";
import { Moon } from "@lucide/vue";
import { Heart } from "@lucide/vue";
import FavoriteItem from "./components/FavoriteItem.vue";
import CardItem from "./components/CardItem.vue";

import { useStream } from "./composables/useStream";
const stream = useStream();
let { playing } = stream;

let themeIcon = ref(Moon);
let langExt = ref("en");
let numberOfReciters = ref(0);
let cardsData = ref([]);
let isArLang = ref(false);
let theTitle = ref("");
let darkTheme = ref(false);

const dataStore = useDataStore();
onBeforeMount(async () => {
  await fetch("/data/data.json")
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
    isArLang.value = dataStore.arLang;
    theTitle.value = dataStore.theTitle;
    darkTheme.value = dataStore.darkTheme;
    if (darkTheme.value) {
      document.getElementById("app").classList.add("dark");
    } else {
      document.getElementById("app").classList.remove("dark");
    }
  },
);

function handleSearch(data) {
  cardsData.value = dataStore.cardsData
    .map((item) => item.toLowerCase())
    .filter((item) => item.includes(data.toLowerCase()))
    .map((item) =>
      item
        .split(" ")
        .map((cap) => capitalize(cap))
        .join(" "),
    );
}

function handlePlay() {
  if (playing.value) {
    stream.stop();
  } else {
    stream.start(dataStore.getLink(theTitle.value));
  }
}
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
          placeholder="Search reciters…"
          class="main-border"
          @keyup="handleSearch($event.target.value)"
        />
      </div>
    </header>
    <hr />
    <main :class="['container', isArLang ? 'rtl' : '']">
      <div class="favorites" v-if="dataStore.favorites.length">
        <h2>
          <Heart />
          {{ isArLang ? "المفضلة" : "Favorites" }}
        </h2>
        <div class="favorite-items">
          <FavoriteItem
            v-for="(item, index) in dataStore.allFavorites"
            :title="item"
            :key="`${item}-${index}`"
            :run="item"
            :main-id="`${dataStore.mainTag}-${dataStore.getIndex(dataStore.mainTag, item)}`"
            :set-play="dataStore.setPlay"
          />
        </div>
      </div>
      <div class="tags" v-if="false">
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
          :is-ar-lang="isArLang"
          v-for="(item, index) in cardsData"
          :key="`${item}-${index}`"
          :title="item"
          :favorite-list="dataStore.favorites"
          :favorite-pass="dataStore.toggleFavorite"
          :main-id="`${dataStore.mainTag}-${dataStore.getIndex(dataStore.mainTag, item)}`"
          :set-play="dataStore.setPlay"
        />
      </div>
    </main>
    <footer :class="isArLang ? 'rtl' : ''" v-show="Boolean(theTitle)">
      <div class="logoPart">
        <div class="logo">
          <Mic />
        </div>
        <h2>{{ dataStore.mainTitle(theTitle) }}</h2>
      </div>
      <div class="controllers">
        <div class="control" @click="handlePlay">
          <Pause v-if="playing" />
          <Play v-else />
        </div>
      </div>
    </footer>
  </div>
</template>

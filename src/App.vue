<script setup>
import {
  Mic,
  Moon,
  Pause,
  Play,
  Radio,
  Search,
  Volume2,
  VolumeX,
} from "@lucide/vue";
import { onBeforeMount, ref } from "vue";
import { useDataStore } from "./stores/dataStore";

let themeIcon = ref(Moon);
let langExt = ref("en");
let numberOfReciters = ref(0);

const apiPrefix = import.meta.env.VITE_API_PREFIX;
const dataStore = useDataStore();
onBeforeMount(async () => {
  await fetch("/src/assets/data.json")
    .then((res) => res.json())
    .then((res) => {
      dataStore.setData(res);
      numberOfReciters.value = dataStore.numberOfReciters;
    });
});
</script>

<template>
  <div>
    <header class="container">
      <div class="logoPart">
        <div class="logo"><Radio /></div>
        <h1>Quran Radio</h1>
        <p>Listen to the Holy Quran - {{ numberOfReciters }} reciters</p>
      </div>
      <div class="switchers">
        <div class="themeSwitcher main-border">
          <component :is="themeIcon" />
        </div>
        <div class="langSwitcher main-border">
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
    <main>
      <div class="favorites"></div>
      <div class="cardsContainer"></div>
    </main>
    <footer>
      <div class="logoPart">
        <div class="logo"><Mic /></div>
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

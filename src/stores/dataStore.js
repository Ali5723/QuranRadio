import { Moon, Sun } from "@lucide/vue";
import { defineStore } from "pinia";

const capitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};
const englishFormat = (text) => {
  return text
    .split("_")
    .map((item) => capitalize(item))
    .join(" ");
};

const enTags = ["reciters", "translation", "interpretation", "general"];
const arTags = ["القراء", "الترجمة", "التفسير", "عام"];

export const useDataStore = defineStore("data", {
  state: () => {
    return {
      data: {},
      darkTheme: false,
      arLang: false,
      favorites: [],
      activeTag: enTags[0],
      counter: 1,
    };
  },
  getters: {
    numberOfReciters: (state) => state.data["Reciters"]["url"].length,
    themeIcon: (state) => (state.darkTheme ? Sun : Moon),
    langExt: (state) => (state.arLang ? "ar" : "en"),
    tags: (state) => (state.arLang ? arTags : enTags),
    mainTag: (state) =>
      arTags.includes(state.activeTag)
        ? enTags[arTags.indexOf(state.activeTag)]
        : state.activeTag,
    cardsData: (state) =>
      state.arLang
        ? state.data[capitalize(state.mainTag)].ar
        : state.data[capitalize(state.mainTag)].en,
  },
  actions: {
    setData(data, ls) {
      this.data = data;
      ["darkTheme", "arLang", "favorites"].forEach((item) => {
        ls.getItem(item)
          ? (this[item] = JSON.parse(ls.getItem(item)))
          : ls.setItem(item, JSON.stringify(this[item]));
      });
      this.counter++;
      this.arLang ? (this.activeTag = arTags[0]) : "";
    },
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
      localStorage.darkTheme = this.darkTheme;
      this.counter++;
    },
    toggleLang() {
      this.arLang = !this.arLang;
      localStorage.arLang = this.arLang;
      this.activeTag = this.arLang
        ? arTags[enTags.indexOf(this.activeTag)]
        : enTags[arTags.indexOf(this.activeTag)];
      this.counter++;
    },
    getTag(tag) {
      this.activeTag = tag;
      this.counter++;
    },
    toggleFavorite(text) {
      let theFavorites = this.favorites;
      theFavorites.includes(text)
        ? (theFavorites = theFavorites.filter((item) => item !== text))
        : theFavorites.push(text);
      theFavorites.sort();
      this.favorites = theFavorites;
      localStorage.favorites = JSON.stringify(this.favorites);
    },
  },
});

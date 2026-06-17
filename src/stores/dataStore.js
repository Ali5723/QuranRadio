import { Moon, Sun } from "@lucide/vue";
import { defineStore } from "pinia";

export const capitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};
const englishFormat = (text) => {
  return text
    .split("_")
    .map((item) => capitalize(item))
    .join(" ");
};
const getItem = (data, item, langExt) =>
  data[capitalize(item.split("-")[0])][langExt][item.split("-")[1]];

const enTags = ["reciters", "translation", "interpretation", "general"];
const arTags = ["القراء", "الترجمة", "التفسير", "عام"];

const apiPrefix = import.meta.env.VITE_API_PREFIX;

export const useDataStore = defineStore("data", {
  state: () => {
    return {
      data: {},
      darkTheme: false,
      arLang: false,
      favorites: [],
      activeTag: enTags[0],
      counter: 1,
      theTitle: "",
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
    cardsData: (state) => state.data[capitalize(state.mainTag)][state.langExt],
    allFavorites: (state) =>
      state.favorites.map((item) => getItem(state.data, item, state.langExt)),
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
    getIndex(tag, item) {
      return this.data[capitalize(tag)][this.langExt].indexOf(item);
    },
    toggleFavorite(indexedTag) {
      let theFavorites = this.favorites;

      theFavorites.includes(indexedTag)
        ? (theFavorites = theFavorites.filter((item) => item !== indexedTag))
        : theFavorites.push(indexedTag);
      theFavorites.sort();
      this.favorites = theFavorites;
      localStorage.favorites = JSON.stringify(this.favorites);
    },
    mainTitle(item) {
      if (item) {
        return getItem(this.data, item, this.langExt);
      }
    },
    setPlay(text) {
      this.theTitle = text;
      this.counter++;
    },
    getLink(indexedTag) {
      return (
        apiPrefix +
        this.data[capitalize(indexedTag.split("-")[0])]["url"][
          indexedTag.split("-")[1]
        ]
      );
    },
  },
});

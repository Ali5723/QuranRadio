import { Moon, Sun } from "@lucide/vue";
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state: () => {
    return {
      loaded: false,
      data: {},
      darkTheme: false,
      arLang: false,
      favorites: [],
    };
  },
  getters: {
    numberOfReciters: (state) => state.data["Reciters"]["url"].length,
    themeIcon: (state) => (state.darkTheme ? Sun : Moon),
    langExt: (state) => (state.arLang ? "ar" : "en"),
  },
  actions: {
    async fetchData() {
      const data = await fetch("/src/assets/data.json")
        .then((res) => res.json())
        .then((res) => {
          this.setData(res, localStorage);
        });

      this.themeIcon = data.themeIcon;
      this.langExt = data.langExt;
      this.numberOfReciters = data.numberOfReciters;

      this.loaded = true;
    },
    setData(data, ls) {
      this.data = data;
      ["darkTheme", "arLang", "favorites"].forEach((item) => {
        ls.getItem(item)
          ? (this[item] = JSON.parse(ls.getItem(item)))
          : ls.setItem(item, JSON.stringify(this[item]));
      });
    },
    toggleTheme(themeIconRef) {
      this.darkTheme = !this.darkTheme;
      // console.log(themeIconRef)
      // console.log(this.themeIcon)
      themeIconRef = this.themeIcon;
      localStorage.darkTheme = this.darkTheme;
    },
  },
});

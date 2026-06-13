import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state: () => {
    return {
      data: {},
    };
  },
  getters: {
    numberOfReciters: (state) => state.data["Reciters"]["url"].length,
  },
  actions: {
    setData(data) {
      this.data = data;
    },
  },
});

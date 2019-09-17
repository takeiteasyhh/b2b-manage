import Vue from 'vue'
import Vuex from 'vuex'
import user from "./user"
import storeMap from "./store"

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
  },
  mutations: {
    
  },
  actions: {

  },
  modules:{
      user,
      storeMap
      
  }
})
export default store

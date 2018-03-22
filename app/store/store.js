import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0,
        show: false
    },
    mutations: {
        setCount(state) {
            state.count++
        },
        setMaskShow(state,flag) {
            state.show = flag
        }
    }
})
export default store
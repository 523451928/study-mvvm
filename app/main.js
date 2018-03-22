require('./styles/main.css')
require('./styles/index.scss')
import {MVVM} from './scripts/mvvm'
import Vue from "vue"
import VueRouter from 'vue-router'
import MintUi from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUi)
Vue.use(VueRouter)
import store from './store/store'
import App from './app.vue'
import FastClick from 'fastclick'
FastClick.attach(document.body)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/0' },
    { path: '/:status', component: require('./components/home.vue'), meta: { title: '交易管理-我的订单' } },
  ]
})
new Vue({
    el: '.app',
    store,
    render: (h) => h(App),
    router
})
function Promise(data) {
    this.data = data
}
Promise.prototype.then = function (fn) {
    fn(this.data)
}
Promise.resolve = function (data) {
    console.log(this)
    return new Promise(data)
}
var proResolve = Promise.resolve({name: 'resolve'})
var pro = new Promise({'name': 'pro'})
pro.then((res) => {
    console.log(res)
})
console.log(router)
var vm = new MVVM({
    el: '#mvvm-app',
    data: {
        someStr: 'hello ',
        className: 'btn',
        htmlStr: '<span style="color: #f00;">red</span>',
        child: {
            someStr: 'World !'
        },
        fontStyle: {
            'font-size': '14px'
        },
        infoShow: false,
        list: [
            1, 2, 3
        ]
    },

    computed: {
        getHelloWord() {
            return this.someStr + this.child.someStr;
        }
    },

    methods: {
        clickBtn: function (e) {
            var randomStrArr = ['childOne', 'childTwo', 'childThree'];
            this.child.someStr = randomStrArr[parseInt(Math.random() * 3)];
            this.infoShow = !this.infoShow
        }
    },
    mounted() {
        this.infoShow = true
        this.fontStyle = {
            'font-size': '18px'
        }
        // console.log(this.getHelloWord)
    }
});
console.log(vm)
vm.$watch('child.someStr', function (newVal, oldVal) {
    console.log(newVal);
    console.log(oldVal)
});

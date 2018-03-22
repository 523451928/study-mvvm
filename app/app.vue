<template>
  <div class="test">
    {{msg}}
    <p @click="say">set count</p>
    <home></home>
    <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    <router-view></router-view>
  </div>
</template>

<script>
  import home from './components/home.vue'
  import {mapMutations} from 'vuex'
  export default {
    data() {
      return {
        msg: 'webpack',
        slots: [
        {
          flex: 1,
          values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
          className: 'slot1',
          textAlign: 'right'
        }, {
          divider: true,
          content: '至',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
          className: 'slot3',
          textAlign: 'left'
        }
      ]
      }
    },
    methods: {
       onValuesChange(picker, values) {
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0])
        }
      },
      say() {
        console.log("hello")
      }
    },
    components: {
      home
    },
    mounted() {
    }
  }
</script>

<style>
  .test{
    color: #333;
  }
</style>
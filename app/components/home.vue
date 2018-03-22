<template>
  <div>
    {{msg}}
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        msg: 'hello vue-router'
      }
    },
    computed: {
        // ...mapState([
        //     "count"
        // ])
    },
    mounted() {
    }
  }
</script>
<template>
  <div id="app">
    <Snow
            :active="checked"
            zIndex="2"
            :wind='10'
            :swing='3'
            speed="m"
            color="#787878"/>
    <Navbar class="mb-3"/>

    <transition
            name="fade"
            mode="out-in"
    >
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import Navbar from './components/Navbar.vue'
  import Snow from 'vue-niege';
  import {serverBus} from "../src/main";
  export default {
    name: 'App',
    components: {
      Navbar,
      Snow


    },
    data(){
      return{
        checked: true,
      }
    },
    methods :{

    },
    created() {
      // Using the server bus to check an event
      serverBus.$on('activeSnow', (checked) => {
        this.checked = checked;
      });
    }

  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 auto;
    margin-top: 0px;
    width: 100%;
  }
  button {
    padding: 10px 20px;
    outline: none;
    background: #828ea0;
    color: #fff;
    font-size: 16px;
    margin: 5px;
    border: 0px;
  }
  button:hover {
    background: #a7aeb8;
    transition: background 0.2s;
  }
  button:active {
    color: rgb(117, 117, 117);
  }
  .btnActive {
    color: #6fcd98
  }
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
</style>

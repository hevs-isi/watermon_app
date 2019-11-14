<template>
  <div id="app">
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
  export default {
    name: 'App',
    components: {
      Navbar,
    },

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

/**
query : function() {
Promise.all([
client.query('SELECT "DistanceComputed" FROM "level-sensor-1" WHERE time>now()-1d'),
]).then(parsedRes => {
console.log(parsedRes);
const mutatedArray = parsedRes.map( arr => {
return Object.assign({}, {
name: "level-sensor-1",
data: arr.map( obj => Object.assign({}, {
x: (moment(obj.time).unix())*1000,
y: obj.DistanceComputed
}))
});
});
console.log(mutatedArray);
this.series = mutatedArray;
console.log(this.series);
return mutatedArray;
}).catch(error => console.log(error))
},
*/

methods : {
changeData: function() {
this.series = [{
name: "level-sensor-1",
data: [6,5,4,3,2,1]
}]
}
},

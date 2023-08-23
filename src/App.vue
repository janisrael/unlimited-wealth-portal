<template>
<div id="app">
  <index />
</div>
</template>

<script>
import Index from "./components/Index.vue";

export default {
  name: "App",
  components: {
    Index,
  },
  data() {
    return {
      ch1: this.$pnGetMessage('customers.001Ae000005mU49IAE.booking'),
    }
  },
  mounted() {

    this.$pnSubscribe({
      channels: ['customers.001Ae000005mU49IAE.booking']
    });
    // console.log(this.ch1, '-----published mounted-----');
    // console.log(this.$pnSubscribe({ channels: ['customers.001Ae000005mU49IAE.booking'] }),'sbscrube');
  },
  watch: {
    ch1: function () {
      // console.log(this.ch1, '-----published watching-----');
      let ch1 = this.ch1
      if (ch1.length > 0) {
        let userObj = JSON.parse(ch1[0].message);
        // console.log(userObj, 'userObj')
        this.$store
          .dispatch("updateBooking", userObj)
          // eslint-disable-next-line no-unused-vars
          .then((response) => {});
      }
    }
  }

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

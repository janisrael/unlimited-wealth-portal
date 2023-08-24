<template>
<div id="app">
  <index ref="indexComponent"/>
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
      //convert the parameter to dynamic customer id
      bookingChannel: 'customers.' + this.custoemr_id + '.booking',
      ch1: [],
      customer_id: sessionStorage.getItem("customer_id")
    }
  },
  computed: {
    _customer() {
      return this.$store.getters._customer;
    },
  },
  mounted() {
    console.log(sessionStorage.getItem("customer_id"),'_customer1')
    if(sessionStorage.getItem("customer_id")) {
      console.log('subscrive')
      this.$pnSubscribe({
        channels: ['customers.' + sessionStorage.getItem("customer_id") + '.booking']
      });

      this.ch1 = this.$pnGetMessage('customers.' + sessionStorage.getItem("customer_id") + '.booking',null, 1)
    }
  },
  watch: {
    ch1: function () {
      console.log(this.ch1, '-----published watching-----');
      let userObj = {}
      if (this.ch1.length > 0) {
        // get last object
        userObj = JSON.parse(this.ch1[0].message);
        console.log(userObj, 'userObj')
        if ( userObj.data.customer_id === this.customer_id  && (userObj.type  === 'booking.confirmed' || userObj.type === 'booking.failed' )) {
          // console.log('update Booking condition is true')
          this.$store
            .dispatch("updateBooking", userObj)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              // if(response.status === 200) {
                this.$refs.indexComponent.rebuild()
              // }
            });
        }

        // filter update booking by customer id


      }
      userObj = undefined
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

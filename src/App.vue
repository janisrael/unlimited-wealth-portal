<template>
  <div id="app">
    <index ref="indexComponent" />
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
      bookingChannel: "customers." + this.custoemr_id + ".booking",
      ch1: [],
      customer_id: sessionStorage.getItem("customer_id"),
    };
  },
  computed: {
    _customer() {
      return this.$store.getters._customer;
    },
  },
  mounted() {
    // console.log(sessionStorage.getItem("customer_id"), '_customer1')
    if (sessionStorage.getItem("customer_id")) {
      //   console.log("subscrive");
      this.$pnSubscribe({
        channels: [
          "customers." + sessionStorage.getItem("customer_id") + ".booking",
        ],
      });

      this.ch1 = this.$pnGetMessage(
        "customers." + sessionStorage.getItem("customer_id") + ".booking",
        null,
        1
      );
    }
  },
  watch: {
    ch1: function () {
      //   console.log(this.ch1, "-----published watching-----");
      let listenerRes = {};
      if (this.ch1.length > 0) {
        // get last object
        listenerRes = JSON.parse(this.ch1[0].message);
        console.log(listenerRes, "listenerRes");

        if (
          listenerRes.data.customer_id === this.customer_id &&
          (listenerRes.type === "booking.confirmed" ||
            listenerRes.type === "booking.failed")
        ) {
          if (listenerRes.type === "booking.failed") {
            let event_match = {};
            if (sessionStorage.getItem("pending_booking")) {
              let event_req = JSON.parse(
                sessionStorage.getItem("pending_booking")
              );
              event_match = event_req.find(
                (b) => b.event_id === listenerRes.data.event_id
              );
            }

            console.log(event_match, "ghj");
            this.$notify.error({
              title: "Booking Failed",
              dangerouslyUseHTMLString: true,
              message:
                "<p>Event name: " + "<strong>" + event_match.event_name
                  ? event_match.event_name
                  : listenerRes.data.event_type_name +
                    "</strong>" +
                    "<br>Start Date: " +
                    "<strong>" +
                    this.getFormatedDate(listenerRes.data.start_at.local) +
                    "</strong>" +
                    "</p>",
              duration: 5000,
            });
          }

          this.$store
            .dispatch("updateBooking", listenerRes)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              // if(response.status === 200) {
              this.$refs.indexComponent.rebuild();
              // }
            });
        }
        // filter update booking by customer id
      }
      listenerRes = undefined;
    },
  },
  methods: {
    getFormatedDate(date) {
      // console.log(date, "date");
      var d = new Date(date);
      var month = d.toLocaleString("default", {
        month: "short",
      });
      var time = d.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      var this_date = d.getDate();
      var dateExt = this.getDateExt(this_date);

      var formated_date = "";
      formated_date = this_date + dateExt + " " + month + " " + time;
      return formated_date;
    },
    getDateExt(date) {
      if (date > 3 && date < 21) return "th";
      switch (date % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
  },
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

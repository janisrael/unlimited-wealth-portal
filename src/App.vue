<template>
  <div id="app">
    <!-- {{ ch1 }} -->
    <index ref="indexComponent" />
  </div>
</template>

<script>
import Index from "./components/Index.vue";
/* eslint-disable */
export default {
  name: "App",
  components: {
    Index,
  },
  data() {
    return {
      customer_id: sessionStorage.getItem("customer_id"),
      data: {},
      category: "",
      triggerRebuild: null,
    };
  },
  mounted() {
    if (sessionStorage.getItem("customer_id")) {
      this.$pnSubscribe({
        channels: [
          "customers." + sessionStorage.getItem("customer_id") + ".booking",
        ],
      });

      this.$pnGetMessage(
        "customers." + sessionStorage.getItem("customer_id") + ".booking",
        this.receptor,
        10
      );

      this.$pnGetStatus(this.status);
    }
  },
  watch: {
    triggerRebuild: function () {
      if (
        this.triggerRebuild === "booking.failed" ||
        this.triggerRebuild === "booking.confirmed"
      ) {
        this.$refs.indexComponent.rebuild(this.triggerRebuild);
      }
    },
  },
  methods: {
    status(st) {
      this.category = st.category;
    },
    receptor(msg) {
      var listenerRes = {};
      listenerRes = JSON.parse(msg.message);

      var event_match = {};
      var event_req = [];
      console.log(listenerRes, "listenerResreceptor");
      var event_id = listenerRes.data.event_id;

      if (listenerRes) {
        let type = listenerRes.type;

        if (type === "booking.failed") {
          if (sessionStorage.getItem("pending_booking")) {
            event_req = JSON.parse(sessionStorage.getItem("pending_booking"));
            event_match = event_req.find((b) => b.event_id === event_id);
          }
          if (event_match) {
            this.$notify.error({
              title: "Booking Failed",
              dangerouslyUseHTMLString: true,
              message:
                "<p>Event name: " +
                "<strong>" +
                (!event_match.event_name
                  ? listenerRes.data.event_name
                  : event_match.event_name) +
                "</strong><br>Region: " +
                "<strong>" +
                event_match.region.toUpperCase() +
                "</strong></p>",
              duration: 5000,
            });
          }
        }
        if (type === "booking.confirmed") {
          alert("confirmed");
        }
        this.$store
          .dispatch("updateBooking", listenerRes)
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            this.triggerRebuild = type;
            listenerRes = undefined;
          });
      }
    },
    getFormatedDate(date) {
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
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

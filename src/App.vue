<template>
  <div id="app">
    <!-- {{ category }} -->
    <!-- hidden, use only to make use watch will trigger when data change -->
    <!-- <div class="watched_data_trigger">{{ triggerRebuild }}</div> -->
    <!--  -->
    <!-- <el-col :span="24"> -->
    <!-- <index ref="indexComponent" /> -->
    <component
      ref="modalComponent"
      :is="currentComponent"
      :token="token"
      @login="login"
    />
    <!-- </el-col> -->
  </div>
</template>

<script>
import Index from "./components/Index.vue";
import LoginComponent from "./components/LoginComponent.vue";
/* eslint-disable */
export default {
  name: "App",
  components: {
    Index,
    LoginComponent,
  },
  data() {
    return {
      customer_id: localStorage.getItem("customer_id"),
      data: {},
      category: "",
      // triggerRebuild: null,
      messages: this.$pnGetMessage(
        "customers." + localStorage.getItem("customer_id") + ".booking",
        this.receptor,
        10
      ),
      presense: {},
      pubnub_status: null,
      verification: false,
      token: "",
      currentComponent: null,
    };
  },
  beforeMount() {
    var current_url = window.location.href;
    var substr = "";

    current_url.includes("token")
      ? (substr = current_url.substring(current_url.indexOf("=") + 1))
      : false;

    if (substr) {
      // check if url has token provided
      this.verifyToken(substr);
    } else {
      if (localStorage.getItem("token")) {
        this.use_region =
          this.selected_region =
          this.region =
            localStorage.getItem("region");

        this.token = localStorage.getItem("token");
        this.verification = true;
        this.currentComponent = Index;
      } else {
        this.verification = false;
        this.currentComponent = LoginComponent;
      }
    }
  },
  mounted() {
    // pubnub
    if (localStorage.getItem("customer_id")) {
      console.log("has customer id");
      this.$pnSubscribe({
        channels: [
          "customers." + localStorage.getItem("customer_id") + ".booking",
        ],
        withPresence: true,
      });

      // this.messages = this.$pnGetMessage(
      //   "customers." + localStorage.getItem("customer_id") + ".booking",
      //   this.receptor,
      //   10
      // );
      this.$pnGetPresence(
        "customers." + localStorage.getItem("customer_id") + ".booking",
        this.presence
      );

      this.$pnGetStatus(this.status);
    }
  },
  // watch: {
  //   triggerRebuild: function () {
  //     // TO TRIGGER REBUILD METHOD ON LEFTCOMPONENT, 2 OPTION FOR TESTING,
  //     // this.$refs.indexComponent.rebuild(this.triggerRebuild); // first option, using refs,
  //     // this.$store.dispatch("watchListenerData", this.triggerRebuild); // second option using distach,computed and watch
  //   },
  // },
  methods: {
    async checkToken(data) {
      this.use_region =
        this.selected_region =
        this.region =
          localStorage.getItem("region");
      this.verification = true;
      this.token = localStorage.getItem("token");
      this.currentComponent = Index;
      location.reload();
      // this.getEventTypes();
    },
    verifyToken(token) {
      let url = process.env.VUE_APP_API_URL + "/api/auth/login";

      this.axios
        .get(url, {
          params: {
            token: token,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.$store.dispatch("assignCustomer", response.data);
            if (!localStorage.getItem("region")) {
              localStorage.setItem("region", response.data.customer.use_region);
              this.use_region =
                this.selected_region =
                this.region =
                  response.data.customer.use_region;
            } else {
              this.use_region =
                this.selected_region =
                this.region =
                  localStorage.getItem("region");
            }

            localStorage.setItem(
              "token",
              response.data.app_session.session_key
            );

            this.token = localStorage.getItem("token");
            this.verification = true;
            this.currentComponent = Index;
          } else {
            this.verification = false;
            this.currentComponent = LoginComponent;
            this.clearSession();
          }
        })
        .catch((err) => {
          if (localStorage.getItem("token")) {
            this.use_region =
              this.selected_region =
              this.region =
                localStorage.getItem("region");
            this.token = localStorage.getItem("token");
            this.verification = true;
            this.currentComponent = Index;
          } else {
            this.verification = false;
            this.currentComponent = LoginComponent;
          }
          // loading.close();
        });
    },
    login(data) {
      localStorage.removeItem("token");
      localStorage.setItem("token", data.app_session.session_key);
      // window.localStorage.setItem('token', 'n8RwzOAnck4xUS9QrRRYWxzhB13SQ9aNsxIpEmpj4V') // static token
      this.token = data.app_session.session_key;

      this.checkToken(data);
    },
    presence(ps) {
      this.presense = ps.occupancy;
      console.log("presense", ps);
    },
    status(st) {
      console.log("listener status: ", st);
      this.category = st.category;
    },
    receptor(msg) {
      // triggers for new message from listener
      console.log("listener receptor: ", msg);
      var listenerRes = {};
      listenerRes = JSON.parse(msg.message);
      if (
        listenerRes.data.customer_id === this.customer_id &&
        (listenerRes.type === "booking.confirmed" ||
          listenerRes.type === "booking.failed")
      ) {
        var event_match = {};
        var event_req = [];
        console.log(listenerRes, "listenerResreceptor");
        var event_id = listenerRes.data.event_id;

        if (listenerRes) {
          let type = listenerRes.type;

          if (type === "booking.failed") {
            if (localStorage.getItem("pending_booking")) {
              // for getting the complete name of event, this data assign during handlebooking method,
              event_req = JSON.parse(localStorage.getItem("pending_booking"));
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
            console.log("booking confirmed");
          }
          this.$store
            .dispatch("updateBooking", listenerRes)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              // this.triggerRebuild = listenerRes;
              this.$root.$emit("rebuild-event-list");
              listenerRes = undefined;
            });
        }
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

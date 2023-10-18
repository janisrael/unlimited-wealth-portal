<template>
  <div class="row full-height">
    <el-row>
      <el-col :span="24">
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="18"
          :xl="18"
          class="right-panel"
        >
          <el-col :span="24" class="panel-header">
            <el-col :span="17">
              <el-radio
                v-model="radio"
                label="upcoming"
                style="margin-left: 48px !important; padding-top: 15px"
                @change="getTypes('upcoming')"
                >Upcoming Events</el-radio
              >
              <el-radio
                v-model="radio"
                label="recording"
                @change="getTypes('recording')"
                >Recordings</el-radio
              >
            </el-col>
            <el-col :span="7">
              <el-col :span="8">
                <span
                  style="
                    padding-top: 6px;
                    display: inline-block;
                    font-size: 14px;
                  "
                >
                  Region:

                  <el-dropdown
                    @command="handleChangeRegion"
                    style="margin-left: 5px !important"
                  >
                    <span class="el-dropdown-link">
                      <span>
                        <country-flag
                          :country="use_region === 'uk' ? 'gb' : use_region"
                          size="small"
                        /> </span
                      ><i class="el-icon-arrow-down el-icon--right"></i>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="uk">
                        <country-flag country="gb" size="small" />
                      </el-dropdown-item>
                      <el-dropdown-item command="aus">
                        <country-flag country="au" size="small" />
                      </el-dropdown-item>
                      <el-dropdown-item command="phl">
                        <country-flag country="ph" size="small" />
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </el-col>
              <el-col :span="15">
                <el-input placeholder="Search" v-model="search" clearable>
                  <template slot="prepend"
                    ><i class="el-icon-search"></i
                  ></template>
                </el-input>
              </el-col>
            </el-col>
          </el-col>

          <LeftContent
            ref="leftComponent"
            :type="radio"
            :event_types="event_types"
            :tumbnail_region_title="tumbnail_region_title"
            :region="region === 'gb' ? 'uk' : region"
            :token="token"
            :daily_webinars="daily_webinars"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6" class="left-panel">
          <el-col
            :span="24"
            class="panel-header"
            style="display: flex; justify-content: space-between"
          >
            <div>
              <h3
                style="
                  margin: 0px !important;
                  margin-block-start: 0px !important;
                  margin-block-end: 0px !important;
                  font-size: 18px;
                  font-weight: 400;
                  display: inline-block;
                  padding-right: 20px;
                "
              >
                Events Overview
              </h3>
              <el-popover
                placement="bottom-start"
                title="All events in one place"
                width="200"
                trigger="hover"
                content="By clicking with your mouse on a specific date, you can see your booked events and other events, that happen trough-out the current month."
              >
                <i
                  class="el-icon-warning-outline"
                  style="color: #5ce6e6; cursor: pointer"
                  slot="reference"
                ></i>
              </el-popover>
            </div>
            <el-tooltip class="item" content="Logout" placement="left">
              <el-button type="primary" size="mini" @click="clearSession()"
                ><b-icon icon="box-arrow-right" aria-hidden="true"></b-icon
              ></el-button>
            </el-tooltip>
          </el-col>

          <component
            v-if="region"
            ref="calendarComponent"
            :is="currentRightComponent"
            :region="region === 'gb' ? 'uk' : region"
            :token="token"
          />
        </el-col>
      </el-col>
      <!-- <el-col v-else :span="24">
        <login-component :token="token" @login="login" />
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import LeftContent from "./LeftContent.vue";
import RightContent from "./RightContent.vue";
// import LoginComponent from "./LoginComponent.vue";

export default {
  name: "IndexVue",
  components: {
    LeftContent,
    RightContent,
    // LoginComponent,
  },
  data() {
    return {
      search: "",
      use_region: "",
      radio: "upcoming",
      event_types: [],
      recordings: [],
      selected_region: "",
      tumbnail_region_title: "Europe",
      region: "",
      currentRightComponent: null,
      currentLeftComponent: null,
      token: "",
      // verification: true,
      original_data: [],
      loading: false,
      pollingClearInterval: null,
      daily_webinars: [],
    };
  },
  beforeMount() {
    this.$root.$on("set-type", (type) => {
      this.radio = type;
    });
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
      this.use_region =
        this.region =
        this.selected_region =
          localStorage.getItem("region");
      this.getEventTypes();
      this.getDetectedTimezone();
      this.keepAliveApiPoll(localStorage.getItem("token"));
    }
  },
  watch: {
    search: function () {
      this.loading = true;
      this.event_types = this.original_data;
      this.search.length >= 2
        ? this.filter_data()
        : (this.event_types = this.original_data);
    },
  },
  created() {
    if (localStorage.getItem("active_type")) {
      this.type = localStorage.getItem("active_type");
      this.radio = localStorage.getItem("active_type");
    }
  },
  methods: {
    getDetectedTimezone() {
      var current_tz = this.$cookies.get("_detected_current_tz");
      console.log(current_tz, "current_tz");
      if (current_tz === null) {
        var url_timezone =
          "https://api.ipgeolocation.io/timezone?apiKey=" +
          process.env.VUE_APP_COOKIE_KEY;
        this.axios
          .get(url_timezone)
          .then((response) => {
            console.log(response.data.timezone, "- detected timezone");
            this.$cookies.set("_detected_current_tz", response.data.timezone);
          })
          .catch((error) => {
            // reject(error);
          });
      }
    },
    clearSession() {
      window.localStorage.clear();
      // document.location.href = "/";
      // setTimeout(() => {
      this.$nextTick(() => {
        /* eslint-disable */
        window.location.href = "/#/";
        window.location.reload();
      });
      // }, 300);
    },
    getDailyWebinars() {
      var daily_webinar_url =
        process.env.VUE_APP_API_URL + "/api/daily-webinars";
      this.axios
        .get(daily_webinar_url, {
          headers: {
            "X-Session-Key": this.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((response) => {
          this.daily_webinars = response.data;
          // let my_bookings = response.data.data;
          // commit("SET_MYBOOKINS", my_bookings);
        })
        .catch((error) => {});
    },
    getEventTypes() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        // spinner: 'el-icon-loading',
        background: "rgba(0, 0, 0, 0.7)",
      });

      // this.$store.dispatch("getDailyWebonars", this.token);
      this.getDailyWebinars();

      let _region = "";
      _region =
        localStorage.getItem("region") === "gb"
          ? "uk"
          : localStorage.getItem("region");

      this.loading = true;
      var url = process.env.VUE_APP_API_URL + "/api/event-types/" + _region;
      this.axios
        .get(url, {
          headers: {
            "X-Session-Key": this.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            var url =
              process.env.VUE_APP_API_URL +
              "/api/events/upcoming?region=" +
              _region;
            this.axios
              .get(url, {
                headers: {
                  "X-Session-Key": this.token,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              })
              .then((res_upcoming) => {
                if (res_upcoming.status === 200) {
                  this.event_types = this.original_data = response.data.data;
                  this.$store.dispatch(
                    "allUpcomingEventsByRegion",
                    response.data.data
                  );
                  let related_events = res_upcoming.data.data;

                  this.event_types.forEach((event_type) => {
                    let filteredEvents = related_events.filter((item) => {
                      return item.event_type_id === event_type.id;
                    });
                    if (filteredEvents.length > 0) {
                      filteredEvents.sort(function (a, b) {
                        return (
                          new Date(a.start_at.local) -
                          new Date(b.start_at.local)
                        );
                      });

                      event_type["upcoming_event"] =
                        filteredEvents[0].start_at.local;
                    }
                  });
                  this.loading = false;
                  loading.close();
                }
              })
              .catch((err) => {
                loading.close();
              });
          }
        })
        .catch((err) => {
          this.clearSession();
          loading.close();
        });

      this.currentLeftComponent = LeftContent;
      this.currentRightComponent = RightContent;
    },
    handleChangeRegion(command) {
      if (command) {
        if (command === "uk") {
          this.use_region = command;

          this.tumbnail_region_title = "Europe";
        } else if (command === "aus" || command === "au") {
          this.use_region = command;
          this.tumbnail_region_title = "Australia";
        } else {
          this.use_region = command;
          this.tumbnail_region_title = "Philippines";
        }
        this.region = command;
      }
      if (command !== localStorage.getItem("region")) {
        localStorage.setItem("region", this.use_region);
        this.region =
          this.use_region =
          this.selected_region =
            localStorage.getItem("region");

        this.$nextTick(() => {
          /* eslint-disable */
          this.currentRightComponent = null;
          this.getEventTypes();
          this.$refs.calendarComponent.getEventsDate();
        });
      }

      // setTimeout(() => {

      // }, 100);
    },
    getCountryByRegion(region) {
      console.log(region);
    },
    getTypes(type) {
      this.radio = type;
      localStorage.setItem("active_type", type);
    },
    filter_data() {
      let event_types = this.event_types;
      let search = this.search;
      let ret = event_types.filter(function (el) {
        return el.name.toLowerCase().includes(search.toLowerCase());
      });

      this.event_types = ret;
    },
    keepAliveApiPoll(token) {
      let nextInterval = parseInt(process.env.VUE_APP_KEEP_ALIVE_INTERVAL) || 1;
      if (!localStorage.getItem("_nxt_kat")) {
        let nowPlusOneMin = this.$moment()
          .utc()
          .add(parseInt(nextInterval), "minutes")
          .valueOf();
        localStorage.setItem("_nxt_kat", String(nowPlusOneMin));
      }
      this.pollingClearInterval = setInterval(() => {
        let currInt = Number(localStorage.getItem("_nxt_kat"));
        if (Number(this.$moment().valueOf()) > currInt) {
          this.axios
            .get(`${process.env.VUE_APP_API_URL}/api/session/keep-alive`, {
              headers: {
                "X-Session-Key": token,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then(() => {
              localStorage.setItem(
                "_nxt_kat",
                this.$moment(currInt).add(nextInterval, "minutes").valueOf()
              );
            })
            .catch(() => {
              clearInterval(this.pollingClearInterval);
              localStorage.removeItem("_nxt_kat");
            });
        }
      }, 5000);
    },
  },
};
</script>

<style scoped></style>

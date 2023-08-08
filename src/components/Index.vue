<template>
<div class="row full-height">
  <el-row>
    <el-col v-if="verification === true" :span="24">
      <el-col :span="18" class="right-panel">
        <el-col :span="24" class="panel-header">
          <el-col :span="17">
            <el-radio v-model="radio" label="upcoming" style="margin-left: 48px !important; padding-top: 15px" @change="getTypes('upcoming')">Upcoming Events</el-radio>
            <el-radio v-model="radio" label="recording" @change="getTypes('recording')">Recordings</el-radio>
          </el-col>
          <el-col :span="7">
            <el-col :span="8">
              <span style="
                    padding-top: 6px;
                    display: inline-block;
                    font-size: 14px;
                  ">
                Region:

                <el-dropdown @command="handleChangeRegion" style="margin-left: 5px !important">
                  <span class="el-dropdown-link">
                    <span>
                      <country-flag :country="use_region" size="small" /> </span><i class="el-icon-arrow-down el-icon--right"></i>
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
                <template slot="prepend"><i class="el-icon-search"></i></template>
              </el-input>
            </el-col>
          </el-col>
        </el-col>

        <LeftContent :type="radio" :events="events" :tumbnail_region_title="tumbnail_region_title" :region="region" :token="token" @login="login" />
        <!-- <component ref="leftComponent" :is="currentLeftComponent" :type="radio" :events="events" :tumbnail_region_title="tumbnail_region_title" :region="region" :token="token" @login="login"/> -->
      </el-col>
      <el-col :span="6" class="left-panel">
        <el-col :span="24" class="panel-header">
          <h3 style="
                margin: 0px !important;
                margin-block-start: 0px !important;
                margin-block-end: 0px !important;
                font-size: 18px;
                font-weight: 400;
                display: inline-block;
                padding-right: 20px;
              ">
            Events Overview
          </h3>
          <el-popover placement="bottom-start" title="All events in one place" width="200" trigger="hover" content="By clicking with your mouse on a specific date, you can see your booked events and other events, that happen trough-out the current month.">
            <i class="el-icon-warning-outline" style="color: #5ce6e6; cursor: pointer" slot="reference"></i>
          </el-popover>
          <el-tooltip class="item" content="Logout" placement="left">
            <el-button type="primary" size="mini" icon="el-icon-user-solid" style="position: absolute; right: 10px" @click="clearSession()"></el-button>
          </el-tooltip>
        </el-col>

        <!-- <RightContent :region="region"/> -->
        <component v-if="region" ref="calendarComponent" :is="currentRightComponent" :region="region" :token="token" />
      </el-col>
    </el-col>
    <el-col v-else :span="24">
      <login-component :token="token" @login="login" />
    </el-col>
  </el-row>
</div>
</template>

<script>
/* eslint-disable */
import LeftContent from "./LeftContent.vue";
import RightContent from "./RightContent.vue";
import LoginComponent from "./LoginComponent.vue";

export default {
  name: "IndexVue",
  components: {
    LeftContent,
    RightContent,
    LoginComponent,
  },
  data() {
    return {
      search: "",
      use_region: "",
      radio: "upcoming",
      events: [],
      recordings: [],
      selected_region: "",
      tumbnail_region_title: "Europe",
      region: "",
      currentRightComponent: null,
      currentLeftComponent: null,
      token: "",
      verification: true,
      original_data: [],
      loading: false,
    };
  },
  mounted() {
    // console.log(process.env.VUE_APP_API_URL, "env");
    if (sessionStorage.getItem("token")) {
      this.verifyToken(sessionStorage.getItem("token"));
    } else {
      this.checkToken();
    }
  },
  watch: {
    search: function () {
      this.loading = true;
      if (this.search.length >= 3) {
        this.filter_data();
      } else {
        this.events = this.original_data;
      }
    },
  },
  beforeCreate() {
    // window.sessionStorage.removeItem('token')
  },
  methods: {
    verifyToken(token) {
      let url = process.env.VUE_APP_API_URL + "/api/auth/login";

      this.axios
        .get(url, {
          token: token,
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.customer.use_region === "uk") {
              this.use_region = "gb";
              this.selected_region = "gb";
              this.region = response.data.customer.use_region;
            } else {
              this.use_region = response.data.customer.use_region;
              this.selected_region = response.data.customer.use_region;
              this.region = response.data.customer.use_region;
            }
            sessionStorage.setItem(
              "token",
              response.data.app_session.session_key
            );
            // sessionStorage.setItem('token', 'n8RwzOAnck4xUS9QrRRYWxzhB13SQ9aNsxIpEmpj4V') // static token
            this.token = window.sessionStorage.getItem("token");
            this.verification = true;
            this.currentRightComponent = RightContent;
            this.getEvents();
          } else {
            this.verification = false;
            this.currentRightComponent = null;
          }
        });
    },
    clearSession() {
      window.sessionStorage.removeItem("token");
      window.location.reload();
    },
    async checkToken(data) {
      var current_url = window.location.href;
      var substr = "";
      if (current_url.includes("token")) {
        substr = current_url.substring(current_url.indexOf("=") + 1);
      }
      if (substr) {
        this.verifyToken(substr);
      } else {
        if (window.sessionStorage.getItem("token")) {
          if (data) {
            if (data.customer.use_region === "uk") {
              this.use_region = "gb";
              this.selected_region = "gb";
              this.region = data.customer.use_region;
            } else {
              this.use_region = data.customer.use_region;
              this.selected_region = data.customer.use_region;
              this.region = data.customer.use_region;
            }
            this.verification = true;
            // const sessionStorage = window.sessionStorage
            window.sessionStorage.setItem(
              "token",
              data.app_session.session_key
            );
            this.token = sessionStorage.getItem("token");
            this.getEvents();
          } else {
            this.verification = false;
          }
        } else {
          this.verification = false;
        }
      }
    },
    login(data) {
      // console.log(data, "---");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.setItem("token", data.app_session.session_key);
      // window.sessionStorage.setItem('token', 'n8RwzOAnck4xUS9QrRRYWxzhB13SQ9aNsxIpEmpj4V') // static token
      this.token = data.app_session.session_key;
      this.checkToken(data);
    },
    getEvents() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        // spinner: 'el-icon-loading',
        background: "rgba(0, 0, 0, 0.7)",
      });

      this.loading = true;
      var url = process.env.VUE_APP_API_URL + "/api/event-types/" + this.region;
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
            this.events = response.data.data;
            this.original_data = response.data.data;
            this.loading = false;
            loading.close();
          }
        })
        .catch((err) => {
          loading.close();
        });

      this.currentLeftComponent = LeftContent;
      this.currentRightComponent = RightContent;
    },
    handleChangeRegion(command) {
      if (command) {
        if (command === "uk") {
          this.use_region = "gb";

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
      this.selected_region = command;

      setTimeout(() => {
        /* eslint-disable */
        this.currentRightComponent = null;
        this.getEvents();
        this.$refs.calendarComponent.getEventsDate();
      }, 100);
    },
    getCountryByRegion(region) {
      console.log(region);
    },
    getTypes(type) {
      this.radio = type;
    },
    filter_data() {
      let events = this.events;
      let search = this.search;

      let ret = events.filter(function (el) {
        return el.name.toLowerCase().includes(search.toLowerCase());
      });

      this.events = ret;
    },
  },
};
</script>

<style scoped></style>

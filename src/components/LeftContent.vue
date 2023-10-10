<template>
  <div class="left-panel-wrapper">
    <el-row>
      <el-col :span="24">
        <div
          class="el-calendar__title"
          style="text-align: left; padding: 20px 0px 0px 20px"
        >
          Daily webinars
        </div>
        <el-col :span="24" style="padding: 0px 0px 0px 20px !important">
          <!-- eslint-disable -->
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="8"
            style="padding-right: 20px; padding-top: 20px"
          >
            <div @click="getModal(event_type, 'daily_webinars')">
              <el-card class="box-card card-left-panel" shadow="hover">
                <div slot="header" class="clearfix">
                  <lazy-background
                    src=""
                    image-class="cam-viewport"
                    :blur="0"
                    position="left center"
                    size="cover"
                    style="
                      background-size: cover;
                      background-position: left center;
                    "
                    class="card-header-content"
                  >
                    <div slot="content">
                      <div class="card-header-content">
                        <!-- <div v-if="event.policy.is_accessible === false" class="lock-wrapper">
                            <i  class="el-icon-lock"></i>
                          </div> -->
                        <!-- <div class="card-content-title">{{ event.name }}</div>     -->
                        <div class="card-content-title"></div>
                        <!-- <div class="card-content-region">{{ tumbnail_region_title }}</div>     -->
                        <div class="card-content-sched">
                          <!-- <div v-if="event_type.upcoming_event">
                          Coming up at
                          {{ getFormatedDate(event_type.upcoming_event) }}
                        </div> -->
                          <!-- <div v-else style="visibility: hidden">-</div> -->
                        </div>
                      </div>
                    </div>
                  </lazy-background>
                </div>
                <div class="text item">
                  <!-- <span v-if="!event_type.description"> -</span> -->
                  Asia webinar
                </div>
              </el-card>
            </div>
          </el-col>

          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="8"
            style="padding-right: 20px; padding-top: 20px"
          >
            <div @click="getModal(event_type, 'daily_webinars')">
              <el-card class="box-card card-left-panel" shadow="hover">
                <div slot="header" class="clearfix">
                  <lazy-background
                    src=""
                    image-class="cam-viewport"
                    :blur="0"
                    position="left center"
                    size="cover"
                    style="
                      background-size: cover;
                      background-position: left center;
                    "
                    class="card-header-content"
                  >
                    <div slot="content">
                      <div class="card-header-content">
                        <!-- <div v-if="event.policy.is_accessible === false" class="lock-wrapper">
                            <i  class="el-icon-lock"></i>
                          </div> -->
                        <!-- <div class="card-content-title">{{ event.name }}</div>     -->
                        <div class="card-content-title"></div>
                        <!-- <div class="card-content-region">{{ tumbnail_region_title }}</div>     -->
                        <div class="card-content-sched">
                          <!-- <div v-if="event_type.upcoming_event">
                          Coming up at
                          {{ getFormatedDate(event_type.upcoming_event) }}
                        </div> -->
                          <!-- <div v-else style="visibility: hidden">-</div> -->
                        </div>
                      </div>
                    </div>
                  </lazy-background>
                </div>
                <div class="text item">
                  <!-- <span v-if="!event_type.description"> -</span> -->
                  Europe Webinar
                </div>
              </el-card>
            </div>
          </el-col>
        </el-col>
      </el-col>
      <!-- events-->
      <el-col :span="24">
        <div
          class="el-calendar__title"
          style="text-align: left; padding: 20px 0px 0px 20px"
        >
          Events
        </div>
        <el-col :span="24" style="padding: 0px 0px 0px 20px !important">
          <!-- eslint-disable -->
          <el-col
            v-for="(event_type, i) in event_types"
            v-if="event_type.policy.is_visible === true"
            :key="i"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="8"
            style="padding-right: 20px; padding-top: 20px"
          >
            <div @click="getModal(event_type)">
              <el-card class="box-card card-left-panel" shadow="hover">
                <div slot="header" class="clearfix">
                  <lazy-background
                    :src="event_type.image_url"
                    @onLoad="onLoad(event_type.name)"
                    @onError="onError(event_type)"
                    image-class="cam-viewport"
                    :blur="0"
                    position="left center"
                    size="cover"
                    style="
                      background-size: cover;
                      background-position: left center;
                    "
                    class="card-header-content"
                  >
                    <div slot="content">
                      <div class="card-header-content">
                        <!-- <div v-if="event.policy.is_accessible === false" class="lock-wrapper">
                            <i  class="el-icon-lock"></i>
                          </div> -->
                        <!-- <div class="card-content-title">{{ event.name }}</div>     -->
                        <div class="card-content-title"></div>
                        <!-- <div class="card-content-region">{{ tumbnail_region_title }}</div>     -->
                        <div
                          class="card-content-sched"
                          v-if="type == 'upcoming'"
                        >
                          <div v-if="event_type.upcoming_event">
                            Coming up at
                            {{ getFormatedDate(event_type.upcoming_event) }}
                          </div>
                          <div v-else style="visibility: hidden">-</div>
                        </div>
                      </div>
                    </div>
                  </lazy-background>
                </div>
                <div class="text item">
                  <span v-if="!event_type.description"> -</span>
                  {{ event_type.description }}
                </div>
              </el-card>
            </div>
          </el-col>
        </el-col>
      </el-col>

      <component
        ref="modalComponent"
        :is="currentComponent"
        :type="type"
        :event_list="event_list"
        :active_events="active_events"
        :event_type="selected_event_type"
        :event_types="event_types"
        @close="CloseModal()"
        @book_events="handleBookEvents"
        @cancel_events="handleCancelEvent"
        :token="token"
        :region="region"
      />
    </el-row>
  </div>
</template>

<script>
import EventModal from "./modal/EventModal.vue";
import LockedEvent from "./modal/LockedEvent.vue";
import NoRecording from "./modal/NoRecording.vue";
import DailyWebinars from "./modal/DailyWebinars.vue";
/* eslint-disable */
export default {
  name: "LeftContent",
  components: {
    EventModal,
    LockedEvent,
    NoRecording,
    DailyWebinars,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    event_types: {
      type: Array,
      required: true,
    },
    // events: {
    //   required: true,
    //   type: Array,
    // },
    tumbnail_region_title: {
      required: true,
      type: String,
    },
    region: {
      required: true,
      type: String,
    },
    token: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      thumbnail_image: require("../assets/images/visual.png"),
      currentComponent: null,
      event_list: [],
      selected_event_type: {},
      active_events: [],
    };
  },
  beforeMount() {
    this.$root.$on("open-upcoming-events-modal", (event) => {
      var clicked_event_type = this.event_types.filter((item) => {
        return item.id === event.event_type_id;
      });

      this.getModal(clicked_event_type[0]);
    });

    this.$root.$on("rebuild-event-list", (event) => {
      this.rebuildEventList();
    });
  },
  computed: {
    _myybookings() {
      return this.$store.getters._myybookings;
    },
    // _my_active_events() {
    //   return this.$store.getters._my_active_events;
    // },
    // _listener_data() {
    //   // listener data from getter
    //   return this.$store.getters._listener_data;
    // },
  },
  // watch: {
  //   _listener_data: function () {
  //     // trigger rebuildmethod if listener data change
  //     this.rebuildEventList();
  //   },
  // },
  methods: {
    withBooking(events) {
      var type = this.type;
      var related_booking;

      if (this.type === "upcoming") {
        events.forEach((event) => {
          related_booking = this.$store.getters._myybookings.find(
            (b) => b.event_id === event.id
          );

          let related = {
            id: undefined,
            progress: undefined,
            join_url: undefined,
            registration_key: undefined,
          };

          if (related_booking) {
            related.id = related_booking.id;
            related.progress = "pending";
            related.join_url = related_booking.join_url;
            related.registration_key = related_booking.registration_key;

            if (related_booking.status === "Attending") {
              related.progress = "confirmed";
            }

            // console.log(
            //   related_booking.event_id + "<->" + event.id,
            //   "related_booking.event_id <-> event.id"
            // );
          } else {
            console.log("no related_booking.event_id");
          }

          event._related_booking = related;
          event.selected = false;
        });
      }

      return events;
    },
    getModal(event_type, type) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        // spinner: 'el-icon-loading',
        background: "transparent",
      });
      if (type === "daily_webinars") {
        // daily webinars
        this.currentComponent = DailyWebinars;
        loading.close();
      } else {
        this.selected_event_type = event_type;

        if (event_type.policy.is_accessible === false) {
          this.currentComponent = LockedEvent;
          loading.close();
          return;
        }

        var url = "";
        var events = [];
        if (this.type === "upcoming") {
          url =
            process.env.VUE_APP_API_URL +
            "/api/events/upcoming?region=" +
            this.region +
            "&event_type_id=" +
            event_type.id;
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
                events = response.data.data;

                this.event_list = [];
                let events_with_booking = this.withBooking(events);

                this.event_list = events_with_booking.filter((event) => {
                  let now = new Date().getTime();
                  // let start = new Date(event.start_at.utc + " UTC").getTime(); // now working on safari
                  let start = new Date(event.start_at.utc).getTime();
                  return (
                    Number(start) > Number(now) ||
                    event._related_booking.id !== undefined
                  );
                });

                this.event_list.sort(function (a, b) {
                  return (
                    new Date(a.start_at.local) - new Date(b.start_at.local)
                  );
                });
              }
            });

          this.currentComponent = EventModal;
          
          loading.close();
        } else {
          url =
            process.env.VUE_APP_API_URL +
            "/api/events/recordings?region=" +
            this.region +
            "&event_type_id=" +
            event_type.id;
          this.axios
            .get(url, {
              headers: {
                "X-Session-Key": this.token,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then((response) => {
              this.event_list = response.data.data;
              if (this.event_list.length === 0 && this.type === "recording") {
                this.currentComponent = NoRecording;
              } else {
                this.currentComponent = EventModal;
              }
              loading.close();
            });
        }
      }
    },
    handleCancelEvent(data) {
      // this.$store.dispatch("removeBooking", data);
      this.rebuildEventList();
    },
    // handleAddEvent(data) {
    //   let active_events = this.active_events;
    //   active_events = active_events.concat(data);

    //   let event_list = this.event_list;

    //   event_list = event_list.filter(function (obj) {
    //     return !this.has(obj.id);
    //   }, new Set(data.map((obj) => obj.id)));

    //   this.event_list = []; // clearing evelt_list for carousel arrrow to reshow, reload the component
    //   this.active_events = []; // clearing evelt_list for carousel arrrow to reshow, reload the component

    //   this.active_events = active_events;

    //   this.active_events.forEach((event) => {
    //     event.selected = false;
    //   });
    //   this.event_list = event_list;
    // },
    handleBookEvents(events) {
      this.$store.dispatch("addBooking", events);

      const arr_booking_req = events.map((event) => ({
        event_id: event.id,
        event_name: event.name,
        region: event.region,
        status: "created",
        customer_id: this.$store.getters._customer.id,
      }));

      // store the book events to session storage, use to get the full event name during event listener
      localStorage.setItem(
        "pending_booking",
        JSON.stringify(arr_booking_req)
      );

      this.rebuildEventList();
    },
    async rebuildEventList() {
      let freshList = this.withBooking(this.event_list);
      this.event_list = [];
      // setTimeout(() => {
      await this.$nextTick(() => {
        this.event_list = freshList;
      });
      // }, 100);
    },
    CloseModal() {
      this.event_list = [];
      this.currentComponent = null;
    },
    getFormatedDate(date) {
      var d = new Date(date);
      var month = d.toLocaleString("default", {
        month: "short",
      });
      var this_date = d.getDate();
      var dateExt = this.getDateExt(this_date);

      // var formated_date = "";
      // if (this.type === "upcoming") {
      var formated_date = this_date + dateExt + " " + month;
      // } else {
      // formated_date = this_date + dateExt + " " + month;
      // }
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
    getDate(date) {
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      var d = new Date(date);
      var dayName = days[d.getDay()];
      return dayName;
    },
    onLoad(data) {
      //console.log(data);
    },
    onError(data) {
      console.log(data);
    },
  },
};
</script>

<style scoped></style>

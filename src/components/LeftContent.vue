<template>
  <div class="left-panel-wrapper">
    <el-row>
      <el-col :span="24" style="padding: 0px 20px !important">
        <!-- eslint-disable -->
        <el-col
          v-for="(event, i) in events"
          v-if="event.policy.is_visible === true"
          :key="i"
          :span="8"
          style="padding-right: 20px; padding-top: 20px"
        >
          <div @click="getModal(event)">
            <el-card class="box-card card-left-panel" shadow="hover">
              <div slot="header" class="clearfix">
                <lazy-background
                  :src="event.image_url"
                  @onLoad="onLoad(event.name)"
                  @onError="onError(event)"
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
                        Coming up at 3rd April
                      </div>
                    </div>
                  </div>
                </lazy-background>
              </div>
              <div class="text item">
                <span v-if="!event.description"> -</span>
                {{ event.description }}
              </div>
            </el-card>
          </div>
        </el-col>
      </el-col>

      <component
        :is="currentComponent"
        :type="type"
        :event_list="event_list"
        :active_events="active_events"
        :event="selected_event"
        @close="CloseModal()"
        @add_events="handleAddEvent"
        :token="token"
        :region="region"
      />
    </el-row>
  </div>
</template>

<script>
import EventModal from "./modal/EventModal.vue";
import LockedEvent from "./modal/LockedEvent.vue";
export default {
  name: "LeftContent",
  components: {
    EventModal,
    LockedEvent,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    events: {
      required: true,
      type: Array,
    },
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
      selected_event: {},
      active_events: [],
    };
  },
  beforeMount() {
    this.$root.$on("open-upcoming-events-modal", (event) => {
      var clicked_event = this.events.filter((item) => {
        return item.id === event.event_type_id;
      });

      this.getModal(clicked_event[0]);
    });
  },
  computed: {
    _myybookings() {
      return this.$store.getters._myybookings;
    },
    _my_active_events() {
      return this.$store.getters._my_active_events;
    },
  },
  methods: {
    getModal(event) {
      this.selected_event = event;

      if (event.policy.is_accessible === false) {
        this.currentComponent = LockedEvent;
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
          event.id;
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
              var active_events = [];
              var event_type_id = events[0].event_type_id;
              console.log(events[0].event_type_id, "event_type_id");
              events.forEach((event, i) => {
                event["selected"] = false;
                /* eslint-disable */
                this._myybookings.forEach((booking, index) => {
                  if (
                    booking.event_id === event.id &&
                    booking.event_region === event.region
                  ) {
                    active_events.push(event);
                    events.splice(i, 1);
                    // event['hidden'] = true
                  }

                  if (booking.status === "Booking") {
                    events.splice(i, 1);
                  }
                });
              });

              /* eslint-disable */
              this._myybookings.forEach((booking, index) => {
                if (
                  booking.event_id === event_type_id &&
                  booking.status === "Booking"
                ) {
                  active_events.push(booking);
                  // events.splice(index, 1)
                }
              });

              var todayDate = new Date().toISOString().slice(0, 10);
              var new_event_list = events.filter(function (item) {
                return (
                  // item.start_date !== todayDate &&
                  item.states.progress.toLowerCase() === "upcoming"
                );
              });

              this.event_list = [];
              // this.active_events = []
              this.event_list = new_event_list;
              this.active_events = active_events;
              this.$store
                .dispatch("setActiveEvents", this.active_events)
                .then((response) => {});
            }
          });
      } else {
        url =
          process.env.VUE_APP_API_URL +
          "/api/events/recordings?region=" +
          this.region +
          "&event_type_id=" +
          event.id;
        this.axios
          .get(url, {
            headers: {
              "X-Session-Key": this.token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((response) => (this.event_list = response.data.data));
      }

      this.currentComponent = EventModal;
    },
    handleAddEvent(data) {
      let active_events = this.active_events;
      active_events = active_events.concat(data);

      let event_list = this.event_list;

      event_list = event_list.filter(function (obj) {
        return !this.has(obj.id);
      }, new Set(data.map((obj) => obj.id)));

      // let count = 0
      // count = this.event_list.length;

      // if(count === 1) {
      //   this.event_list = []
      // } else {
      this.event_list = []; // clearing evelt_list for carousel arrrow to reshow, reload the component
      this.active_events = []; // clearing evelt_list for carousel arrrow to reshow, reload the component

      this.active_events = active_events;

      this.active_events.forEach((event) => {
        event.selected = false;
      });
      this.event_list = event_list;
      // }
    },
    CloseModal() {
      this.event_list = [];
      this.currentComponent = null;
    },
    onLoad(data) {
      console.log(data);
    },
    onError(data) {
      console.log(data);
    },
  },
};
</script>

<style scoped></style>

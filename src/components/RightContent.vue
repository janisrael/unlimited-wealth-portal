<template>
  <div class="right-panel-wrapper">
    <el-col :span="24" style="padding: 0 20px">
      <el-calendar v-model="calendar_date">
        <template slot="dateCell" slot-scope="{ data }">
          <div
            :class="data.isSelected ? 'is-selected' : ''"
            class="calendar-date"
            @click="getDate(data)"
          >
            {{ data.day.split("-").slice(2).join("-") }}
            <div style="display: block; width: 100%; margin-top: -7px">
              <span
                v-for="(dot, index) in getDots(data)"
                :key="index"
                class="dot"
              >
              </span>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-col>

    <el-col :span="24" style="padding: 0 40px">
      <h4 style="font-size: 14px; font-weight: 600">
        My Upcoming Bookings &nbsp;
        <span v-loading="loading" element-loading-background="#2D2953"></span>
      </h4>
      <div v-if="all_bookings.length === 0" class="no-booking-caption">
        No bookings available
      </div>
      <el-col
        v-for="(event, i) in all_bookings"
        :key="i"
        :span="24"
        style="margin-bottom: 8px"
      >
        <div class="events-box" @click="getBookingDetails(event)">
          <el-col :span="4">
            <el-tooltip
              class="item speaker-icon"
              :content="event.speaker ? event.speaker.name : 'Smartcharts'"
              placement="top"
              effect="light"
            >
              <el-avatar
                class="speaker-avatar-circle"
                :size="40"
                :src="
                  require(`@/assets/images/speakers/${
                    event.speaker ? event.speaker.avatar : 'smartcharts.png'
                  }`)
                "
              >
              </el-avatar>
            </el-tooltip>
          </el-col>
          <el-col :span="20" style="padding-top: 5px">
            <div class="bookings-title">
              {{ event.event_type_name }} -
              <span style="text-transform: uppercase">{{
                event.event_region
              }}</span>
            </div>
            <div class="bookings-sub-title">
              {{ getFormatedLocalTime(event) }} &nbsp;
              <el-badge
                v-if="event.status === 'Progress'"
                value="Pending"
                class="item"
              >
              </el-badge>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-col>

    <component
      :is="currentComponent"
      :date="date"
      :event_on_this_day="event_on_this_day"
      :my_events_for_today="my_events_for_today"
      :selected_booking="selected_booking"
      @close="CloseModal()"
      @cancel_event="handleCancelEvent"
    />
  </div>
</template>

<script>
import CalendarEvents from "../components/modal/CalendarEvents.vue";
import UpcomingBookingDetails from "../components/modal/UpcomingBookingDetails.vue";
export default {
  name: "RightContent",
  components: {
    CalendarEvents,
    UpcomingBookingDetails,
  },
  props: {
    region: {
      type: String,
      require: true,
    },
    token: {
      require: true,
      type: String,
    },
  },
  data() {
    return {
      value: new Date(),
      avatar: require("../assets/images/avatar.png"),
      currentComponent: null,
      date: {},
      // region: 'phl',
      event_list: [],
      all_bookings: [],
      event_on_this_day: [],
      my_events_this_week: [],
      my_events_next_week: [],
      my_events_upcoming: [],
      my_events_for_today: [],
      calendar_date: new Date(),
      selected_booking: {},
      loading: false,
    };
  },
  watch: {
    calendar_date(newValue, oldValue) {
      if (newValue.getMonth() != oldValue.getMonth()) {
        this.getEventsDate(newValue);
      }
    },
    region() {
      this.filterMyUpcomingEventsByRegion();
    },
  },
  computed: {
    _myybookings() {
      return this.$store.getters._myybookings;
    },
  },
  created() {
    this.getEventsDate();
    this.getMyBookings();
  },
  methods: {
    getEventsDate(date) {
      var events = [];
      var url = "";
      var month = "";

      if (date) {
        month = date.getFullYear() + "/" + (parseInt(date.getMonth()) + 1);
        url =
          process.env.VUE_APP_API_URL +
          "/api/calendar/" +
          this.region +
          "/" +
          month;
      } else {
        month = new Date();
        let _month =
          month.getFullYear() + "/" + (parseInt(month.getMonth()) + 1);
        url =
          process.env.VUE_APP_API_URL +
          "/api/calendar/" +
          this.region +
          "/" +
          _month;
      }

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
            const converted_to_array = Object.values(events);
            this.event_list = converted_to_array;
          }
        });
    },
    errorHandler() {},
    getDate(data) {
      this.date = data;
      this.event_list.forEach((value) => {
        if (value.events[0].date === this.date.day) {
          this.event_on_this_day = value;
        }
      });
      if (this.event_on_this_day.events) {
        this.currentComponent = CalendarEvents;
        this.getTodaysBookings();
      } else {
        this.$notify.info({
          title: "No Event",
          message: "There is no event on this date",
        });
      }
    },
    CloseModal() {
      this.currentComponent = null;
      this.event_on_this_day = [];
    },
    getDots(data) {
      var count = 0;
      this.event_list.forEach((value) => {
        if (value.events[0].date === data.day) {
          count = value.total;
        }
      });
      return count;
    },

    getMyBookings() {
      this.$store.dispatch("getMybookings", this.token).then((response) => {
        if (response.status === 200) {
          this.my_events_upcoming = this._myybookings;
          this.filterMyUpcomingEventsByRegion();

          this.all_bookings = this._myybookings;
          this.all_bookings.sort(function (a, b) {
            return new Date(a.start_date) - new Date(b.start_date);
          });

          let curr = new Date();
          let week = [];
          let next_week = [];

          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i;
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
            week.push(day);
          }

          //next week
          let next_week_start = new Date(week[week.length - 1]);
          for (let i = 1; i <= 7; i++) {
            let first_next_week =
              next_week_start.getDate() - next_week_start.getDay() + i;
            let next_week_day = new Date(
              next_week_start.setDate(first_next_week)
            )
              .toISOString()
              .slice(0, 10);
            next_week.push(next_week_day);
          }
          // /* eslint-disable */
          if (this.my_events_upcoming.length > 0) {
            //check events
            this.my_events_upcoming.forEach((value) => {
              week.forEach((value_week) => {
                if (value.start_date === value_week) {
                  this.my_events_this_week.push(value);
                }
              });
              next_week.forEach((value_week) => {
                if (value.start_date === value_week) {
                  this.my_events_next_week.push(value);
                }
              });
            });
          }
          if (this.my_events_this_week.length > 0) {
            this.my_events_this_week.sort(function (a, b) {
              return new Date(a.start_date) - new Date(b.start_date);
            });
          }

          if (this.my_events_next_week.length > 0) {
            this.my_events_next_week.sort(function (a, b) {
              return new Date(a.start_date) - new Date(b.start_date);
            });
          }
        }
      });
    },
    getDateDay(date) {
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
    getMonth(date) {
      var d = new Date(date);
      var month = d.toLocaleString("default", {
        month: "long",
      });
      return month;
    },
    getFormatedDate(date) {
      var d = new Date(date);
      var month = d.toLocaleString("default", {
        month: "long",
      });
      var this_date = d.getDate();
      var dateExt = this.getDateExt(this_date);

      var formated_date = "";
      var day = this.getDateDay(date);
      if (this.type === "upcoming") {
        formated_date = this_date + dateExt;
      } else {
        formated_date = this_date + dateExt + " " + month + " " + day;
      }
      return formated_date;
    },
    getFormatedLocalTime(event) {
      var d = (event.start_at ? event.start_at.utc : event.start_date) + " UTC";

      var local_date = new Date(d).toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });

      return local_date;
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
    filterMyUpcomingEventsByRegion() {
      this.my_events_upcoming = this._myybookings.filter((item) => {
        return item.event_region === this.region;
      });

      this.my_events_upcoming.sort(function (a, b) {
        return new Date(a.start_date) - new Date(b.start_date);
      });
    },
    getTodaysBookings() {
      this.filterMyUpcomingEventsByRegion();
      this.my_events_for_today = this.my_events_upcoming.filter((item) => {
        return item.start_date === this.date.day;
      });
    },
    getBookingDetails(event) {
      this.loading = true;
      var url = event.meta.resource_path;

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
            this.currentComponent = UpcomingBookingDetails;
            this.selected_booking = response.data.data;
            this.loading = false;
          } else {
            this.loading = false;
            this.$notify.warning({
              title: "Oops!",
              message: "Something went wrong fetching the booking details.",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error Booking details: ", err);
          this.$notify.warning({
            title: "Oops!",
            message: "Something went wrong fetching the booking details.",
          });
        });
    },
    handleCancelEvent(event) {
      event["id"] = event["event_id"];
      this.$store.dispatch("cancelBooking", event);
      this.all_bookings = this._myybookings;
    },
  },
};
</script>

<style scoped></style>

<template>
  <div class="right-panel-wrapper">
    <el-col :span="24" style="padding: 0 20px">
      <el-calendar v-model="calendar_date">
        <template slot="dateCell" slot-scope="{ data }">
          <div
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

    <el-col :span="24" style="padding: 0 40px" class="upcoming-bookings-container">
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
        <div
          class="events-box"
          @click="getBookingDetails(event)"
          :class="[!isReadyToJoin(event) ? '' : [randomAni(), 'join-now-bg'] ]"
        >
         <!-- :class="{'join-now-bg' : isReadyToJoin(event) }]" -->
          <el-col :span="4">
            <el-tooltip
              class="item speaker-icon"
              :content="event.speaker ? event.speaker.name : 'Smartcharts'"
              placement="top"
              effect="light"
            >
              <el-avatar
                class="speaker-avatar-circle"
                :class="{ 'green-border': isReadyToJoin(event) }"
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
      event_list: [],
      all_bookings: [],
      event_on_this_day: [],
      my_events_upcoming: [],
      my_events_for_today: [],
      calendar_date: new Date(),
      selected_booking: {},
      loading: false,
      coockie_timezone: "",
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
    if (this.$cookies.get("timezone")) {
      this.coockie_timezone = this.$cookies.get("timezone").timezone;
    }
  },
  methods: {
    randomAni() {
      return 'animation-' + Math.floor((Math.random() * 3) + 1);
    },
    isReadyToJoin(event) {
      let now = new Date().getTime();
      let start = new Date(event.start_at.utc + " UTC").getTime();
      if (
        Number(start) < Number(now) ||
        (Number(start) - Number(now)) / 1000 / 60 < 15
      ) {
        return true;
      } else return false;
    },
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
          this.removeCompletedEvents();

          this.all_bookings.sort(function (a, b) {
            return new Date(a.start_at.utc) - new Date(b.start_at.utc);
          });
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
      // var d = (event.start_at ? event.start_at.utc : event.start_date) + " UTC";
      var d = event.start_at ? event.start_at.utc : event.start_date;

      var new_start =
        this.$moment(d).format("MMMM DD YYYY, h:mm:ss a") + " UTC";

      const start_formatted_date = new Date(new_start);

      /* eslint-disable */
      var timeZone = this.$cookies.get("_detected_current_tz");

      var local_date_formatted = new Date(start_formatted_date).toLocaleString(
        "default",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: timeZone,
        }
      );

      return local_date_formatted;
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
      this.removeCompletedEvents();
    },
    removeCompletedEvents() {
      this.all_bookings = this.all_bookings.filter(function (item) {
        let now = new Date().getTime();
        // let end = new Date(item.end_at.utc + " UTC").getTime(); // dont work on safari
        let end = new Date(item.end_at.utc).getTime();
        return Number(end) > Number(now);
      });
    },
  },
};
</script>

<style scoped>
.join-now-bg{
  background: #a4f14a57;
  border: 0.5px solid #a4f14a;
  /* animation: jump-shaking-1 3s infinite; */
}
.animation-1{
  animation: jump-shaking-1 3s infinite;
}
.animation-2{
  animation: jump-shaking-2 3s infinite;
}
.animation-3{
  animation: jump-shaking-2 3s infinite;
}

.green-border {
  border: 1.5px solid #a4f14a57;
}
@keyframes jump-shaking-1 {
  0% { transform: translateX(0) }
  3% { transform: translateY(-1px) }
  6% { transform: translateY(-1px) rotate(0.5deg) }
  9% { transform: translateY(-1px) rotate(-0.5deg) }
  12% { transform: translateY(-1px) rotate(0.5deg) }
  15% { transform: translateY(-1px) rotate(-0.5deg) }
  18% { transform: translateY(0) rotate(0) }
  50% { transform: translateY(0) rotate(0) }
  100% { transform: translateY(0) rotate(0) }
}
@keyframes jump-shaking-2 {
  0% { transform: translateY(0) rotate(0) }
  20% { transform: translateY(0) rotate(0) }
  50% { transform: translateY(-1px) }
  85% { transform: translateY(-1px) rotate(0.5deg) }
  89% { transform: translateY(-1px) rotate(-0.5deg) }
  92% { transform: translateY(-1px) rotate(0.5deg) }
  97% { transform: translateY(-1px) rotate(-0.5deg) }
  100% { transform: translateY(0) rotate(0) }
}
@keyframes jump-shaking-3 {
  0% { transform: translateY(0) rotate(0) }
  2%{ transform: translateY(-1px) rotate(0.5deg) }
  4% { transform: translateY(0) rotate(0) }
  6% { transform: translateY(-1px) rotate(0.5deg) }
  8% { transform: translateY(0) rotate(0) }
  50% { transform: translateY(-1px) rotate(-0.5deg) }
  52% { transform: translateY(-1px) rotate(0.5deg) }
  56% { transform: translateY(-1px) rotate(-0.5deg) }
  58% { transform: translateY(-1px) rotate(-0.5deg) }
  60% { transform: translateY(0) rotate(0) }
  100% { transform: translateY(0) rotate(0) }
}
</style>

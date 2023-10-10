<template>
  <div class="right-panel-wrapper">
    <el-col :span="24" style="padding: 0 20px">
      <el-calendar v-model="calendar_date">
        <template slot="dateCell" slot-scope="{ data }">
          <div class="calendar-date" @click="getDate(data)">
            {{ data.day.split("-").slice(2).join("-") }}
            <div style="display: block; width: 100%; margin-top: -7px">
              <span v-for="(dot, index) in getDots(data)" :key="index" class="dot">
              </span>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-col>

    <el-col v-if="list_inprogress.length !== 0" :span="24" style="padding: 0 20px" class="in-progress-bookings-container">
      <h4 style="font-size: 14px; font-weight: 600">
        In Progress &nbsp;
      </h4>
      <el-col v-for="(event, i) in list_inprogress" :key="i" :span="24" style="margin-bottom: 8px">
        <div class="events-box" @click="getBookingDetails(event)"
          :class="[!isInProgress(event) ? '' : [readyToJoinAnimation(i), 'join-now-bg']]">
          <!-- :class="{'join-now-bg' : isInProgress(event) }]" -->
          <el-col :span="4" class="el-col-xl-3 el-col-lg-4 el-col-md-4">
            <country-flag :country="event.event_region === 'uk'
              ? 'gb'
              : event.event_region
              " size="small" style="float: left;
              /* margin: -1em 0.1em 0.1em -1em !important; */
              padding: 0;
              transform: scale(0.40);
              text-shadow: 0 0 #FFF;" />
            <el-tooltip class="item speaker-icon" :content="event.speaker ? event.speaker.name : 'Smartcharts'"
              placement="top" effect="light">
              <el-avatar class="speaker-avatar-circle" :class="{ 'green-border': isInProgress(event) }" :size="35" :src="require(`@/assets/images/speakers/${event.speaker ? event.speaker.avatar : 'smartcharts.png'
                }`)
                " style="margin-left: -10px; margin-top: .2em; position:static;
               ">
              </el-avatar>
            </el-tooltip>
          </el-col>
          <el-col :span="20" style="margin-top: .3rem;" class="el-col-xl-21 el-col-lg-20 el-col-md-20">
            <div class="bookings-title">
              {{ eventFullName(event) }}
              <!-- {{ event.event_type_name }} - -->
            </div>
            <div class="bookings-sub-title">
              {{ event.is_series && !isInProgress(event) ? "Session resumes at " : "" }} {{ getFormatedLocalTime(event) }}
              <el-badge v-if="event.status === 'Progress'" value="Pending" class="item">
              </el-badge>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-col>


    <el-col :span="24" style="padding: 0 20px" class="upcoming-bookings-container">
      <h4 style="font-size: 14px; font-weight: 600">
        My Upcoming Bookings &nbsp;
        <span v-loading="loading" element-loading-background="#2D2953"></span>
      </h4>
      <div v-if="list_upcoming.length === 0" class="no-booking-caption">
        No bookings to show
      </div>
      <el-col v-for="(event, i) in list_upcoming" :key="i" :span="24" style="margin-bottom: 8px">
        <div class="events-box" @click="getBookingDetails(event)"
          :class="[!isInProgress(event) ? '' : [readyToJoinAnimation(i), 'join-now-bg']]">
          <!-- :class="{'join-now-bg' : isInProgress(event) }]" -->
          <el-col :span="4" class="el-col-xl-3 el-col-lg-4 el-col-md-4">
            <country-flag :country="event.event_region === 'uk'
              ? 'gb'
              : event.event_region
              " size="small" style="float: left;
              /* margin: -1em 0.1em 0.1em -1em !important; */
              padding: 0;
              transform: scale(0.40);
              text-shadow: 0 0 #FFF;" />
            <el-tooltip class="item speaker-icon" :content="event.speaker ? event.speaker.name : 'Smartcharts'"
              placement="top" effect="light">
              <el-avatar class="speaker-avatar-circle" :class="{ 'green-border': isInProgress(event) }" :size="35" :src="require(`@/assets/images/speakers/${event.speaker ? event.speaker.avatar : 'smartcharts.png'
                }`)
                " style="margin-left: -10px; margin-top: .2em; position:static;
               ">
              </el-avatar>
            </el-tooltip>
          </el-col>
          <el-col :span="20" style="margin-top: .3rem;" class="el-col-xl-21 el-col-lg-20 el-col-md-20">
            <div class="bookings-title">
              {{ eventFullName(event) }}
              <!-- {{ event.event_type_name }} - -->
            </div>
            <div class="bookings-sub-title">
              {{ getFormatedLocalTime(event) }}
              <el-badge v-if="event.status === 'Progress'" value="Pending" class="item">
              </el-badge>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-col>

    <component :is="currentComponent" :date="date" :event_on_this_day="event_on_this_day"
      :my_events_for_today="my_events_for_today" :selected_booking="selected_booking" @close="CloseModal()"
      @cancel_event="handleCancelEvent" />
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
      cookie_timezone: "",
      list_inprogress: [],
      list_upcoming: [],
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
      this.cookie_timezone = this.$cookies.get("timezone").timezone;
    }
  },
  methods: {
    groupBookings() {
      let inprogress = [];
      let upcoming = [];
      this.all_bookings.forEach((value) => {
        if (this.isInProgress(value)) {
          var now = new this.$moment.utc();
          var startDay = new this.$moment(value.start_at.utc).utc(true);
          if (now.isSame(startDay, 'day')) {
            value.session_start = Number(startDay.valueOf());
            value.is_series = false;
          } else {
            value.session = this.eventSession(value);
            value.session_start = Number(value.session.start);
            value.start_at.utc = new this.$moment(value.session.start).utc();
            value.end_at.utc = new this.$moment(value.session.end).utc();
            value.is_series = true;
          }
          inprogress.push(value);
        } else {
          upcoming.push(value);
        }
      });

      //clear the list first for hot reload
      this.list_inprogress = inprogress.sort(function (a, b) {
        return a.session_start - b.session_start;
      });
      this.list_upcoming = upcoming;
    },
    readyToJoinAnimation(i) {
      const n = i + 1;
      return (n % 2 == 0) ? "animation-1" : "animation-2";
    },
    eventFullName(e) {
      var name = e.event_type_name;
      var sched = this.$moment(e.start_at.local).format("ddd Do MMM YYYY, HH:mm");

      return name + ", " + sched + ", FX";
    },
    isInProgress(event) {
      let now = new this.$moment.utc();
      let start = new this.$moment(event.start_at.utc).utc(true);
      let end = new this.$moment(event.end_at.utc).utc(true);

      return now.isBetween(start, end);
    },
    isReadyToJoin(event) {
      //support for 3 to 4 days events

      var start_time = new this.$moment(event.start_at.utc).utc(true);
      var end_time = new this.$moment(event.end_at.utc).utc(true);

      var today_session_start = new this.$moment.utc().hours(Number(start_time.format("H"))).minutes(Number(start_time.format("H")));
      var today_session_end = new this.$moment.utc().hours(Number(end_time.format("H"))).minutes(Number(end_time.format("m")));

      if (Number(end_time.format("H")) < Number(start_time.format("H"))) {
        today_session_end = today_session_end.add(1, 'd');
      }

      return (new this.$moment.utc().isBetween(today_session_start, today_session_end)) ? true : false;
    },
    eventSession(booking) {
      let now = new this.$moment.utc();
      let start_time = new this.$moment(booking.start_at.utc, "YYYY-MM-DD HH:mm").utc(true);
      let end_time = new this.$moment(booking.end_at.utc, "YYYY-MM-DD HH:mm").utc(true);

      const duration = new this.$moment.duration(end_time.diff(start_time));
      var schedules = [];
      for (; Number(start_time.valueOf()) <= Number(end_time.valueOf());) {
        var et = start_time.clone().add(Number(duration.hours()), 'hours').add(Number(duration.minutes()));

        let data = { st: start_time.valueOf(), et: et.valueOf() };
        schedules.push(data);
        start_time = start_time.add(1, 'd');
      }

      let filtered = schedules.filter(function (item) {
        return Number(item.et) > Number(now);
      });

      let is_open = now.isBetween(new this.$moment(filtered[0].st), new this.$moment(filtered[0].et));
      return {
        is_open: is_open,
        start: filtered[0].st,
        end: filtered[0].et,
        schedules: filtered
      };
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
    errorHandler() { },
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
          this.groupBookings();
          console.log(this.list_inprogress, '- inprogress');
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
      let filtered = this.all_bookings.filter(function (item) {
        let now = new Date(new Date().toUTCString()).getTime();
        // let end = new Date(item.end_at.utc + " UTC").getTime(); // dont work on safari
        let end = new Date(item.end_at.utc).getTime();

        return Number(end) > Number(now);
      });

      this.all_bookings = filtered;
    },
  },
};
</script>

<style scoped>
.join-now-bg{
  /* background-image: linear-gradient(
		#8db83c,
		#6c9224
	) !important */
  background: #6c9224;
  /* border: 0.5px solid #a4f14a; */
  /* animation: jump-shaking-1 3s infinite; */
}
.animation-1{
  animation: jump-shaking-1 3s infinite;
}
.animation-2{
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
</style>

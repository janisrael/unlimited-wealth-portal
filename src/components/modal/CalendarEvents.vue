<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="25%"
      top="3%"
      :before-close="handleClose"
      :modal="false"
      class="calendar-modal"
    >
      <el-col :span="24">
        <h4
          style="
            margin-left: 20px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
          "
        >
          My events
        </h4>
        <!-- {{ event_on_this_day }} -->
        <div v-if="myEvents.length === 0" class="no-booking-caption">
          No bookings for today
        </div>
        <el-col
          v-for="(event, i) in myEvents"
          :key="i"
          :span="24"
          style="margin-bottom: 8px; padding: 0px 20px"
        >
          <div class="events-box" @click="goToModal(event)">
            <el-col
              :span="4"
              v-if="event.speaker && event.speaker.avatar"
              class="el-col-xl-3 el-col-lg-4 el-col-md-4"
            >
              <country-flag
                :country="event.region === 'uk' ? 'gb' : event.region"
                size="small"
                style="
                  float: left;
                  /* margin: -1em 0.1em 0.1em -1em !important; */
                  padding: 0;
                  transform: scale(0.4);
                  text-shadow: 0 0 #fff;
                "
              />
              <el-tooltip
                class="item speaker-icon"
                :content="event.speaker.name"
                placement="top"
                effect="light"
              >
                <el-avatar
                  class="speaker-avatar-circle"
                  :size="35"
                  :src="
                    require(`@/assets/images/speakers/${event.speaker.avatar}`)
                  "
                  style="
                    margin-left: -10px;
                    margin-top: 0.2em;
                    position: static;
                  "
                >
                </el-avatar>
              </el-tooltip>
            </el-col>
            <el-col
              :span="20"
              style="margin-top: 0.3rem"
              class="el-col-xl-21 el-col-lg-20 el-col-md-20"
            >
              <div class="bookings-title">
                {{ event.name }}
                <!-- {{ event.event_type_name }} - -->
              </div>
              <div class="bookings-sub-title">
                {{ getFormatedLocalTime(event) }}
              </div>
            </el-col>
          </div>
        </el-col>
      </el-col>

      <el-col :span="24">
        <h4
          style="
            margin-left: 20px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
          "
        >
          Other events
        </h4>
        <div v-if="otherEvents.length === 0" class="no-booking-caption">
          No other events for today
        </div>
        <el-col
          v-for="(event, i) in otherEvents"
          :key="i"
          :span="24"
          style="margin-bottom: 8px; padding: 0px 20px"
        >
          <div class="events-box other-events" @click="goToModal(event)">
            <el-col
              :span="4"
              v-if="event.speaker && event.speaker.avatar"
              style="padding-top;: 5px"
              class="el-col-xl-3 el-col-lg-4 el-col-md-4"
            >
              <country-flag
                :country="event.region === 'uk' ? 'gb' : event.region"
                size="small"
                style="
                  float: left;
                  /* margin: -1em 0.1em 0.1em -1em !important; */
                  padding: 0;
                  transform: scale(0.4);
                  text-shadow: 0 0 #fff;
                "
              />
              <el-tooltip
                class="item speaker-icon"
                :content="event.speaker.name"
                placement="top"
                effect="light"
              >
                <el-avatar
                  class="speaker-avatar-circle"
                  :size="35"
                  :src="
                    require(`@/assets/images/speakers/${event.speaker.avatar}`)
                  "
                  style="
                    margin-left: -10px;
                    margin-top: 0.2em;
                    position: static;
                  "
                >
                </el-avatar>
              </el-tooltip>
            </el-col>
            <el-col
              :span="20"
              style="margin-top: 0.3rem"
              class="el-col-xl-21 el-col-lg-20 el-col-md-20"
            >
              <div class="bookings-title">
                {{ event.name }}
                <!-- {{ event.event_type_name }} - -->
              </div>
              <div class="bookings-sub-title">
                {{ getFormatedLocalTime(event) }}
              </div>
            </el-col>
          </div>
        </el-col>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CalendarEvents",
  props: {
    date: {
      required: true,
      type: Object,
    },
    event_on_this_day: {
      required: true,
      // type: Object
    },
    my_events_for_today: {
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: true,
    };
  },
  computed: {
    otherEvents() {
      return this.event_on_this_day.events.filter(
        (other_event) =>
          !this.my_events_for_today.find(
            ({ event_id }) => other_event.id === event_id
          )
      );
    },
    myEvents() {
      return this.event_on_this_day.events.filter((other_event) =>
        this.my_events_for_today.find(
          ({ event_id }) => other_event.id === event_id
        )
      );
    },
  },
  methods: {
    eventFullName(e) {
      var name = e.event_type_name;
      var sched = this.$moment(e.start_at.local).format(
        "ddd do MMM YYYY, HH:mm"
      );

      return name + ", " + sched + ", FX";
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit("close");
    },
    errorHandler() {},
    getName(name) {
      var trim_string = name.split(",")[0];
      return trim_string;
    },
    getDate(event) {
      var d = new Date(event.date);
      var month = d.toLocaleString("default", {
        month: "long",
      });
      var this_date = d.getDate();
      var dateExt = this.getDateExt(this_date);
      var day = this.getDay(event.date);
      var formated_date = "";

      var _start_time = new Date(event.start_at.local);
      var _end_time = new Date(event.end_at.local);
      // var start_time = _start_time.getTime()
      var start_currentHour = _start_time.getHours();
      start_currentHour = ("0" + start_currentHour).slice(-2);
      var start_currentMinute = _start_time.getMinutes();
      start_currentMinute = ("0" + start_currentMinute).slice(-2);

      var end_currentHour = _end_time.getHours();
      end_currentHour = ("0" + end_currentHour).slice(-2);
      var end_currentMinute = _end_time.getMinutes();
      end_currentMinute = ("0" + end_currentMinute).slice(-2);
      // if(this.type === 'upcoming') {
      //   formated_date = this_date + dateExt
      // } else {
      formated_date =
        this_date +
        dateExt +
        " " +
        month +
        ", " +
        day +
        " " +
        start_currentHour +
        ":" +
        start_currentMinute +
        " - " +
        end_currentHour +
        ":" +
        end_currentMinute;
      // }
      return formated_date;
    },
    getDay(date) {
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
    goToModal(event) {
      this.$root.$emit("open-upcoming-events-modal", event);
      this.$root.$emit("set-type", "upcoming");
    },
    getFormatedLocalTime(event) {
      // var d = (event.start_at ? event.start_at.utc : event.start_date) + " UTC";
      var d = event.start_at ? event.start_at.utc : event.start_date;

      var new_start =
        this.$moment(d).format("MMMM DD YYYY, h:mm:ss a") + " UTC";

      const start_formatted_date = new Date(new_start);

      /* eslint-disable */
      var timeZone = this.$cookies.get("_detected_current_tz");

      if (timeZone === null) {
        var url_timezone =
          "https://api.ipgeolocation.io/timezone?apiKey=" +
          process.env.VUE_APP_COOKIE_KEY;
        this.axios
          .get(url_timezone)
          .then((response) => {
            timeZone = response.data.timezone;
            var local_date_formatted = new Date(
              start_formatted_date
            ).toLocaleString("default", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour12: true,
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
              timeZone: timeZone,
            });

            return local_date_formatted;
          })
          .catch((error) => {
            console.log("unable to get timezone");
          });
      } else {
        var local_date_formatted = new Date(
          start_formatted_date
        ).toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: timeZone,
        });

        return local_date_formatted;
      }
    },
  },
};
</script>

<style scoped>
.bookings-title {
  /* font-size: 12px; */
  font-weight: 600;
  color: #ffffff;
}
.el-dialog__wrapper {
  backdrop-filter: none !important;
}
.other-events {
  background: #312b54;
  border: 0 none;
}
</style>

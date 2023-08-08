<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      top="3%"
      :before-close="handleClose"
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
          style="margin-bottom: 8px"
        >
          <div class="events-box">
            <el-col :span="4">
              <el-avatar
                :size="40"
                :src="avatar"
                @error="true"
                style="border: 1px solid #248cb3"
              >
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
                <!-- {{ event.name }} -->
                {{ getName(event.name) }}
              </div>
              <div class="bookings-sub-title">
                <!-- 12th April, Friday 18:00 - 21:00 -->
                {{ getDate(event) }}
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
          style="margin-bottom: 8px"
        >
          <div class="events-box">
            <el-col :span="4">
              <el-avatar
                :size="40"
                :src="avatar"
                @error="errorHandler"
                style="border: 1px solid #248cb3"
              >
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
                {{ getName(event.name) }}
              </div>
              <div class="bookings-sub-title">
                {{ getDate(event) }}
              </div>
            </el-col>
          </div>
        </el-col>
        <!-- <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              Navigating Volatile Markets
              </div>
              <div class="bookings-sub-title">
              3rd April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              Fast Timeframe Daily Webinar
              </div>
              <div class="bookings-sub-title">
              3rd April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col> -->
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
      avatar: require("../../assets/images/avatar.png"),
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
  },
};
</script>

<style scoped>
.bookings-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}
</style>

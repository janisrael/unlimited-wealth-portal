<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="35%"
      top="3%"
      :before-close="handleClose"
      class="upcoming-booking-modal"
    >
      <span slot="title" style="font-size: 14px; font-weight: 600">
        <country-flag
          :country="
            selected_booking.event_region === 'uk'
              ? 'gb'
              : selected_booking.event_region
          "
          size="small"
        />
        {{ selected_booking.event.name }}
      </span>

      <span slot="footer" class="dialog-footer" style="font-size: 12px">
        <el-row :gutter="20">
          <el-col :span="18" style="text-align: left" class="gray-text">
            Booking ID: {{ selected_booking.id }} &nbsp; Date:{{
              selected_booking.start_date
            }}
          </el-col>
          <el-col :span="6" style="text-align: right">
            <el-button type="danger" plain class="cancel-booking"
              >Cancel Booking</el-button
            >
          </el-col>
        </el-row>
      </span>

      <el-col :span="24">
        <el-card :body-style="{ padding: '0px', background: 'transparent' }">
          <img
            :src="selected_booking.event.event_type.image_url"
            class="image"
            style="width: 100%"
          />
          <div
            style="
              padding: 14px;
              position: relative;
              border-bottom: 1px solid #a1a0b2;
            "
          >
            <div style="position: absolute; top: -40%; right: 38%">
              <el-avatar
                :size="100"
                fit="cover"
                :src="
                  require(`@/assets/images/speakers/${selected_booking.event.speaker.avatar}`)
                "
              ></el-avatar>
            </div>

            <div style="text-align: center; padding-top: 1rem; font-size: 12px">
              <p class="speaker--name">
                {{ selected_booking.event.speaker.name }}
              </p>
              <p class="gray-text">
                {{ getFormatedLocalTime }}
              </p>
              <el-button type="success" style="width: 90%; margin-top: 10px"
                >JOIN</el-button
              >
              <!-- :disabled="disable" :class="{ 'btn-success-custom': selected_events.length > 0 }" @click="handleBook()" -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UpcomingBookingDetails",
  props: {
    selected_booking: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: true,
      can_join_booking: false,
      start_local_date: null,
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit("close");
    },
    errorHandler() {},

    getLocalTimezone() {
      var timezone = "";

      switch (this.selected_booking.event_region) {
        case "uk":
          timezone = "Europe/London";
          break;
        case "aus":
          timezone = "Australia/Sydney";
          break;
        case "phl":
          timezone = "Asia/Manila";
          break;
      }
      return timezone;
    },
  },
  computed: {
    getFormatedLocalTime() {
      var gmt = new Date()
        .toLocaleString("en", {
          timeZone: this.getLocalTimezone(),
          timeZoneName: "short",
        })
        .split(" ")[3];

      var start = this.selected_booking.start_at.local + " " + gmt;
      var end = this.selected_booking.end_at.local + " " + gmt;
      var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      var start_local_date = new Date(start).toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
      });

      var end_local_date = new Date(end).toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone: timeZone,
      });
      if (
        new Date(start_local_date).toDateString() ===
        new Date(end_local_date).toDateString()
      ) {
        //same day
        end_local_date = new Date(end).toLocaleString("default", {
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: timeZone,
        });
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.start_local_date = start_local_date;

      return start_local_date + " to " + end_local_date;
    },
    getCountdownDate() {
      let pluralize = require("pluralize");

      var countdowndate = new Date(
        this.selected_booking.start_at.local
      ).getTime();

      //FOR TESTING ONLY
      // countdowndate = new Date("August 2, 2023 18:59:00").getTime();

      var now = new Date().getTime();
      var timetodate = countdowndate - now;

      //--------- COMPUTATION----------
      var months = Math.floor(timetodate / (1000 * 60 * 60 * 24 * 31));
      var weeks = Math.floor(
        (timetodate % (1000 * 60 * 60 * 24 * 31)) / (1000 * 60 * 60 * 24 * 7)
      );
      var days = Math.floor(
        (timetodate % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
      );
      var hours = Math.floor(
        (timetodate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((timetodate % (1000 * 60 * 60)) / (1000 * 60));
      //--------- COMPUTATION----------

      console.log("months ", months);
      console.log("weeks ", weeks);
      console.log("days ", days);
      console.log("hours", hours);
      console.log("minutes ", minutes);

      if (months > 0) {
        //more than a month
        if (weeks > 0) {
          return `Event starts in ${pluralize(
            "month",
            months,
            true
          )} ${pluralize("week", Math.round(weeks), true)}`;
        } else {
          return `Event starts in ${pluralize("month", months, true)}`;
        }
      } else {
        //less than a month
        if (weeks > 0) {
          //more than a week
          if (days > 0) {
            return `Event starts in ${pluralize(
              "week",
              weeks,
              true
            )} ${pluralize("day", days, true)}`;
          } else {
            return `Event starts in ${pluralize("week", weeks, true)}`;
          }
        } else {
          //less than a week
          if (days > 0) {
            //more than a day
            if (hours > 0) {
              return `Event starts in ${pluralize(
                "day",
                days,
                true
              )} ${pluralize("hour", hours, true)}`;
            } else {
              return `Event starts in ${pluralize("day", days, true)}`;
            }
          } else {
            //less than a day
            if (hours > 0) {
              //more than an hour
              if (minutes > 0) {
                return `Event starts in ${pluralize(
                  "day",
                  days,
                  true
                )} ${pluralize("hour", hours, true)}`;
              } else {
                return `Event starts in ${pluralize("day", days, true)}`;
              }
            } else {
              //less than an hour and more than 15mins
              if (minutes > 0 && minutes > 15) {
                return `Event starts in ${pluralize("minute", minutes, true)}`;
              } else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.can_join_booking = true;
                return `JOIN`;
              }
            }
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  background: transparent !important;
  color: white;
  border: 0;
}
.speaker--name {
  font-weight: 600;
  font-size: large;
  padding-bottom: 12px;
}

.el-dialog--footer {
  border-top: 1px solid;
  padding-top: 20px;
}
.gray-text {
  color: #a1a0b2;
}
</style>

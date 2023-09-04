<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="25%"
      top="3%"
      :before-close="handleClose"
      :modal="false"
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
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="6" style="text-align: left" class="gray-text">
            <div class="grid-content">
              Booking ID: {{ selected_booking.id }}
            </div>
          </el-col>
          <el-col :span="4" style="text-align: left" class="gray-text">
            <div class="grid-content">
              Date:
              {{ getFormatedDate(selected_booking.start_date) }}
            </div>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <div class="grid-content">
              <el-tooltip class="item" content="Coming soon" placement="top">
                <el-button type="danger" plain class="cancel-booking"
                  >Cancel Booking</el-button
                >
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </span>

      <el-col :span="24">
        <el-card :body-style="{ padding: '0px', background: 'transparent' }">
          <img
            :src="selected_booking.event.event_type.image_url"
            style="display: none"
          />

          <img
            :src="selected_booking.event.event_type.image_url"
            class="image"
            style="width: 100%; height: auto"
            :alt="selected_booking.event.name"
            width="550"
            height="300"
          />
          <div
            style="
              padding: 14px;
              position: relative;
              border-bottom: 1px solid #a1a0b2;
            "
          >
            <el-avatar
              style="
                position: absolute;
                top: 0;
                right: 50%;
                transform: translate(50%, -50%);
              "
              :size="130"
              fit="cover"
              :src="
                require(`@/assets/images/speakers/${selected_booking.event.speaker.avatar}`)
              "
            ></el-avatar>

            <div style="text-align: center; padding-top: 3rem; font-size: 12px">
              <p class="speaker--name">
                {{ selected_booking.event.speaker.name }}
              </p>
              <p class="gray-text">
                {{ getFormatedLocalTime }}
              </p>
              <el-link
                :href="can_join_booking ? selected_booking.join_url : '#'"
                style="width: 90%; margin-top: 10px"
                target="_blank"
              >
                <el-button
                  type="success"
                  :disabled="!can_join_booking"
                  :class="{ 'btn-success-custom': can_join_booking }"
                  >{{ getCountdownDate }}</el-button
                >
              </el-link>
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
    getFormatedDate(date) {
      var formated_date = new Date(date).toLocaleString("default", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      return formated_date;
    },
  },
  computed: {
    getFormatedLocalTime() {
      var start = this.selected_booking.start_at.utc + " UTC";
      var end = this.selected_booking.end_at.utc + " UTC";

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
        });
      }
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
.el-dialog__wrapper {
  backdrop-filter: none !important;
}
.el-link.is-underline:hover:after {
  border-bottom: none;
}
</style>

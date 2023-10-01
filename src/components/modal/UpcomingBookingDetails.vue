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
      <!-- <span slot="title" style="font-size: 14px; font-weight: 600">
        <country-flag
          :country="
            selected_booking.event_region === 'uk'
              ? 'gb'
              : selected_booking.event_region
          "
          size="small"
        />
        {{ selected_booking.event.name }}
      </span> -->

      <span slot="footer" class="dialog-footer" style="font-size: 12px">
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col
            :span="can_join_booking ? 16 : 6"
            style="text-align: left"
            class="gray-text"
          >
            <div class="grid-content">
              Booking ID: {{ selected_booking.id }}
            </div>
          </el-col>
          <el-col
            :span="can_join_booking ? 8 : 4"
            :style="{ 'text-align': can_join_booking ? 'right' : 'left' }"
            class="gray-text"
          >
            <div class="grid-content">
              Date:
              {{ getFormatedDate(selected_booking.start_date) }}
            </div>
          </el-col>
          <el-col :span="8" style="text-align: right" v-if="!can_join_booking">
            <div class="grid-content">
              <el-button
                type="danger"
                plain
                class="cancel-booking"
                @click="cancelBooking(selected_booking)"
                >Cancel Booking</el-button
              >
            </div>
          </el-col>
        </el-row>
      </span>

      <el-col :span="24">
        <el-card :body-style="{ padding: '0px', background: 'transparent' }">
          <img :src="default_banner" style="display: none" />
          <div
            class="upcoming-booking-image-wrapper"
            :style="{ 'background-image': 'url(' + default_banner + ')' }"
          >
            <span
              slot="title"
              style="
                font-size: 14px;
                font-weight: 600;
                padding: 5px 10px;
                display: block;
                margin-top: 12px;
              "
            >
              <!-- {{ selected_booking.event.name }} -->
              <div style="font-size: 18px; text-shadow: 1px 1px 2px #343434">
                {{ selected_booking.event.name.split(",")[0] }}
              </div>
              <!-- <span> {{ selected_booking.event.name.split(",")[(1, 2)] }}</span> -->
              <div style="text-shadow: 1px 1px 2px #343434">
                {{ formatText(selected_booking.event.name) }}
              </div>
              <country-flag
                class="upcoming-pop-up-flag"
                :country="
                  selected_booking.event_region === 'uk'
                    ? 'gb'
                    : selected_booking.event_region
                "
                size="big"
              />
            </span>
            <!-- <img
            :src="default_banner"
            class="image"
            style="width: 100%; height: auto"
            :alt="selected_booking.event.name"
            width="550"
            height="300"
          /> -->
          </div>

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
                style="width: 100%; margin-top: 10px; display: block"
                target="_blank"
              >
                <el-button
                  style="width: 100%"
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
      default_banner: require("../../assets/images/event_type_banner.png"),
    };
  },
  methods: {
    formatText(value) {
      let str = value.substring(value.indexOf(","));

      if (str[0] == ",") {
        str = str.substring(1);
      }
      return str;
    },
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
    cancelBooking(booking) {
      this.$confirm(
        "Are you sure you want to delete this booking?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning",
        }
      )
        .then(() => {
          let url =
            process.env.VUE_APP_API_URL +
            "/api/account/booking/" +
            booking.id +
            "/cancel";
          this.axios
            .post(url, null, {
              headers: {
                "X-Session-Key": sessionStorage.getItem("token"),
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then((response) => {
              if (response.status === 200) {
                this.$emit("cancel_event", booking);
                this.handleClose();

                this.$notify({
                  title: "Congratulations",
                  message: "Successfully deleted the booking",
                  type: "success",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
  },
  computed: {
    getFormatedLocalTime() {
      var start = this.selected_booking.start_at.utc;
      var end = this.selected_booking.end_at.utc;

      var new_start =
        this.$moment(start).format("MMMM DD YYYY, HH:mm") + " UTC";

      var new_end = this.$moment(end).format("MMMM DD YYYY, HH:mm") + " UTC";

      const start_formatted_date = new Date(new_start);
      const end_formatted_date = new Date(new_end);
      /* eslint-disable */
      var timeZone = this.$cookies.get("_detected_current_tz").timezone;

      var start_local_date_formatted = new Date(
        start_formatted_date
      ).toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        // timeZoneName: "short",
        timeZone: timeZone,
      });

      var end_local_date_formatted = new Date(
        end_formatted_date
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

      return start_local_date_formatted + " to " + end_local_date_formatted;
    },
    getCountdownDate() {
      let pluralize = require("pluralize");

      var start = this.selected_booking.start_at.utc + " UTC";
      var countdowndate = new Date(start).getTime();

      //FOR TESTING ONLY
      // countdowndate = new Date("September 5, 2023 16:19:00").getTime();

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
                  "hour",
                  hours,
                  true
                )} ${pluralize("minute", minutes, true)}`;
              } else {
                return `Event starts in ${pluralize("hour", hours, true)}`;
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
  /* color: #a1a0b2; */
}
.el-dialog__wrapper {
  backdrop-filter: none !important;
}
.el-link.is-underline:hover:after {
  border-bottom: none;
}
</style>

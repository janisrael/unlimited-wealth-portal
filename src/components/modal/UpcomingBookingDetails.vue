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
        hour: "",
        minute: "",
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

      return start_local_date + " to " + end_local_date;
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

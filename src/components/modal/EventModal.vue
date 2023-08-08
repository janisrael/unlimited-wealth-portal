<template>
<div>
  <!-- eslint-disable -->
  <el-dialog :title="event.name" :visible.sync="dialogVisible" width="50%" top="3%" :close-on-click-modal="true" :before-close="handleClose">
    <div v-if="stage > 0">
      <div style="text-align: center">
        <img :src="check_icon" />
      </div>
      <div style="text-align: center">
        <span style="
              font-size: 28px;
              color: #ffffff;
              margin-top: 40px;
              display: block;
            ">Your selected events are successfully booked!</span>
      </div>
      <div style="text-align: center">
        <el-button type="success" class="btn-done-booking" @click="handleClose()">Done</el-button>
      </div>
    </div>
    <div v-else>
      <span class="modal-span">{{ event.description }}</span>
      <el-col :span="24">
        <div style="
              display: inline-block;
              width: 100%;
              text-align: left;
              padding: 20px 5px 10px;
            ">
          <div style="display: inline-block; padding: 0 50px 0 0">
            <div style="color: #a2b0d5; font-zie: 12px">Region:</div>
            <div style="color: #ffffff; text-transform: uppercase">
              {{ region }}
            </div>
          </div>

          <div style="display: inline-block; padding: 0 50px">
            <div style="color: #a2b0d5; font-zie: 12px">Duration:</div>
            <div style="color: #ffffff">{{ event.typical_duration }}</div>
          </div>
          <div v-if="type === 'upcoming'" style="display: inline-block">
            <div style="color: #a2b0d5; font-zie: 12px">Occurrence:</div>
            <div v-if="event.typical_occurence" style="color: #ffffff">
              {{ event.typical_occurence }}
            </div>
            <div v-else style="color: #ffffff">-</div>
          </div>
        </div>
        <span v-if="type === 'recording'" style="color: #ffffff; padding: 30px 0 15px; display: inline-block">Available past recordings:</span>
        <span v-else style="color: #ffffff; padding: 30px 0 15px; display: inline-block">Book from available dates:</span>

        <!-- <div v-if="type === 'recording'" class="video-wrapper" :style="{ backgroundImage: 'url(' + thumbnail_image + ')' }"> -->
        <div v-if="type === 'recording'" class="video-wrapper">
          <div class="player-container">
            <vue-core-video-player @play="handlePLay()" :src="video_url"></vue-core-video-player>
          </div>
        </div>

        <div v-loading="this_load" v-if="type === 'upcoming'" id="carousel-wrapper" style="height: 170px">
          <div v-if="event_list.length" style="min-height: 170px">
            <el-col :span="24">
              <VueSlickCarousel ref="slick" class="slick-list-upcoming" v-bind="settings">
                <div v-for="(event, i) in event_list" :key="i" v-if="!event.hidden" class="carousel-block">
                  <div class="carousel-content-upcoming" :class="{ 'selected-event': event.selected == true }" @click="getSelected(event, i)">
                    <div class="carousel-check-wrapper">
                      <el-checkbox v-model="event.selected" class="carousel-checked"></el-checkbox>
                    </div>

                    <div class="carousel-day">{{ getDate(event.date) }}</div>
                    <div class="carousel-formated-date">
                      {{ getFormatedDate(event.date) }}
                    </div>
                    <div>{{ getMonth(event.date) }}</div>

                    <div class="speaker-wrapper">
                      <el-tooltip class="item speaker-icon" content="Amy Green" placement="top" effect="light">
                        <el-button icon="el-icon-user" circle size="mini"></el-button>
                      </el-tooltip>
                    </div>

                    <el-tooltip class="item speaker-icon" effect="light" :content="getFormatedLocalTime(event.start_at.local)" placement="bottom">
                      <div v-if="type === 'upcoming'" class="sub-wrapper" style="display: inline-block; margin-top: 10px">
                        <i class="el-icon-alarm-clock speaker-icon"></i>
                        <span class="speaker-name">
                          {{ getFormatedTime(event.start_at.local) }}</span>
                        <p class="speaker-name">{{ getLocalTimezone() }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </VueSlickCarousel>
            </el-col>
          </div>
          <div v-else style="min-height: 170px">No available dates</div>
        </div>

        <!--  carousels recordnings -->
        <div v-else id="carousel-wrapper">
          <VueSlickCarousel v-if="event_list.length" ref="slick" v-bind="settings">
            <div v-for="(event, i) in event_list" :key="i" class="carousel-block">
              <div class="carousel-content" @click="getSelected(event, i)">
                {{ getFormatedDate(event.date) }}
                <div><i class="el-icon-video-play icon-play"></i></div>
              </div>
            </div>
          </VueSlickCarousel>
        </div>
        <div v-if="type === 'upcoming'" style="display: block; width: 100%; margin-top: 20px">
          <el-button :loading="loading" type="success" :disabled="disable" style="width: 100%" :class="{ 'btn-success-custom': selected_events.length > 0 }" @click="handleBook()">Book</el-button>
        </div>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="dialogVisible = false">Confirm</el-button> -->
      </span>
    </div>
  </el-dialog>
</div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// import VueCoreVideoPlayer from 'vue-core-video-player'
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
export default {
  name: "EventModal",
  components: {
    VueSlickCarousel,
    // VueCoreVideoPlayer
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    event_list: {
      type: Array,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: true,
      thumbnail_image: require("../../assets/images/video-thumbnail.png"),
      check_icon: require("../../assets/images/check.png"),
      settings: {
        dots: false,
        focusOnSelect: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        touchThreshold: 9,
        arrows: true,
        centerMode: false,
        accessibility: true,
        edgeFriction: 0.35,
      },
      video_url: "",
      disable: true,
      selected_events: [],
      stage: 0,
      loading: false,
      this_load: true,
      local_timezone: this.getLocalTimezone(),
    };
  },
  beforeDestroy() {
    this.stage = 0;
  },
  mounted() {
    // if (this.event_list.length > 0) {
    //   this.this_load = true
    // }
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     // spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   });
    // this.this_load = true
    setTimeout(() => {
      /* eslint-disable */
      this.this_load = false;
      // loading.close()
    }, 1000);
  },
  methods: {
    handleBook() {
      if (this.selected_events.length > 0) {
        this.loading = true;
        this.disable = true;
        console.log(this.selected_events, "selected");
        let event_ids = [];
        this.selected_events.forEach((value) => {
          event_ids.push(value.id);
        });

        let url = process.env.VUE_APP_API_URL + "/api/bookings/register";
        this.axios
          .post(
            url, {
              event_ids: event_ids,
            }, {
              headers: {
                "X-Session-Key": this.token,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              this.stage = 1;
              this.loading = false;
              this.disable = false;
              console.log(this.selected_events, "selected_events");
              this.$store
                .dispatch("addBooking", this.selected_events)
                .then((response) => {
                  // if (response.status === 200) {
                  //     // console.log('addbooking')
                  //     // console.log(response)
                  //     this.stage = 1
                  //     this.loading = false
                  // }
                });
            } else {
              this.loading = false;
              this.disable = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.stage = 0;
            this.loading = false;
            this.disable = false;
          });
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit("close");
    },
    handlePLay() {
      console.log("play");
    },
    getDate(date) {
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
        month: "short",
      });
      return month;
    },
    getFormatedDate(date) {
      var d = new Date(date);
      var month = d.toLocaleString("default", {
        month: "short",
      });
      var this_date = d.getDate();
      var dateExt = this.getDateExt(this_date);

      var formated_date = "";
      if (this.type === "upcoming") {
        formated_date = this_date + dateExt;
      } else {
        formated_date = this_date + dateExt + " " + month;
      }
      return formated_date;
    },
    getLocalTimezone() {
      var timezone = "";

      switch (this.region) {
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
    getFormatedTime(datetime) {
      var d = new Date(datetime);
      var time = d.toLocaleString("default", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
      });

      return time;
    },
    getFormatedLocalTime(datetime) {
      var gmt = new Date()
        .toLocaleString("en", {
          timeZone: this.local_timezone,
          timeZoneName: "short",
        })
        .split(" ")[3];
      var d = datetime + " " + gmt;
      var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      var local_date = new Date(d).toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone: timeZone,
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
    getSelected(event, index) {
      setTimeout(() => {
        /* eslint-disable */
        // let selected_events = []
        if (this.type === "upcoming") {
          if (this.event_list[index].selected === true) {
            this.event_list[index].selected = false;
            this.disable = true;

            this.selected_events.splice(index, 1);
          } else {
            this.disable = false;
            this.event_list[index].selected = true;
            this.selected_events.push(this.event_list[index]);
          }
        } else {
          this.event_list.forEach((value, index) => {
            value.selected = false;
            this.disable = true;
          });
          this.disable = false;
          this.event_list[index].selected = true;
        }
        if (this.type === "recording") {
          this.getVideo(event);
        }

        console.log(this.selected_events, "selected_events");
        this.$refs.slick.goTo(index);
      }, 20);
    },
    getVideo(event) {
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
            this.video_url = response.data.data.video_recording_url;
            // console.log();
          }
        });
    },
  },
};
</script>

<style scoped></style>

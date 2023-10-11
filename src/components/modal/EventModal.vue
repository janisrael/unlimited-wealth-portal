<template>
  <div>
    <!-- eslint-disable -->
    <el-dialog
      :title="event_type.name"
      :visible.sync="dialog_visible"
      width="50%"
      top="3%"
      class="event_modal_wrapper"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div v-if="stage > 0">
        <div style="text-align: center">
          <img :src="check_icon" />
        </div>
        <div style="text-align: center">
          <span
            style="
              font-size: 28px;
              color: #ffffff;
              margin-top: 40px;
              display: block;
            "
            >Your selected events are successfully booked!</span
          >
        </div>
        <div style="text-align: center">
          <el-button
            type="success"
            class="btn-done-booking"
            @click="handleClose()"
            >Done</el-button
          >
        </div>
      </div>
      <div v-else>
        <span
          class="modal-span"
          v-if="event_type.description"
          style="padding-bottom: 20px"
          >{{ event_type.description }}</span
        >
        <el-col :span="24">
          <div
            style="
              display: inline-block;
              width: 100%;
              text-align: left;
              padding: 0px 5px 10px;
            "
          >
            <div style="display: inline-block; padding: 0 50px 0 0">
              <div style="color: #a2b0d5; font-zie: 12px">Region:</div>
              <div style="color: #ffffff; text-transform: uppercase">
                {{ region }}
              </div>
            </div>

            <div
              style="display: inline-block; padding: 0 50px"
              v-if="event_type.typical_duration"
            >
              <div style="color: #a2b0d5; font-zie: 12px">Duration:</div>
              <div style="color: #ffffff">
                {{ event_type.typical_duration }}
              </div>
            </div>
            <div v-if="type === 'upcoming'" style="display: inline-block">
              <div style="color: #a2b0d5; font-zie: 12px">Occurrence:</div>
              <div v-if="event_type.typical_occurence" style="color: #ffffff">
                {{ event_type.typical_occurence }}
              </div>
              <div v-else style="color: #ffffff">-</div>
            </div>
          </div>

          <!-----My bookings---->
          <span
            v-if="type === 'upcoming'"
            style="color: #ffffff; padding: 20px 0 5px; display: inline-block"
            >My booked events:</span
          >

          <div
            v-loading="this_load"
            v-if="type === 'upcoming'"
            id="carousel-wrapper"
            style="height: 240px"
          >
            <div v-if="countBooked > 0" style="min-height: 170px">
              <el-col :span="24">
                <VueSlickCarousel
                  ref="slickBooked"
                  class="slick-list-upcoming"
                  v-bind="settings"
                >
                  <div
                    v-for="(event, i) in checkPending(event_list)"
                    :key="i"
                    v-if="
                      event._related_booking.progress !== undefined &&
                      !event.hidden
                    "
                    class="carousel-block"
                    @click="checkThisEvent(event)"
                  >
                    <div
                      class="carousel-content-mybooked-events booked_carousel_item"
                      :class="
                        ({ 'selected-event': event.selected == true },
                        {
                          'event-completed':
                            event.states.progress.toLowerCase() == 'completed',
                        },
                        {
                          'event-ongoing':
                            checkIfOngoing(event) == true
                        }),
                      "
                    >
                      <div class="carousel-check-wrapper">
                        <div class="carousel-checked">
                          <el-tooltip
                            v-if="
                              event._related_booking.progress.toLowerCase() ===
                                'confirmed' &&
                              event.states.progress.toLowerCase() ===
                                'upcoming' &&
                              !checkIfOngoing(event)
                            "
                            class="item speaker-icon"
                            content="Cancel Booking"
                            placement="top"
                            effect="light"
                          >
                            <i
                              @click="cancelBooking(event)"
                              class="el-icon-circle-close"
                            ></i>
                          </el-tooltip>
                          <el-badge
                            v-if="
                              event._related_booking.progress.toLowerCase() ===
                              'pending'
                            "
                            value="Pending"
                            class="item"
                          >
                          </el-badge>
                          <!-- join button at the top right -->
                          <!-- <a
                            v-if="
                              event._related_booking.progress.toLowerCase() ===
                                'confirmed' &&
                              event.states.progress.toLowerCase() ===
                                'upcoming' &&
                              checkIfOngoing(event)
                            "
                            :href="event._related_booking.join_url"
                            target="_blank"
                          >
                            <el-button
                              type="success"
                              size="mini"
                              class="modal-join-btn"
                              >JOIN</el-button
                            ></a
                          > -->
                        </div>
                      </div>
                      <!-- {{ event._related_booking.join_url }} -->
                      <!-- {{ event._related_booking.registration_key }} -->
                      <div class="carousel-day">{{ getDate(event.date) }}</div>
                      <div class="carousel-formated-date">
                        {{ getFormatedDate(event.date) }}
                      </div>
                      <div>{{ getMonth(event.date) }}</div>
                      <div
                        class="speaker-wrapper"
                        v-if="event.speaker && event.speaker.avatar"
                      >
                        <el-tooltip
                          class="item speaker-icon"
                          :content="event.speaker.name"
                          placement="top"
                          effect="light"
                        >
                          <el-avatar
                            size="small"
                            :src="
                              require(`@/assets/images/speakers/${event.speaker.avatar}`)
                            "
                          >
                          </el-avatar>
                        </el-tooltip>
                      </div>

                      <div v-if="checkIfOngoing(event) === true">
                        <el-tooltip
                          class="item speaker-icon"
                          effect="light"
                          :content="
                            'Event on Progress: ' +
                            getFormatedLocalTime(event.start_at.local)
                          "
                          placement="top"
                        >
                          <div
                            class="on-progress"
                            style="display: inline-block; margin-bottom: 10px"
                          >
                            <!-- <div class="on-progress">Event ongoing</div> -->
                            <i class="el-icon-alarm-clock speaker-icon"></i>
                            <span class="speaker-name">
                              {{ getFormatedTime(event.start_at.local) }}</span
                            >
                          </div>
                        </el-tooltip>
                        <div>
                          <a
                            :href="event._related_booking.join_url"
                            target="_blank"
                          >
                            <el-button
                              type="success"
                              size="mini"
                              class="modal-join-btn"
                              >JOIN</el-button
                            ></a
                          >
                        </div>
                      </div>
                      <div v-else>
                        <el-tooltip
                          class="item speaker-icon"
                          effect="light"
                          :content="getFormatedLocalTime(event.start_at.utc)"
                          placement="bottom"
                        >
                          <div
                            v-if="type === 'upcoming'"
                            class="sub-wrapper"
                            style="display: inline-block; margin-top: 10px"
                          >
                            <i class="el-icon-alarm-clock speaker-icon"></i>
                            <span class="speaker-name">
                              {{ getFormatedTime(event.start_at.local) }}</span
                            >
                            <p class="speaker-name">{{ getLocalTimezone() }}</p>
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </VueSlickCarousel>
              </el-col>
            </div>
            <div v-else style="min-height: 170px">No available dates</div>
          </div>
          <!-----end my bookings-->

          <span
            v-if="type === 'recording'"
            style="color: #ffffff; padding: 30px 0 15px; display: inline-block"
            >Available past recordings:</span
          >
          <span
            v-else
            style="color: #ffffff; padding: 30px 0 15px; display: inline-block"
            >Book from available dates:</span
          >
          <div v-if="type === 'recording'" class="video-wrapper">
            <el-radio-group
              style="padding-bottom: 10px"
              v-model="active_tab"
              size="medium"
              v-if="recordings_per_date.length > 0"
            >
              <el-radio-button
                v-for="(recording, i) in recordings_per_date"
                :name="recording"
                :label="`Recording ${i + 1}`"
              ></el-radio-button>
            </el-radio-group>
            <div class="player-container">
              <div
                v-loading="loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <vue-core-video-player
                  v-if="video_url"
                  @play="handlePlay()"
                  @loadstart="handleVideoLoaded()"
                  :cover="event_type.image_url"
                  :title="event_type.name"
                  :logo="require(`@/assets/images/speakers/smartcharts.png`)"
                  :src="video_url"
                ></vue-core-video-player>
                <div v-else style="position: relative">
                  <div
                    class="bg-image"
                    :style="`background-image: url(${event_type.image_url}),linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)); `"
                  ></div>
                  <div v-if="!video_url && !loading" class="bg-text">
                    <p>
                      The event for this date has ended and the video is being
                      prepared. <br />
                      It can take a few hours to process depending on the length
                      of the session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-loading="this_load"
            v-if="type === 'upcoming'"
            id="carousel-wrapper"
            style="height: 240px"
          >
            <div v-if="countAvailableToBook > 0" style="min-height: 170px">
              <el-col :span="24">
                <VueSlickCarousel
                  ref="slick"
                  class="slick-list-upcoming"
                  v-bind="settings"
                >
                  <!--   -->
                  <div
                    v-for="(event, i) in event_list"
                    :key="i"
                    v-if="
                      event._related_booking.progress === undefined &&
                      !event.hidden
                    "
                    class="carousel-block"
                  >
                    <div
                      class="carousel-content-upcoming"
                      :class="{ 'selected-event': event.selected == true }"
                      @click="getSelected(event, i)"
                    >
                      <div class="carousel-check-wrapper">
                        <el-checkbox
                          v-model="event.selected"
                          class="carousel-checked"
                        ></el-checkbox>
                      </div>

                      <div class="carousel-day">{{ getDate(event.date) }}</div>
                      <div class="carousel-formated-date">
                        {{ getFormatedDate(event.date) }}
                      </div>
                      <div>{{ getMonth(event.date) }}</div>
                      <div
                        class="speaker-wrapper"
                        v-if="event.speaker && event.speaker.avatar"
                      >
                        <el-tooltip
                          class="item speaker-icon"
                          :content="event.speaker.name"
                          placement="top"
                          effect="light"
                        >
                          <el-avatar
                            size="small"
                            :src="
                              require(`@/assets/images/speakers/${event.speaker.avatar}`)
                            "
                          >
                          </el-avatar>
                        </el-tooltip>
                      </div>

                      <el-tooltip
                        class="item speaker-icon"
                        effect="light"
                        :content="getFormatedLocalTime(event.start_at.utc)"
                        placement="bottom"
                      >
                        <div
                          v-if="type === 'upcoming'"
                          class="sub-wrapper"
                          style="display: inline-block; margin-top: 10px"
                        >
                          <i class="el-icon-alarm-clock speaker-icon"></i>
                          <span class="speaker-name">
                            {{ getFormatedTime(event.start_at.local) }}</span
                          >
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
            <VueSlickCarousel
              v-if="event_list.length"
              ref="slickRecording"
              v-bind="settingsRecordings"
            >
              <div
                v-for="(event, i) in event_list"
                :key="i"
                class="carousel-block"
              >
                <div class="carousel-content" @click="getSelected(event, i)">
                  {{ getFormatedDate(event.date) }}
                  <div><i class="el-icon-video-play icon-play"></i></div>
                </div>
              </div>
            </VueSlickCarousel>
          </div>
          <div
            v-if="type === 'upcoming'"
            style="display: block; width: 100%; margin-top: 20px"
          >
            <el-button
              :loading="loading"
              type="success"
              :disabled="disable"
              style="width: 100%"
              :class="{ 'btn-success-custom': selected_events.length > 0 }"
              @click="handleBook()"
              >Book</el-button
            >
          </div>
        </el-col>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import { generateRandomString } from "../../utils";
export default {
  name: "EventModal",
  components: {
    VueSlickCarousel,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    event_list: {
      type: Array,
      required: true,
      default: null,
    },
    event: {
      type: Object,
      required: false,
    },
    event_type: {
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
    active_events: {
      type: Array,
    },
    filtered_bookings: {
      type: Array,
    },
    event_type_bookings: {
      type: Array,
    },
  },
  data() {
    return {
      dialog_visible: true,
      thumbnail_image: require("../../assets/images/video-thumbnail.png"),
      check_icon: require("../../assets/images/check.png"),
      settingsRecordings: {
        dots: false,
        focusOnSelect: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        touchThreshold: 5,
        arrows: true,
        centerMode: false,
        accessibility: true,
        edgeFriction: 0.35,
      },
      settings: {
        dots: false,
        focusOnSelect: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        touchThreshold: 7,
        arrows: true,
        centerMode: false,
        accessibility: false,
        edgeFriction: 0.35,
        // waitForAnimate: true,
        // cssEase: "ease",
        // lazyLoad: "true",
        // initialSlide: null,
      },
      video_url: "",
      active_tab: "",
      active_event: {},
      disable: true,
      selected_events: [],
      recordings_per_date: [],
      stage: 0,
      loading: false,
      this_load: true,
      local_timezone: this.getLocalTimezone(),
      cookie_timezone: "",
      play_id: "",
    };
  },
  computed: {
    countBooked() {
      var booked = this.event_list.filter(function (e) {
        return e._related_booking.progress !== undefined;
      });

      return booked.length;
    },
    countAvailableToBook() {
      return this.event_list.length - this.countBooked;
    },
  },
  mounted() {
    this.this_load = false;
    if (this.event_list.length > 0 && this.type === "recording") {
      // eslint-disable-next-line vue/no-mutating-props
      this.event_list.sort(function (a, b) {
        return new Date(b.start_at.utc) - new Date(a.start_at.utc);
      });
      this.getVideo(this.event_list[0]);
    }
    if (this.event_list.length > 0 && this.type === "recording") {
      this.$nextTick(() => {
        this.$refs.slickRecording.goTo(this.event_list.length - 1);
      });
    }
  },
  methods: {
    /* eslint-disable */
    checkThisEvent(event) {
      console.log(event, "cghvjbkn");
    },
    checkIfOngoing(event) {
      // moment(localDt, localDtFormat).tz(timezone).format('YYYY-MM-DD hh:mm:ss A');
      let now = this.$moment.utc();
      // console.log(now, event.start_at.local, "event.start_at.local");
      var start_date = this.$moment(event.start_at.utc).utc(true);
      var end_date = this.$moment(event.end_at.utc).utc(true);

      if (start_date < now && end_date > now) {
        return true;
      } else {
        return false;
      }
    },
    checkPending(events) {
      // clear sessionStorage pending_bookings if event_list dont have pending status
      let events_list = events;
      let event_match = events.find(
        (b) => b._related_booking.progress === "pending"
      );
      if (!event_match) {
        localStorage.removeItem("pending_booking");
      }
      return events_list;
    },
    cancelBooking(active_event) {
      this.$confirm(
        "Are you sure you want to cancel this Booking?",
        "Warning",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          this.this_load = true;
          this.disable = true;
          active_event["token"] = this.token;
          this.$store
            .dispatch("cancelBooking", active_event)
            .then((response) => {
              this.loading = false;
              this.this_load = false;
              this.disable = false;
              this.$emit("cancel_events", active_event);
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
              this.this_load = false;
              this.disable = false;
            });
        })
        .catch((err) => {
          console.log(err);
          // this.$message({
          //   type: "info",
          //   message: "Delete canceled",
          // });
        });
    },
    handleBook() {
      if (this.selected_events.length > 0) {
        this.loading = true;
        this.this_load = true;
        this.disable = true;
        let event_ids = [];
        this.selected_events.forEach((value) => {
          event_ids.push(value.id);
        });

        let url = process.env.VUE_APP_API_URL + "/api/bookings/register";
        this.axios
          .post(
            url,
            {
              event_ids: event_ids,
            },
            {
              headers: {
                "X-Session-Key": this.token,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              let selected = this.selected_events;
              this.selected_events = [];
              this.$emit("book_events", selected);
              this.loading = false;
              this.this_load = false;
              this.disable = false;
            } else {
              this.loading = false;
              this.this_load = false;
              this.disable = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.stage = 0;
            this.loading = false;
            this.this_load = false;
            this.disable = false;
          });
      }
    },
    handleClose() {
      this.dialog_visible = false;
      this.$emit("close");
    },
    handlePlay() {
      // targeting <video> element of vue-core-video-player
      let vcpPlayerEl = document.querySelector(".vcp-container video");
      let now = new Date();
      let utc_timestamp = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      );

      let interval = setInterval(() => {
        // do nothing if video is paused
        if (vcpPlayerEl.paused || isNaN(vcpPlayerEl.duration)) {
          clearInterval(interval);
          return;
        }

        if (vcpPlayerEl.currentTime - 5 >= vcpPlayerEl.duration) {
          clearInterval(interval);
        }
        const decimalProgress =
          (vcpPlayerEl.currentTime / vcpPlayerEl.duration) * 100;
        let payload = {
          type: "event.recording.view",
          timestamp: Math.floor(utc_timestamp / 1000),
          data: {
            play_id: this.play_id,
            object: "event-recording-view-log",
            event_id: this.active_event.id,
            event_type_id: this.event_type.id,
            video_url: this.video_url,
            duration: vcpPlayerEl.duration,
            percent_progress: parseFloat(Number(decimalProgress).toFixed(2)),
            playing_timestamp: Math.ceil(vcpPlayerEl.currentTime),
            customer_id: window.localStorage.getItem("customer_id"),
          },
        };

        this.$store.dispatch("logVideoEvent", payload).then((response) => {
          if (response.status === 204) {
            // window.ENV.APP_ENV === 'local' && console.log('event.recording.view', payload);
          }
        });
      }, process.env.VUE_APP_SC2_EVENT_POST_INTERVAL_MS);
    },
    handleVideoLoaded() {
      let play_id = generateRandomString(8);
      this.play_id = play_id;
      let data = this.active_event;
      let payload = {
        type: "event.recording.play",
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          id: play_id,
          object: "event-recording-view-log",
          event_id: data.id,
          event_type_id: data.event_type_id,
          video_url: this.video_url,
        },
      };

      this.$store.dispatch("logVideoEvent", payload).then((response) => {
        if (response.status === 204) {
          window.ENV.APP_ENV === "local" &&
            console.log("event.recording.play", payload);
        }
      });
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
      var timeZone = this.$cookies.get("_detected_current_tz");
      // var gmt = new Date()
      //   .toLocaleString("en", {
      //     timeZone: timeZone,
      //     timeZoneName: "short",
      //   })
      //   .split(" ")[3];

      // var d = datetime + " " + gmt;

      var new_d = this.$moment(datetime).utc(true);

      // const formatted_date = new Date(new_d);
      // if (this.$cookies.get("timezone")) {
      //   this.coockie_timezone = this.$cookies.get("timezone").timezone;
      // }

      // console.log(this.coockie_timezone, "left this.coockie_timezone");
      var local_date_formatted = new Date(new_d).toLocaleString("default", {
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
      /* eslint-disable */
      // setTimeout(() => {
      this.$nextTick(() => {
        // let selected_events = []
        if (this.type === "upcoming") {
          if (this.event_list[index].selected === true) {
            this.event_list[index].selected = false;

            this.selected_events = this.selected_events.filter(
              (selected_event) => selected_event.id != event.id
            );

            if (this.selected_events.length <= 0) {
              this.disable = true;
            }
          } else {
            this.disable = false;
            this.event_list[index].selected = true;
            this.selected_events.push(this.event_list[index]);
          }
          let arr = this.event_list;
          let filtered_events = arr.filter((item) => {
            return item._related_booking.id === undefined;
          });

          let selected_index = filtered_events.findIndex((object) => {
            return object.id === event.id;
          });
          console.log(selected_index);

          this.$refs.slick.goTo(selected_index);
        } else {
          // this.event_list.forEach((value, index) => {
          //   value.selected = false;
          //   this.disable = true;
          // });
          this.event_list.forEach((value, index) => {
            value.selected = false;
          });

          this.event_list[index].selected = true;
          // if (this.event_list[index].selected === true) {
          //   this.event_list[index].selected = false;

          //   // this.selected_events = this.selected_events.filter(
          //   //   (selected_event) => selected_event.id != event.id
          //   // );

          //   // if (this.selected_events.length <= 0) {
          //   //   this.disable = true;
          //   // }
          // } else {
          //   // this.disable = false;

          //   // this.selected_events.push(this.event_list[index]);
          // }

          let arr = this.event_list;
          // let filtered_events = arr.filter((item) => {
          //   return item._related_booking.id === undefined;
          // });

          let selected_index = arr.findIndex((object) => {
            return object.id === event.id;
          });

          // this.disable = false;
          // this.event_list[index].selected = true;
          // console.log("no");
          console.log(selected_index);
          this.$refs.slickRecording.goTo(index);
        }

        if (this.type === "recording") {
          this.getVideo(event);
        }
      });
      // }, 20);
    },
    getVideo(event) {
      var url = event.meta.resource_path;
      this.loading = true;
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
            this.video_url =
              response.data.data.recordings.length > 0
                ? response.data.data.recordings[0]
                : null;

            this.active_tab = "Recording 1";
            this.active_event = event;
            this.recordings_per_date =
              response.data.data.recordings.length > 0
                ? response.data.data.recordings
                : [];

            this.event_list.sort(function (a, b) {
              return new Date(a.start_at.utc) - new Date(b.start_at.utc);
            });

            this.loading = false;
          }
        });
    },
  },
};
</script>

<style scoped>
.el-radio-button__inner {
  background: #312b54;
  border: 1px solid #312b54;
}
.el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #42427c;
  border-color: #42427c;
  box-shadow: -1px 0 0 0 #42427c;
}
</style>

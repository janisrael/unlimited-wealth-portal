<template>
  <div>
    <!-- eslint-disable -->

    <el-dialog
      :title="event_list[0].name"
      :visible.sync="dialog_visible"
      width="50%"
      top="3%"
      class="event_modal_wrapper"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <span
          class="modal-span"
          v-if="event_list[0].description"
          style="padding-bottom: 20px"
          >{{ event_list[0].description }}</span
        >
        <el-col :span="24">
          <!-- <div
            style="
              display: inline-block;
              width: 100%;
              text-align: left;
              padding: 0px 5px 10px;
            "
          > -->
          <!-- <div
              style="display: inline-block; padding: 0 50px"
              v-if="event_type.typical_duration"
            >
              <div style="color: #a2b0d5; font-zie: 12px">Duration:</div>
              <div style="color: #ffffff">
                {{ event_type.typical_duration }}
              </div>
            </div> -->
          <!-- <div v-if="type === 'upcoming'" style="display: inline-block">
              <div style="color: #a2b0d5; font-zie: 12px">Occurrence:</div>
              <div v-if="event_type.typical_occurence" style="color: #ffffff">
                {{ event_type.typical_occurence }}
              </div>
              <div v-else style="color: #ffffff">-</div>
            </div> -->
          <!-- </div> -->

          <!-----My bookings---->
          <!-- <span
            v-if="type === 'upcoming'"
            style="color: #ffffff; padding: 20px 0 5px; display: inline-block"
            >My booked events:</span
          > -->

          <!-- </div> -->
          <!-- <span
            style="color: #ffffff; padding: 30px 0 15px; display: inline-block"
            >Book from available dates:</span
          > -->
          <div
            id="videoWrapperDailyWebinar"
            class="video-wrapper-daily-webinar"
            v-loading="this_load"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div v-if="width" class="player-container">
              <vimeo-player
                ref="player"
                :video-id="event_list[0].vimeo_playlist"
                @ready="onReady"
                :player-height="height"
                :player-width="width"
              />
            </div>
          </div>

          <!-- <div
            v-loading="this_load"
            id="carousel-wrapper"
            style="height: 240px"
          >
            <div v-if="event_list > 0" style="min-height: 170px">
              <el-col :span="24">
                <VueSlickCarousel
                  ref="slick"
                  class="slick-list-upcoming"
                  v-bind="settings"
                >
                  <div
                    v-for="(event, i) in event_list"
                    :key="i"
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
            <div v-else style="min-height: 170px">No available videos</div>
          </div> -->
        </el-col>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import { generateRandomString } from "../../utils";
export default {
  name: "DailyWebinars",
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
      required: false,
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
      disable: true,
      loading: true,
      this_load: true,
      play_id: "",
      // videoID: "38648446",
      height: null,
      width: null,
      options: {
        muted: true,
        autoplay: true,
      },
      playerReady: false,
    };
  },
  mounted() {
    this.this_load = true;
    this.loading = false;
    this.$nextTick(() => {
      this.getDimension();
    });
  },
  methods: {
    /* eslint-disable */
    onReady() {
      this.this_load = false;
    },
    getDimension() {
      this.$nextTick(() => {
        var element = document.getElementById("videoWrapperDailyWebinar");
        var height = element.clientWidth * 0.56;
        this.width = element.clientWidth;
        this.height = height;
      });
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
            customer_id: window.sessionStorage.getItem("customer_id"),
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

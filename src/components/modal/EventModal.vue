<template>
  <div>
    <!-- eslint-disable -->
    <el-dialog
      :title="event.name"
      :visible.sync="dialog_visible"
      width="50%"
      top="3%"
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
          v-if="event.description"
          style="padding-bottom: 20px"
          >{{ event.description }}</span
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
              v-if="event.typical_duration"
            >
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

          <!-- active events -->
          <span
            v-if="type === 'upcoming' && active_events.length > 0"
            style="color: #ffffff; padding: 20px 0 5px; display: inline-block"
            >My booked events:</span
          >
      <!-- {{ ch1[1].message }} -->
          <div
            v-loading="this_load"
            v-if="type === 'upcoming' && active_events.length > 0"
            id="carousel-wrapper"
            style="height: 170px"
          >
            <div v-if="active_events.length" style="min-height: 170px">
              <el-col :span="24">
                <VueSlickCarousel
                  ref="slick1"
                  id="mybooking"
                  class="slick-list-upcoming"
                  v-bind="settings"
                >
                  <div
                    v-for="(active_event, i) in active_events"
                    :id="active_event.id + '_active_id'"
                    :key="i"
                    class="carousel-block"
                  >
                    <div
                      class="carousel-content-upcoming"
                      :class="[{'selected-event': active_event.selected == true}, {'booking-failed-container': getListener(active_event).is_booking_succesfull === 'false'}]"
                    >
                      <!-- <div class="carousel-check-wrapper">
                      <el-checkbox v-model="active_event.selected" class="carousel-checked"></el-checkbox>
                    </div> -->

                      <div class="carousel-day">
                        {{ getDate(active_event.date) }}
                      </div>
                      <div class="carousel-formated-date">
                        {{ getFormatedDate(active_event.date) }}
                      </div>
                      <div>{{ getMonth(active_event.date) }}</div>

                      <div class="speaker-wrapper">
                        <el-tooltip
                          class="item speaker-icon"
                          content="Amy Green"
                          placement="top"
                          effect="light"
                        >
                          <el-button
                            icon="el-icon-user"
                            circle
                            size="mini"
                          ></el-button>
                        </el-tooltip>
                      </div>

                      <el-tooltip
                        class="item speaker-icon"
                        effect="light"
                        :content="
                          getFormatedLocalTime(active_event.start_at.local)
                        "
                        placement="bottom"
                      >
                        <div
                          v-if="type === 'upcoming'"
                          class="sub-wrapper"
                          style="display: inline-block; margin-top: 10px"
                        >
                          <i class="el-icon-alarm-clock speaker-icon"></i>
                          <span class="speaker-name">
                            {{
                              getFormatedTime(active_event.start_at.local)
                            }}</span
                          >
                          <p class="speaker-name">{{ getLocalTimezone() }}</p>
                        </div>
                      </el-tooltip>
                      <div class="cancel-container"
                      v-if="active_event.states.progress== 'Booking'"
                      >
                      
                        <div v-if="getListener(active_event).is_booking_succesfull === 'true'">
                          <el-button type="danger" size="mini" plain
                            @click="cancelBooking(active_event)">Cancel</el-button
                          >
                        </div>
                        <div v-else-if="getListener(active_event).is_booking_succesfull === 'false'">
                          
                          <el-button type="info" size="mini" plain class="btn-failed">Failed</el-button
                          >
                        </div>
                        <div v-else>Booking...</div>

                        <!-- <el-button disabled type="info" size="mini" plain>{{ active_event.states.progress }}</el-button> -->
                        <!-- {{ active_event.states.progress }} -->
                        <!-- <el-button
                          v-if="active_event.states.progress === 'Booking'"
                          disabled
                          type="info"
                          size="mini"
                          plain
                          >  {{ getListener(active_event).status }}</el-button
                        > -->
                        
                      </div>
                      <div class="cancel-container"
                      v-else>
                        <el-button type="danger" size="mini" plain
                            @click="cancelBooking(active_event)">Cancel</el-button>
                    
                      </div>
                    </div>
                  </div>
                </VueSlickCarousel>
              </el-col>
            </div>
            <div v-else style="min-height: 170px">No available dates</div>
          </div>

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
            <el-tabs
              @tab-click="video_url = active_tab"
              type="card"
              v-model="active_tab"
              v-if="recordings_per_date.length > 0"
            >
              <el-tab-pane
                v-for="(recording, i) in recordings_per_date"
                :key="i"
                :name="recording"
                :label="`Recording ${i + 1}`"
              ></el-tab-pane>
            </el-tabs>
            <div class="player-container">
              <vue-core-video-player
                v-if="video_url"
                @play="handlePLay()"
                :cover="event.image_url"
                :title="event.name"
                :logo="require(`@/assets/images/speakers/smartcharts.png`)"
                :src="video_url"
              ></vue-core-video-player>
              <div v-else style="position: relative">
                <div
                  class="bg-image"
                  :style="`background-image: url(${event.image_url}),linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)); `"
                ></div>
                <div class="bg-text">
                  <p>
                    Retrieving webinar recording. Video will be availble soon.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-loading="this_load"
            v-if="type === 'upcoming'"
            id="carousel-wrapper"
            style="height: 170px"
          >
            <div v-if="event_list.length" style="min-height: 170px">
              <el-col :span="24">
                <VueSlickCarousel
                  ref="slick"
                  class="slick-list-upcoming"
                  v-bind="settings"
                >
                  <div
                    v-for="(event, i) in event_list"
                    :key="i"
                    v-if="!event.hidden"
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
                        :content="getFormatedLocalTime(event.start_at.local)"
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
              ref="slick"
              v-bind="settings"
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
    active_events: {
      type: Array,
    },
  },
  data() {
    return {
      dialog_visible: true,
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
      active_tab: "",
      disable: true,
      selected_events: [],
      recordings_per_date: [],
      stage: 0,
      loading: false,
      this_load: true,
      local_timezone: this.getLocalTimezone(),
      ch1: this.$pnGetMessage('customers.001Ae000005mU49IAE.booking', null),
      // selected_id: ''
    };
  },
  // beforeDestroy() {
  //   this.stage = 0;
  // },
  watch: {
    event_list() {
      console.log(" 2: watch eventmodal: ", this.event_list);
      if (this.event_list.length > 0) {
        this.getVideo(this.event_list[0]);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.this_load = false;
    }, 1000);
  },
  methods: {
    /* eslint-disable */
    cancelBooking(active_event) {
      // NOTE:: search from upcoming bookings where event_id = id, parameter active_event.id
      console.log(active_event.id)
      // console.log(this.$store.getters._myybookings,'return this.$store.getters._myybookings;')
      var my_bookings = this.$store.getters._myybookings
      var booking = my_bookings.filter((item) => {
        return item.event_id === active_event.id;
      });
      console.log(booking,'result')
      // NOTE:: post to api for cancel: params: booking.id
    },
    getListener(data) {
      // let channel = 'customers.001Ae000005mU49IAE.book-event.' + data.id
      let channel = 'customers.001Ae000005mU49IAE.booking'
      let result = {
        'is_booking_succesfull': 'booking'
      }      

      this.$pnSubscribe({ channels: [channel] });
      
      let ch1 = this.ch1
      if(ch1.length > 0) {
        // let lastElement = ch1[ch1.length - 1]; // get last data from array
        let userObj = JSON.parse(ch1[0].message);
        if(userObj.data.event_id === data.id) {
            //return userObj.data

            if (userObj.type === 'booking.confirmed') { //Booking success
              
              //insert userObj.data to upcoming booking list
              result['button_text'] = 'Cancel';
              result['is_booking_succesfull'] = 'true';
              
              
            } else { //Booking failed
              result['is_booking_succesfull'] = 'false';
              console.log('sd')

            }
            
        }
      }
      return result
    },
    handleBook() {
      if (this.selected_events.length > 0) {
        this.loading = true;
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
              // this.stage = 1;
              this.loading = false;
              this.disable = false;
              let _selectec_events = this.selected_events;
              this.selected_events = [];
              // eslint-disable-next-line no-unused-vars
              _selectec_events.forEach((value, index) => {
                value.states.progress = "Booking";
              });
              this.$emit("add_events", _selectec_events);
              this.$store
                .dispatch("addBooking", _selectec_events)
                // eslint-disable-next-line no-unused-vars
                .then((response) => {});
                // this.getListener(this.selected_events[0])
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
      this.dialog_visible = false;
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

        this.$refs.slick.goTo(index);
      }, 20);
    },
    getVideo(event) {
      var url = event.meta.resource_path;

      // SAMPLE URL WITH RECORDINGS
      // var url =
      //   "https://uw-portal-api.tinkerpub.com/api/events/a000C000005uXWbQAM";

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

            this.active_tab = this.video_url;

            this.recordings_per_date =
              response.data.data.recordings.length > 0
                ? response.data.data.recordings
                : [];

            console.log("video url: ", response.data);
          }
        });
    },
  },
};
</script>

<style scoped></style>

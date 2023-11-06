<template>
  <div>
    <el-dialog
      id="promotion-dialog"
      title=""
      :visible.sync="dialogVisible"
      width="60%"
      top="0%"
      :before-close="handleClose"
      :modal="false"
    >
      <el-col :span="24">
        <div class="promotion-content">
          <h3
            style="
              text-align: center;
              color: white;
              margin-bottom: 0px !important;
            "
          >
            We have launched the LIVE EVENTS section!
          </h3>
          <br />
          <p>
            From today, access to all of the live webinars is now available
            through a new section called LIVE EVENTS.
            <br />
            In this new section, you’ll be able to get both of the LFX webinars
            (Europe and Asia sessions).
            <br />
            <br />
            These will work in the same way they always have, including how you
            view sessions that have finished.
            <br />
            <br />
            And if you are an Unlimited Wealth customer, access to all of your
            webinars can now be booked here. It’s also the pace to watch the
            recordings of finished webinars, too.
            <br />
            <br />
            We’ll be running the old section and the new for a week but after
            that, you’ll need to access webinars from the LIVE EVENTS section.
            <br />
            <br />
            <br />Watch this video for more detail.
          </p>
          <div
            id="videoWrapperDailyWebinar"
            class="video-wrapper-daily-webinar"
            v-loading="this_load"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div v-if="width" class="player-container">
              <vimeo-player
                ref="player"
                :video-id="video_link"
                @ready="onReady"
                :player-height="height"
                :player-width="width"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
// import VideoPlayer from "./VideoPlayer.vue";
export default {
  name: "PromotionComponent",
  components: {
    // VideoPlayer,
  },
  data() {
    return {
      dialogVisible: true,
      video_link: "https://vimeo.com/879793575/8c1507b160",
      height: null,
      width: null,
      this_load: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getDimension();
    });
  },
  methods: {
    getDimension() {
      this.$nextTick(() => {
        var element = document.getElementById("videoWrapperDailyWebinar");
        var height = element.clientWidth * 0.56;
        this.width = element.clientWidth;
        this.height = height;
        this.this_load = false;
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit("close");
    },
    onReady() {
      console.log("reday");
    },
  },
};
</script>

<style scoped></style>

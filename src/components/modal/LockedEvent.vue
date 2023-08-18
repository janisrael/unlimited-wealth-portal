<template>
  <div>
    <el-dialog
      title="Unfortunately, your programme doesn’t include this event."
      :visible.sync="dialogVisible"
      width="50%"
      top="3%"
      class="locked-modal"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-col :span="24">
        <!-- {{ event }} -->
        <div
          style="
            display: inline-block;
            width: 100%;
            text-align: left;
            padding: 10px 5px 10px;
          "
        >
          <div style="color: #a2b0d5">
            If you would like to upgrade your programme please
            <el-link
              type="success"
              style="color: #5ce6e6 !important; cursor: pointer"
              >click this button</el-link
            >
            <br />
            and one of our mentors will contact you shortly.
          </div>
          <br />
          <div style="color: #a2b0d5">
            In the meantime, if you would like to find out more about what is
            included in our advanced <br />
            programmes click on the video to find out more.
          </div>

          <div class="video-wrapper" style="margin-top: 30px">
            <div class="player-container">
              <!-- <vue-core-video-player
                @play="handlePLay()"
                :src="event.meta.resource_path"
              ></vue-core-video-player> -->
              <div style="position: relative">
                <div
                  class="bg-image"
                  :style="`background-image: url(${event.image_url}), linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5));     
                  background-blend-mode: overlay;`"
                ></div>

                <div class="bg-text" style="background-color: transparent">
                  <el-button
                    icon="el-icon-lock"
                    circle
                    plain
                    style="font-size: 50px; padding: 1rem"
                  ></el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LockedEvent",
  props: {
    event: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  beforeDestroy() {
    this.dialogVisible = false;
  },
  created() {
    this.dialogVisible = true;
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit("close");
    },
    handlePLay() {},
  },
};
</script>

<style scoped></style>

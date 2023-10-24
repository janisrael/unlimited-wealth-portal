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
            <el-button
              type="text"
              style="color: #5ce6e6; border: 0; background: none"
              @click="sendEmail()"
              >click here</el-button
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
              <vue-core-video-player
                @play="handlePLay()"
                src="https://webinar-videos-smartcharts.s3.eu-west-2.amazonaws.com/no-access.mp4"
              ></vue-core-video-player>
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
    event_type: {
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
    sendEmail() {
      var url =
        process.env.VUE_APP_API_URL + "/api/my-account/register-interest";

      var content = {
        subject: "Upgrade Programme Request",
        meta: {
          event_type_id: this.event_type.id,
          event_name: this.event_type.name,
          platform: "UW-PORTAL",
        },
      };
      this.axios
        .post(url, content, {
          headers: {
            "X-Session-Key": localStorage.getItem("token"),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("true", response.data);
            this.$notify.info({
              title: "Request Sent",
              message:
                "One of our mentors will contact you shortly. Thank you. ",
            });
          } else {
            console.log("false", response.data);
            this.$notify.error({
              title: "Oops! Unable to send a request",
              dangerouslyUseHTMLString: true,
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>

<style scoped></style>

<template>
  <div>
    <el-dialog
      title="Unfortunately, you don’t have a recording for this event."
      :visible.sync="dialogVisible"
      width="50%"
      top="3%"
      class="locked-modal"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-col :span="24">
        <div style="position: relative; padding: 20px 0">
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
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NoRecordingModal",
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

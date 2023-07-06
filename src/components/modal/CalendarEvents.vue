<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      top="20%"
      :before-close="handleClose"
      class="calendar-modal">

      <el-col :span="24">
        <h4 style="margin-left: 20px;font-size: 14px; font-weight: 600; color: #ffffff;">My events</h4>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              Beginners Boot Camp
              </div>
              <div class="bookings-sub-title">
              12th April, Friday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
      </el-col>


      <el-col :span="24">
        <h4 style="margin-left: 20px;font-size: 14px; font-weight: 600; color: #ffffff;">Other events</h4>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              Advanced Bootcamp
              </div>
              <div class="bookings-sub-title">
              12th April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              Navigating Volatile Markets
              </div>
              <div class="bookings-sub-title">
              3rd April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              Fast Timeframe Daily Webinar
              </div>
              <div class="bookings-sub-title">
              3rd April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CanlendarEvents.vue',
    props: {
      date: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        dialogVisible: true,
        avatar: require('../../assets/images/avatar.png'),
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
        this.$emit('close')
      }
    },
  }
</script>

<style scoped>
.bookings-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}


</style>
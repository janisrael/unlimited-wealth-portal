<template>
  <div class="right-panel-wrapper">
    <!-- <el-row> -->
      <el-col :span="24">
        <el-calendar v-model="value">
        </el-calendar>
      </el-col>
      <el-col :span="24">
        <h4 style="margin-left: 20px;font-size: 14px; font-weight: 600;">My bookings this week</h4>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              LFX Daily webinar - Europe
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
              LFX Daily webinar - Europe
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
              LFX Daily webinar - Europe
              </div>
              <div class="bookings-sub-title">
              3rd April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
      </el-col>

      <el-col :span="24">
        <h4 style="margin-left: 20px;font-size: 14px; font-weight: 600;">My bookings next week</h4>
        <el-col :span="24" style="margin-bottom: 8px;">
          <div class="events-box">
            <el-col :span="4">
                <el-avatar :size="40" :src="avatar" @error="errorHandler" style="border: 1px solid #248cb3;">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="bookings-title">
              LFX Daily webinar - Europe
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
              LFX Daily webinar - Europe
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
              LFX Daily webinar - Europe
              </div>
              <div class="bookings-sub-title">
              3rd April, Wednesday 18:00 - 21:00
              </div>
            </el-col>
          </div>
        </el-col>
      </el-col>
    <!-- </el-row> -->
  </div>
</template>

<script>
  export default {
    name: 'RightContent',
    data() {
      return {
        value: new Date(),
        avatar: require('../assets/images/avatar.png')
      }
    },
    methods: {
      errorHandler() {
        
      }
    },
  }
</script>

<style scoped>

</style>
<template>
  <div class="right-panel-wrapper">
    <!-- <el-row> -->
      <el-col :span="24">
      
        <el-calendar>
          <template
            slot="dateCell"
            slot-scope="{ data }">
            <div :class="data.isSelected ? 'is-selected' : ''" class="calendar-date"  @click="getDate(data)">
              {{ data.day.split('-').slice(2).join('-') }}
                <!-- {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}} -->
              <div style="display: block; width: 100%;margin-top: -7px;">
                <span v-for="(dot,index) in getDots(data)" :key="index"  class="dot">
                </span>
              </div>
            </div>
        </template>
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
    <component :is="currentComponent" :date="date" :event_on_this_day="event_on_this_day" @close="CloseModal()"/>
  </div>
</template>

<script>
import CalendarEvents from '../components/modal/CalendarEvents.vue'
  export default {
    
    name: 'RightContent',
    components: {
      CalendarEvents
    },
    props: {
      region: {
        type: String,
        require: true
      },
      token: {
        require: true,
        type: String,
      }
    },
    data() {
      return {
        value: new Date(),
        avatar: require('../assets/images/avatar.png'),
        currentComponent: null,
        date: {},
        // region: 'phl',
        event_list: [],
        event_on_this_day: []
      }
    },
    created () {
      this.getEventsDate()
    },
    methods: {
      getEventsDate() {
        var events = []
        // let config = {
        //     headers:{
        //       // 'X-Session-Key:': this.token,
        //       'Content-Type': 'application/json',
        //       'Accept': 'application/json'
        //     }
        //   };
      
        var url = 'https://uw-portal-api.tinkerpub.com/api/calendar/' + this.region
        this.axios
        .get(url,
        {
          headers: {
           'X-Session-Key': this.token,
           'Content-Type': 'application/json',
           'Accept': 'application/json'
          }
        }
        )
        .then(response => {
          if (response.status === 200) {
            events = response.data.data
            const converted_to_array = Object.values(events);
            this.event_list = converted_to_array
          }
          
        })
      },
      errorHandler() {
        
      },
      getDate(data) {
        this.date = data
        this.event_list.forEach((value) => {
          if(value.events[0].date === this.date.day) {
            this.event_on_this_day = value
          }
        })
// console.log(this.event_on_this_day,'this.event_on_this_day.length')
        if(this.event_on_this_day.events) {
          this.currentComponent = CalendarEvents
        } else {
          this.$notify.info({
            title: 'No Event',
            message: 'There is no event on this date'
          });
        }
        
      },
      CloseModal() {
        this.currentComponent = null
        this.event_on_this_day = []
      },
      getDots(data) {
        var count = 0
        this.event_list.forEach((value) => {
          if(value.events[0].date === data.day) {
            count = value.total
          }
        })
        return count
      }
    },
  }
</script>

<style scoped>

</style>
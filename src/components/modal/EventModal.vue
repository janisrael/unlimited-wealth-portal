<template>
  <div>
    <el-dialog
      :title="event.name"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <span class="modal-span">{{ event.description }}</span>
      <el-col :span="24">
      <div style="  display: inline-block; width: 100%; text-align: left;  padding: 20px 5px 10px;">
        <div style="  display: inline-block;margin-right: 10px;">
          <el-avatar :size="30" src="https://empty">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
        </div>
        <div style="  display: inline-block;">
          <div style="color: #A2B0D5;font-zie: 12px;">Speaker:</div>
          <div style="color: #ffffff;">Amy Green</div>
        </div>  

        <div v-if="type === 'upcoming'" style="  display: inline-block;padding: 0 50px">
          <div style="color: #A2B0D5;font-zie: 12px;">Time:</div>
          <div style="color: #ffffff;">09:00 local</div>
        </div>  

        <div style="  display: inline-block;padding: 0 50px">
          <div style="color: #A2B0D5;font-zie: 12px;">Region:</div>
          <div style="color: #ffffff;" v-if="event_list.length">{{ event_list[0].region }}</div>
        </div>  

        <div style="  display: inline-block;padding: 0 50px">
          <div style="color: #A2B0D5;font-zie: 12px;">Duration:</div>
          <div style="color: #ffffff;">30 minutes</div>
        </div>  
        <div v-if="type === 'upcoming'" style="  display: inline-block;">
          <div style="color: #A2B0D5;font-zie: 12px;">Occurrence:</div>
          <div style="color: #ffffff;">Weekly</div>
        </div>  
      </div>
      <span v-if="type === 'recording'" style="color: #ffffff;padding: 30px 0 15px;display: inline-block;">Available past recordings:</span>
      <span v-else style="color: #ffffff;padding: 30px 0 15px;display: inline-block;">Book from available dates:</span>
      
      <!-- <div v-if="type === 'recording'" class="video-wrapper" :style="{ backgroundImage: 'url(' + thumbnail_image + ')' }"> -->
      <div v-if="type === 'recording'" class="video-wrapper">
        <div class="player-container">
            <vue-core-video-player @play="handlePLay()" :src="video_url"></vue-core-video-player>
          </div>
      </div>

      <!--  carousels upcoming -->
      <div v-if="type === 'upcoming'" id="carousel-wrapper">
        <VueSlickCarousel v-if="event_list.length" ref="slick" v-bind="settings">
          <div v-for="(event, i) in event_list" :key="i" class="carousel-block">
            <div class="carousel-content" @click="getSelected(event, i)">
              <el-checkbox v-model="event.selected" class="carousel-checked"></el-checkbox>
              <div class="carousel-day">{{ getDate(event.date) }}</div>
               <div class="carousel-formated-date">{{ getFormatedDate(event.date) }}</div>
               <div>{{ getMonth(event.date) }}</div>
            </div>
          </div>
        </VueSlickCarousel>
        <div v-else>
          No available dates
        </div>
      </div>
      <!--  carousels recordnings -->
      <div v-else id="carousel-wrapper">
          <VueSlickCarousel v-if="event_list.length" ref="slick" v-bind="settings">
            <div v-for="(event, i) in event_list" :key="i" class="carousel-block">
              <div class="carousel-content"  @click="getSelected(event, i)">
                {{ getFormatedDate(event.date) }}
                <div><i class="el-icon-video-play icon-play"></i></div>
              </div>
            </div>   
          </VueSlickCarousel>
        </div>

      </el-col>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// import VueCoreVideoPlayer from 'vue-core-video-player'
  // optional style for arrows & dots
  import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
  export default {
    name: 'EventModal',
    components: {
      VueSlickCarousel,
      // VueCoreVideoPlayer
    },
    props: {
      type: {
        type: String,
        required: true
      },
      event_list: {
        type: Array,
        required: true
      },
      event: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialogVisible: true,
        thumbnail_image: require('../../assets/images/video-thumbnail.png'),
        settings: {
          dots: false,
          focusOnSelect: true,
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
        video_url: ''
      };
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
        this.$emit('close')
        
      },
      handlePLay() {
        console.log('play')
      },
      getDate(date) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date(date);
        var dayName = days[d.getDay()];
        return dayName
      },
      getMonth(date) {
        var d = new Date(date);
        var month = d.toLocaleString('default', { month: 'short' });
        return month
      },
      getFormatedDate(date) {
        var d = new Date(date);
        var month = d.toLocaleString('default', { month: 'short' });
        var this_date = d.getDate()
        var dateExt = this.getDateExt(this_date)

        var formated_date = ''
        if(this.type === 'upcoming') {
          formated_date = this_date + dateExt
        } else {
          formated_date = this_date + dateExt + ' ' + month
        }
        return formated_date
      },
      getDateExt(date) {
        if (date > 3 && date < 21) return 'th';
        switch (date % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
      },
      getSelected(event, index) {
        setTimeout(() => {
          /* eslint-disable */
          if(this.type === 'upcoming') {
            if(this.event_list[index].selected === true) {
              this.event_list[index].selected = false
            } else {
              this.event_list[index].selected = true
            }
            
          } else {
            this.event_list.forEach((value,index) => {
              value.selected = false
            })
            this.event_list[index].selected = true
          }
          
          this.getVideo(event)
          console.log(this.event_list)
          this.$refs.slick.goTo(index)
        }, 20);
      },
      getVideo(event) {
        var url = event.meta.resource_path
        this.axios
        .get(url)
        .then(response => {
          if (response.status === 200) {
            this.video_url = response.data.data.video_recording_url
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
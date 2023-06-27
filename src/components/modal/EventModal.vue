<template>
  <div>
    <el-dialog
      title="LFX Daily webinar - Europe"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <span class="modal-span">Get ahead of the curve with our early morning briefing. Our trader mentors will help you look trough the markets to see what’s going on and some places that you might want to look for today’s trades.</span>
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
          <div style="color: #ffffff;">UK</div>
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
      
      <div v-if="type === 'recording'" class="video-wrapper" :style="{ backgroundImage: 'url(' + thumbnail_image + ')' }">
        <div class="player-container">
            <vue-core-video-player @play="handlePLay()" src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"></vue-core-video-player>
          </div>
      </div>
      <div id="carousel-wrapper">
        <VueSlickCarousel v-if="type === 'upcoming'" v-bind="settings" :arrows="true" >
          <div class="carousel-block">
            <div class="carouse-content">
              <el-checkbox v-model="checked1" class="carousel-checked"></el-checkbox>
              <div class="carousel-day">Wednesday</div>
              1st May
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            <el-checkbox v-model="checked2" class="carousel-checked"></el-checkbox>
            <div class="carousel-day">Wednesday</div>
            2nd May
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            <el-checkbox v-model="checked3" class="carousel-checked"></el-checkbox>
            <div class="carousel-day">Wednesday</div>
            3rd May
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            <el-checkbox v-model="checked4" class="carousel-checked"></el-checkbox>
            <div class="carousel-day">Wednesday</div>
            4th May
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            <el-checkbox v-model="checked5" class="carousel-checked"></el-checkbox>
            <div class="carousel-day">Wednesday</div>
            5th May
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            <el-checkbox v-model="checked6" class="carousel-checked"></el-checkbox>
            <div class="carousel-day">Wednesday</div>
            6th May</div>
          </div>
        </VueSlickCarousel>


        <VueSlickCarousel v-else v-bind="settings" :arrows="true" >
          <div class="carousel-block">
            <div class="carouse-content">
              1st May
              <div><i class="el-icon-video-play icon-play"></i></div>
              
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            2nd May
            <div><i class="el-icon-video-play icon-play"></i></div>
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            3rd May
            <div><i class="el-icon-video-play icon-play"></i></div>
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            4th May
            <div><i class="el-icon-video-play icon-play"></i></div>
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            5th May
            <div><i class="el-icon-video-play icon-play"></i></div>
            </div>
          </div>
          <div class="carousel-block">
            <div class="carouse-content">
            6th May
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
    },
    data() {
      return {
        dialogVisible: true,
        thumbnail_image: require('../../assets/images/video-thumbnail.png'),
        checked1: true,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        settings: {
          dots: false,
          focusOnSelect: false,
          infinite: true,
          speed: 500,
          slidesToShow: 5,
          slidesToScroll: 5,
          touchThreshold: 7,
          rrows: true,
          // dots: false,
          // // centerPadding: "0px",
          // lazyLoad: "progressive",
          // focusOnSelect: true,
          // infinite: false,
          // slidesPerRow: 5,
          // // rows: 1,
          // // accessibility: true,
          // speed: 300,
          // // edgeFriction: 0.35,
          // slidesToShow: 5,
          // slidesToScroll: 5,
          // dontAnimate: true,
          // touchThreshold: 7,
          // arrows: true,
          // // variableWidth: true,
          // centerMode: true,
          // draggable: true,
          // // windowWidth: null,
          // initialSlide: 1,
        },
      };
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
        this.$emit('close')
        // this.$confirm('Are you sure to close this dialog?')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      handlePLay() {
        console.log('play')
      }
    }
  }
</script>

<style scoped>

</style>
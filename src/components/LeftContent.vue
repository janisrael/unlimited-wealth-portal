<template>
  <div class="left-panel-wrapper">
    <el-row>
      <el-col :span="24" style="padding: 0px 20px !important;">

        <el-col v-for="(event, i) in events" :key="i" :span="8" style="padding-right: 20px;padding-top: 20px;" >
          <div @click="getModal(event)">
            <el-card class="box-card card-left-panel" shadow="hover" >
              <div slot="header" class="clearfix">
                <lazy-background
                    :src="event.image_url"
                    @onLoad="onLoad(event.name)"
                    @onError="onError(event)"
                    image-class="cam-viewport"
                    :blur="0"
                    position="center"
                    size="cover"
                    style="background-size: cover;"
                    class="card-header-content">
                    <div slot="content">  
                        <div class="card-header-content" >
                          <!-- <div class="card-content-title">{{ event.name }}</div>     -->
                          <div class="card-content-title"></div>    
                          <!-- <div class="card-content-region">{{ tumbnail_region_title }}</div>     -->
                          <!-- <div class="card-content-sched">Coming up at 3rd April</div>     -->
                        </div>
                    </div>

              </lazy-background>
                
                
                <!-- <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button> -->
              </div>
              <div  class="text item">
                <!-- Get ahead of the curve with our early morning briefing. Our trader mentors will help you look trough the markets to see what’s going on and some places that you might want to look for today’s trades.  -->
                <span v-if="!event.description"> -</span>
                {{ event.description }}
              </div>
            </el-card>
          </div>
        </el-col>

        
      </el-col>
      <component :is="currentComponent" :type="type" :event_list="event_list" :event="selected_event" @close="CloseModal()"/>
    </el-row>
  </div>
  
</template>

<script>
  
  import EventModal from './modal/EventModal.vue'
  export default {
    name: 'LeftContent',
    components: {
      EventModal
    },
    props: {
      type: {
        type: String,
        required: true
      },
      events: {
        required: true,
        type: Array
      },
      tumbnail_region_title: {
        required: true,
        type: String
      },
      region: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        thumbnail_image: require('../assets/images/visual.png'),
        currentComponent: null,
        event_list: [],
        selected_event: {}
      }
    },
    methods: {
      getModal(event) {
        this.selected_event = event
        var url = ''
        var events = []
        if(this.type === 'upcoming') {
          url = 'https://uw-portal-api.tinkerpub.com/api/events/upcoming?region=' + this.region + '&event_type_id=' + event.id
          this.axios
          .get(url)
          .then(response => {
            if (response.status === 200) {
              events = response.data.data
              events.forEach((event) => {
                  event['selected'] = false
              })
              this.event_list = events
              console.log(events,'event list')
            }
            
          })
          
        } else {
          
          url = 'https://uw-portal-api.tinkerpub.com/api/events/recordings?region=' + this.region + '&event_type_id=' + event.id
          this.axios
          .get(url)
          .then(response => (this.event_list = response.data.data))
        }

        this.currentComponent = EventModal
      },
      CloseModal() {
          this.currentComponent = null
      },
      onLoad(data) {
          console.log(data)
      },
      onError(data) {
          console.log(data)
      }
    },
  }
</script>

<style scoped>

</style>
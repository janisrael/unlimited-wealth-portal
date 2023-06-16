<template>
  <div class="row full-height">
    <el-row>
      <el-col :span="24">
        <el-col :span="18" class="right-panel">
          <el-col :span="24" class="panel-header">
            <el-col :span="17">
              <!-- <h3 class="selected-menu custom-menu">Upcoming Events</h3>
              <h3 class="custom-menu">Recordings</h3> -->
              <el-radio v-model="radio" label="upcoming" style="margin-left: 48px !important; padding-top: 15px;" @change="getTypes('upcoming')">Upcoming Events</el-radio>
              <el-radio v-model="radio" label="recording" @change="getTypes('recording')">Recordings</el-radio>
            </el-col>
            <el-col :span="7">
              <el-col :span="8">
                <span style="padding-top: 6px;display: inline-block;font-size: 14px;">
                Region: 
                
                <el-dropdown @command="handleChangeRegion" style="margin-left: 5px !important;">
                    <span class="el-dropdown-link">
                      <span><country-flag :country='use_region' size='small'/> </span><i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="uk"><country-flag country='gb' size='small'/></el-dropdown-item>
                      <el-dropdown-item command="aus"><country-flag country='au' size='small'/></el-dropdown-item>
                      <el-dropdown-item command="phl"><country-flag country='ph' size='small'/></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>  
                </span>
              </el-col>
              <el-col :span="15">
                <el-input placeholder="Search" v-model="search" clearable>
                  <template slot="prepend"><i class="el-icon-search"></i></template>
                </el-input>
              </el-col>
               <!-- <el-avatar :size="60" src="https://empty" @error="errorHandler" class="avatar-head-panel">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar> -->
            </el-col>
          </el-col>
         
          <!-- <MessagePanelComponent/> -->
          <LeftContent :type="radio"/>
        </el-col>
        <el-col :span="6" class="left-panel">
          <el-col :span="24" class="panel-header">
            <h3 style="margin: 0px !important; margin-block-start: 0px !important; margin-block-end: 0px !important;  font-size: 18px;font-weight: 400;display: inline-block;padding-right: 20px;">Events Overview</h3>
              <i class="el-icon-warning-outline" style="color: #5CE6E6;"></i>

          </el-col>
          <RightContent/>
        </el-col>

      </el-col>
    </el-row>
  </div>
</template>

<script>

  import LeftContent from './LeftContent.vue'
  import RightContent from './RightContent.vue'
  
  export default {
    name: 'IndexVue',
    components: {
      LeftContent,
      RightContent
    },
    data() {
      return {
        search: '',
        use_region: 'gb',
        radio: 'upcoming'
      }
    },
    methods: {
      handleChangeRegion(command) {
        if(command) {
          if(command === 'uk') {
            this.use_region = 'gb'
          } else {
            this.use_region = command
          }
          
        
        }
      },
      getCountryByRegion(region) {
        console.log(region)
      },
      getTypes(type) {
        this.radio = type
      }
    },
    
  }
</script>

<style scoped>

</style>
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  // modules: {
  //     lesson,
  //     reusable,
  //     action,
  // },
  state: {
    myybookings: [],
    myybooking_this_week: [],
    myybooking_next_week: [],
    my_active_events: []
  },
  mutations: {
    SET_MYBOOKINS: (state, payload) => {
      // console.log(payload)
      state.myybookings = payload
    },
    SET_ACTIVE_EVENTS: (state, payload) => {
      // console.log(payload)
      state.active_events = payload
    }, 
    ADD_BOOKING: (state, payload) => {
      payload.forEach(value => {
        // sample data to add booking to array
        let new_booking = {
          "id": "",
          "event_id": value.id,
          "event_region": value.region,
          "event_type_name": "",
          "join_url": "",
          "meta": {},
          "registration_key":"",
          "start_date": value.start_at.local,
          "status": "Progress",
        }
        state.myybookings.push(new_booking)
      });
    },
    UPDATE_BOOKING: (state, payload) => {
      state.myybookings.forEach((event) => {
        if(event.event_id === payload.data.event_id) {
          event.status = payload.data.status
          event.event_type_name = payload.data.event_type_name
          event.id = payload.data.id
          console.log(event,'updated event')
        }
        
      });
    }
  },
  actions: {
    async getMybookings({ commit }, value) {
      // console.log(state)
      // state.v_loading = true;
      return new Promise((resolve, reject) => {
        var url = process.env.VUE_APP_API_URL + '/api/my-account/bookings/upcoming'
        axios.get(url,
          {
            headers: {
              'X-Session-Key': value,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        )
          .then((response) => {
            let my_bookings = response.data.data
            
            // var todayDate = new Date().toISOString().slice(0, 10);
            // my_bookings = my_bookings.filter(function(item) {
            //   // return item.start_date !== todayDate && item.status.toLowerCase() !== 'completed'
            //   return item.start_date !== todayDate && item.status.toLowerCase() === 'upcoming'
            // })
            
            commit("SET_MYBOOKINS", my_bookings);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async setActiveEvents({ commit, state }, value) {
      console.log(value, state, 'set active event')
      commit("SET_ACTIVE_EVENTS", value)
    },
    async addBooking({ commit, state }, value) {
      console.log(value, state, 'add booking')
      commit("ADD_BOOKING", value)
    },
    /* eslint-disable */ 
    async updateBooking({ commit, state }, value) {
      console.log(value, state, 'update booking')
      commit("UPDATE_BOOKING", value)
    },
    
  },
  getters: {
    _myybookings: (state) => state.myybookings,
    _my_active_events: (state) => state.my_active_events
  },
});

export default store;

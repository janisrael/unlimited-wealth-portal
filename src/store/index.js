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
      // console.log(state.myybookings, 'first')
      payload.forEach(value => {
        // sample data to add booking to array
        let event_to_add = {
          "id": value.id,
          "event_id": value.event_type_id,
          "registration_key": "",
          "start_at": {
            "local": value.start_at.local
          },
          "date": value.start_at.local,
          "status": "Booking",
          "states": {
            "progress": "Booking"
          },
          "event_type_name": value.name,
          "join_url": "",
          "event_region": value.region,
          "meta": {
            "resource_path": "https://uw-portal-api.tinkerpub.com/api/bookings/a03Ae000003sNNhIAM"
          }
        }
        state.myybookings.push(event_to_add)
      });

      console.log(state.myybookings,'state.myybookings')

      // console.log(state.myybookings, 'second')
    },
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
  },
  getters: {
    _myybookings: (state) => state.myybookings,
    _my_active_events: (state) => state.my_active_events
  },
});

export default store;

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
    },
    mutations: {       
        SET_MYBOOKINS: (state, payload) => {
          state.myybookings = payload
        },
        ADD_BOOKING: (state, payload) => {
          console.log(state.myybookings,'first')
          payload.forEach(value => {
            let event_to_add = {
              "id": value.id,
              "registration_key": "",
              "start_date": "2023-07-29",
              "status": "Attending",
              "event_type_name": value.name,
              "join_url": "",
              "event_region": "aus",
              "meta": {
                "resource_path": "https://uw-portal-api.tinkerpub.com/api/bookings/a03Ae000003sNNhIAM"
              }
            }
            state.myybookings.push(event_to_add)  
          });
          
          console.log(state.myybookings,'second')
        },
    },
    actions: {
      async getMybookings({ commit, state }, value) {
        console.log(state)
        // state.v_loading = true;
        return new Promise((resolve, reject) => {
            var url = 'https://uw-portal-api.tinkerpub.com/api/my-account/bookings/upcoming'
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
                  commit("SET_MYBOOKINS", response.data.data);
                  resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
      },
      async addBooking({ commit, state }, value) {
          console.log(value,state,'add booking')
          commit("ADD_BOOKING", value)
      },
    },
    getters: {
      _myybookings: (state) => state.myybookings
    },
});

export default store;

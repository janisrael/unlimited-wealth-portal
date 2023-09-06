import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);
/* eslint-disable */
const store = new Vuex.Store({
    namespaced: true,
    state: {
        myybookings: [],
        myybooking_this_week: [],
        myybooking_next_week: [],
        my_active_events: [],
        customer: {},
        all_upcoming_events: [],
    },
    mutations: {
        SET_MYBOOKINS: (state, payload) => {
            state.myybookings = payload;
        },
        // SET_ACTIVE_EVENTS: (state, payload) => {
        //     state.active_events = payload;
        // },
        ASSIGN_CUSTOMER: (state, payload) => {
            state.customer = payload;
            window.sessionStorage.setItem("customer_id", payload.customer.id);
        },
        ADD_BOOKING: (state, payload) => {
            payload.forEach((value) => {
                let new_booking = {
                    id: "",
                    event_id: value.id,
                    event_region: value.region,
                    event_type_name: value.name.split(",")[0], //initial event name only to display on My Upcoming Bookings
                    join_url: "",
                    meta: {},
                    registration_key: "",
                    start_date: value.start_at.local,
                    status: "Progress",
                };
                state.myybookings.push(new_booking);
            });
        },
        REMOVE_BOOKING: (state, payload) => {
            const index = state.myybookings.findIndex((object) => {
                return object.event_id === payload.id;
            });

            state.myybookings.splice(index, 1);
        },
        UPDATE_BOOKING: (state, payload) => {
            // for booking confirmed and failed
            const index = state.myybookings.findIndex((object) => {
                return object.event_id === payload.data.event_id;
            });

            if (payload.data.status.toLowerCase() === "cancelled") {
                state.myybookings.splice(index, 1);
            } else {
                state.myybookings[index].status = payload.data.status;
                state.myybookings[index].event_type_name =
                    payload.data.event_type_name;
                state.myybookings[index].id = payload.data.id;
            }
            // state.myybookings.forEach((event, index) => {
            //     if (event.event_id === payload.data.event_id) {
            //         event.status = payload.data.status;
            //         event.event_type_name = payload.data.event_type_name;
            //         event.id = payload.data.id;
            //         console.log(event, "updated event");
            //         if (event.status.toLowerCase() === "cancelled") {
            //             console.log("canceled");
            //             state.myybookings.splice(index, 1);
            //         }
            //     }
            // });
        },
    },
    actions: {
        async getMybookings({ commit, dispatch }, value) {
            // console.log(state)
            return new Promise((resolve, reject) => {
                var url =
                    process.env.VUE_APP_API_URL +
                    "/api/my-account/bookings/upcoming";
                axios
                    .get(url, {
                        headers: {
                            "X-Session-Key": value,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    })
                    .then((response) => {
                        let my_bookings = response.data.data;
                        commit("SET_MYBOOKINS", my_bookings);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        async setActiveEvents({ commit, state }, value) {
            commit("SET_ACTIVE_EVENTS", value);
        },
        async addBooking({ commit, state }, value) {
            console.log(value, state, "add booking");
            commit("ADD_BOOKING", value);
        },
        /* eslint-disable */
        async updateBooking({ commit, state }, value) {
            console.log(value, state, "update booking");
            commit("UPDATE_BOOKING", value);
        },
        async cancelBooking({ commit, dispatch }, value) {
            return new Promise((resolve, reject) => {
                let url =
                    process.env.VUE_APP_API_URL +
                    "/api/account/booking/" +
                    value._related_booking.id +
                    "/cancel";
                axios
                    .post(url, null, {
                        headers: {
                            "X-Session-Key": value.token,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    })
                    .then((response) => {
                        // if (response.status === 200) {

                        dispatch("removeBooking", value);
                        resolve(response);
                        // }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        async removeBooking({ commit, state }, value) {
            // console.log(value, state, "cancel booking");
            commit("REMOVE_BOOKING", value);
        },
        async assignCustomer({ commit, state }, value) {
            commit("ASSIGN_CUSTOMER", value);
        },
        // async callUpcoming({ commit, state }, value) {
        //     // for testing
        //     // Loop from my bookings and call each evennts
        //     console.log(value, "value");
        //     let _my_bookings = value.my_bookings;
        //     let region =
        //         value.my_bookings[0].event_region === "gb"
        //             ? "uk"
        //             : value.my_bookings[0].event_region;
        //     _my_bookings.forEach((booking, index) => {
        //         setTimeout(() => {
        //             let url =
        //                 process.env.VUE_APP_API_URL +
        //                 "/api/events/upcoming?region=" +
        //                 region +
        //                 "&event_type_id=" +
        //                 booking.id;
        //             axios
        //                 .get(url, {
        //                     headers: {
        //                         "X-Session-Key": value.token,
        //                         "Content-Type": "application/json",
        //                         Accept: "application/json",
        //                     },
        //                 })
        //                 .then((response) => {
        //                     if (response.status === 200) {
        //                         console.log(response, "in loop");
        //                         // events = response.data.data;

        //                         // this.event_list = [];

        //                         // this.event_list = this.withBooking(events);
        //                         // this.event_list.sort(function (a, b) {
        //                         //     return (
        //                         //         new Date(a.start_at.local) -
        //                         //         new Date(b.start_at.local)
        //                         //     );
        //                         // });
        //                     }
        //                 });
        //         }, 500);
        //     });

        //     commit("SET_ACTIVE_EVENTS", value);
        // },
    },
    getters: {
        _myybookings: (state) => state.myybookings,
        _my_active_events: (state) => state.my_active_events,
        _customer: (state) => state.customer,
    },
});

export default store;

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);
/* eslint-disable */
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
        my_active_events: [],
        customer: {},
    },
    mutations: {
        SET_MYBOOKINS: (state, payload) => {
            state.myybookings = payload;
        },
        SET_ACTIVE_EVENTS: (state, payload) => {
            state.active_events = payload;
        },
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
        CANCEL_BOOKING: (state, payload) => {
            state.myybookings.forEach((event, i) => {
                if (event.event_id === payload.id) {
                    console.log("event cancelation found", event);
                    event.status = "Cancelled";
                    event.event_type_name = payload.name;
                    event.id = payload.id;
                    state.myybookings.splice(i, 1);
                }
            });
        },
        UPDATE_BOOKING: (state, payload) => {
            state.myybookings.forEach((event, index) => {
                if (event.event_id === payload.data.event_id) {
                    event.status = payload.data.status;
                    event.event_type_name = payload.data.event_type_name;
                    event.id = payload.data.id;
                    console.log(event, "updated event");
                    if (event.status.toLowerCase() === "cancelled") {
                        console.log("canceled");
                        state.myybookings.splice(index, 1);
                    }
                }
            });
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
                        // var todayDate = new Date().toISOString().slice(0, 10);
                        // my_bookings = my_bookings.filter(function(item) {
                        //   // return item.start_date !== todayDate && item.status.toLowerCase() !== 'completed'
                        //   return item.start_date !== todayDate && item.status.toLowerCase() === 'upcoming'
                        // })
                        // let data = {
                        //     my_bookings: my_bookings,
                        //     token: value,
                        // };

                        // this.dispatch("callUpcoming", data)
                        //     // eslint-disable-next-line no-unused-vars
                        //     .then((response) => {});
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
        async cancelBooking({ commit, state }, value) {
            console.log(value, state, "cancel booking");
            commit("CANCEL_BOOKING", value);
        },
        async assignCustomer({ commit, state }, value) {
            // console.log(value, state, "update customer details");
            commit("ASSIGN_CUSTOMER", value);
        },
        async callUpcoming({ commit, state }, value) {
            // Loop from my bookings and call each evennts
            console.log(value, "value");
            let _my_bookings = value.my_bookings;
            let region = value.my_bookings[0].event_region;
            _my_bookings.forEach((booking, index) => {
                setTimeout(() => {
                    let url =
                        process.env.VUE_APP_API_URL +
                        "/api/events/upcoming?region=" +
                        region +
                        "&event_type_id=" +
                        booking.id;
                    axios
                        .get(url, {
                            headers: {
                                "X-Session-Key": value.token,
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        })
                        .then((response) => {
                            if (response.status === 200) {
                                console.log(response, "in loop");
                                // events = response.data.data;

                                // this.event_list = [];

                                // this.event_list = this.withBooking(events);
                                // this.event_list.sort(function (a, b) {
                                //     return (
                                //         new Date(a.start_at.local) -
                                //         new Date(b.start_at.local)
                                //     );
                                // });
                            }
                        });
                }, 500);
            });

            commit("SET_ACTIVE_EVENTS", value);
        },
    },
    getters: {
        _myybookings: (state) => state.myybookings,
        _my_active_events: (state) => state.my_active_events,
        _customer: (state) => state.customer,
    },
});

export default store;

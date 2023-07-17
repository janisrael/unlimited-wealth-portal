import Vue from 'vue'
import Router from 'vue-router'
import LoginComponent from '../components/LoginComponent'

Vue.use(Router)
export const routes = [
  
    {
        path: '/login?token=',
        // component:DashboardComponent,
        name: 'IndexVue',
        group: 'default',
        icon: '',
        type: 'dashboard',
        key: ''
    },
    {
      path: '/login',
      component:LoginComponent,
      name: 'LoginComponent',
      group: 'default',
      icon: '',
      type: '',
      key: ''
  },
];
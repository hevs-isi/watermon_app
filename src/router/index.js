import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/Home'
import level from '../pages/Level'
import humidity from '../pages/Humidity'
import pressure from '../pages/Pressure'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/level',
            name: 'level',
            component: level
        },
        {
            path: '/humidity',
            name: 'humidity',
            props: true,
            component: humidity
        },
        {
            path: '/pressure/:sectorName',
            name: 'pressure',
            props: true,
            component: pressure
        }
    ]
})

//Test new head 2
import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/Home'
import level from '../pages/Level'
import humidity from '../pages/Humidity'
import pressure from '../pages/Pressure'
import dev from '../pages/Dev'
import info from '../pages/Info'

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/info',
            name: 'info',
            component: info
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
        },
        {
            path: '/dev/',
            name: 'dev',
            props: true,
            component: dev
        }
    ],

})

export default router

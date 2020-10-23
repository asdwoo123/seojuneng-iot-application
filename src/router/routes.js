export default [
    {
        path: '/monitor',
        name: 'Monitor',
        component: () => import('../views/Monitor')
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('../views/History')
    },
    {
        path: '/editor',
        name: 'Editor',
        component: () => import('../views/Editor')
    }/*,
    {
        path: '/alarm',
        name: 'Alarm',
        component: () => import('../views/Alarm')
    }*/
]

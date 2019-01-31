import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import RERS from '@/pages/RERS.vue'
import Tramways from '@/pages/Tramways.vue'
import Plan from '@/pages/Plan.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'RERS',
        name: 'RERS',
        component: RERS
      },
      {
        path: 'tramways',
        name: 'Tramways',
        component: Tramways
      },
      {
        path: 'plan',
        name: 'Plan',
        component: Plan
      }
    ]
  }
]

export default routes

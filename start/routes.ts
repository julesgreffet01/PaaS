/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const authController = () => import('#controllers/auth_controller')
const appController = () => import('#controllers/app_controller')

router.get('/login', [authController, 'login']).as('login')
router.post('/login', [authController, 'handleLogin'])
router.delete('/logout', [authController, 'handleLogout']).use(middleware.auth()).as('logout')

router
  .group(() => {
    router.get('/', [appController, 'home']).as('home')
    router.get('/publication', [appController, 'publication']).as('publication')
    router.post('/publication', [appController, 'handlePublication']).as('handlePublication')
    router.get('/app/:appId', [appController, 'show']).as('show')
  })
  .use(middleware.auth())
  .as('app')

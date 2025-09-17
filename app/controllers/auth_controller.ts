import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'
import User from '#models/user'
import { errors } from '@adonisjs/auth'

export default class AuthController {
  async login({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async handleLogin({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      await loginValidator.validate({ email, password })
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      response.redirect().toRoute('app.home')
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        session.flash({
          error: 'Email ou mot de passe incorrect',
        })
      }
      throw error
    }
  }

  async handleLogout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('login')
  }
}

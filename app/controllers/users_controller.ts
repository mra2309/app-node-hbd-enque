import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    try {
      let pagination = request.only(['page', 'limit'])
      const page = Number.parseInt(pagination.page, 10) || 1
      const limit = Number.parseInt(pagination.limit, 10) || 10

      const result = await User.query().paginate(page, limit)
      return response.ok({
        status: 'success',
        dataTable: result,
      })
    } catch (error) {
      throw error
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const schema = vine.object({
      email: vine.string().email(),
      first_name: vine.string().maxLength(100),
      last_name: vine.string().maxLength(100),
      birthday: vine.date(),
      location: vine.string().maxLength(100),
      timezone: vine.string().maxLength(100),
    })
    await vine.validate({ schema, data })

    const existingUser = await User.query().where('email', data.email).first()
    if (existingUser) {
      return response.status(400).send({
        status: 'duplicate',
        message: 'Email sudah digunakan',
      })
    }

    try {
      const newUser = await User.create(data)
      return response.created({ status: 'success', data: newUser, error: null })
    } catch (error) {
      console.log(error)
      return response.status(400).json({ error: error.message, data: [], status: 'error' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const dataSelect = await User.findOrFail(params.id)
      await dataSelect.delete()
      return response.ok({ status: 'success', message: 'Users deleted successfully' })
    } catch (error) {
      return response.status(404).json({ error: 'Bank not found', status: 'error', data: [] })
    }
  }
}

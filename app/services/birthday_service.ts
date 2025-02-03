import axios from 'axios'
import User from '#models/user'
import moment from 'moment-timezone'

export default class BirthdayService {
  static async sendBirthdayMessage(email: string, fullName: string) {
    const payload = {
      email,
      message: `Hey, ${fullName}, it's your birthday!`,
    }

    try {
      const response = await axios.post(
        'https://email-service.digitalenvision.com.au/send-email',
        payload,
        {
          timeout: 5000,
        }
      )
      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(`Failed to send message to ${email}:`, error.message)
      return false
    }
  }

  static async getUsersWithBirthdayToday() {
    const today = moment().format('MM-DD')
    const users = await User.query().whereRaw('DATE_FORMAT(birthday, "%m-%d") = ?', [today])
    return users
  }
}

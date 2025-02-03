import { BaseJob } from 'adonis-resque'
import moment from 'moment-timezone'
import axios from 'axios'

export default class BirthdayJob extends BaseJob {
  static async perform(payload: { email: string; fullName: string; timezone: string }) {
    const { email, fullName, timezone } = payload
    const userTime = moment().tz(timezone)
    const currentTime = userTime.format('HH:mm')

    if (currentTime === '09:00') {
      try {
        const response = await axios.post(
          'https://email-service.digitalenvision.com.au/send-email',
          {
            email,
            message: `Hey, ${fullName}, it's your birthday!`,
          },
          {
            timeout: 5000,
          }
        )
        console.log(`Message sent to ${email}:`, response.data)
        return true
      } catch (error) {
        console.error(`Failed to send message to ${email}:`, error.message)
        throw error // Melemparkan error untuk retry
      }
    } else {
      console.log(`Not yet 9 AM in ${timezone}. Skipping ${email}`)
      return false
    }
  }
}

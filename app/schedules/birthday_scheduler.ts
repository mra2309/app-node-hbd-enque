import cron from 'node-cron'
import moment from 'moment-timezone'
import BirthdayService from '../services/birthday_service.js'
import BirthdayJob from '#jobs/birthday_job'

export default class BirthdayScheduler {
  static start() {
    cron.schedule('* * * * *', async () => {
      const users = await BirthdayService.getUsersWithBirthdayToday()
      console.log('test')
      for (const user of users) {
        const userTime = moment().tz(user.timezone)
        const currentTime = userTime.format('HH:mm')

        if (currentTime === '09:00') {
          const fullName = `${user.first_name} ${user.last_name}`

          //update send to queue
          await BirthdayJob.perform({ email: user.email, fullName, timezone: user.timezone })

          //traditional send to service send email
          // await BirthdayService.sendBirthdayMessage(user.email, fullName)
        }
      }
    })
  }
}

import { Module } from '@nestjs/common'
import { MailService } from 'src/infrastructure/mail/mail.service'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
	controllers: [NotificationsController],
	providers: [NotificationsService, MailService]
})
export class NotificationsModule {}

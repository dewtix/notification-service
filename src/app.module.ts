import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import configuration from './config/configuration'
import validationSchema from './config/validation.schema'
import { RmqModule } from './infrastructure/rmq/rmq.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { MailModule } from './infrastructure/mail/mail.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [configuration]
		}),
		RmqModule,
		NotificationsModule,
		MailModule
	]
})
export class AppModule {}

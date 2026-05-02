import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { RmqModule } from './infrastructure/rmq/rmq.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true
		}),
		RmqModule,
		NotificationsModule
	]
})
export class AppModule {}

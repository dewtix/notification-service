import { Module } from '@nestjs/common'

import { RmqModule } from './infrastructure/rmq/rmq.module'
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
	imports: [RmqModule, NotificationsModule]
})
export class AppModule {}

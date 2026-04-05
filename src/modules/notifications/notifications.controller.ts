import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { RmqService } from 'src/infrastructure/rmq/rmq.service'

import { NotificationsService } from './notifications.service'

@Controller()
export class NotificationsController {
	public constructor(
		private readonly notificationsService: NotificationsService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern('auth.otp.requested')
	public otpRequested(@Payload() data: any, @Ctx() ctx: RmqContext) {
		const event = 'auth.otp.requested'

		try {
			console.log('OTP event recieved: ', data)
			this.rmqService.ack(ctx)
		} catch (error) {
			console.log('otp error: ', error)
			this.rmqService.nack(ctx)
		}
	}
}

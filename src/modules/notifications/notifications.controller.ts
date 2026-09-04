import type { OtpRequestedEvent } from '@dewtix/contracts'
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
	public async otpRequested(
		@Payload() data: OtpRequestedEvent,
		@Ctx() ctx: RmqContext
	) {
		const event = 'auth.otp.requested'

		try {
			await this.notificationsService.sendOtp(data)

			this.rmqService.ack(ctx)
		} catch (error) {
			console.log('otp error: ', error)
			this.rmqService.nack(ctx)
		}
	}

	@EventPattern('account.phone.changed')
	public async phoneChanged(
		@Payload() data: PhoneChangedEvent,
		@Ctx() ctx: RmqContext
	) {
		const event = 'account.phone.changed'

		const endTimer = this.processingDuration.startTimer({
			service: this.SERVICE_NAME,
			event
		})

		try {
			await this.notificationsService.sendPhoneChange(data)

			this.eventsTotal.inc({
				service: this.SERVICE_NAME,
				event,
				status: 'success'
			})

			this.rmqService.ack(ctx, event)
		} catch (error) {
			this.eventsTotal.inc({
				service: this.SERVICE_NAME,
				event,
				status: 'error'
			})

			this.logger.error('Phone change error: ', error.message ?? error)

			this.rmqService.nack(ctx, event)
		} finally {
			endTimer()
		}
	}

	@EventPattern('account.email.changed')
	public async emailChanged(
		@Payload() data: EmailChangedEvent,
		@Ctx() ctx: RmqContext
	) {
		const event = 'account.email.changed'

		const endTimer = this.processingDuration.startTimer({
			service: this.SERVICE_NAME,
			event
		})

		try {
			await this.notificationsService.sendEmailChange(data)

			this.eventsTotal.inc({
				service: this.SERVICE_NAME,
				event,
				status: 'success'
			})

			this.rmqService.ack(ctx, event)
		} catch (error) {
			this.eventsTotal.inc({
				service: this.SERVICE_NAME,
				event,
				status: 'error'
			})

			this.logger.error('Email change error: ', error.message ?? error)

			this.rmqService.nack(ctx, event)
		} finally {
			endTimer()
		}
	}
}

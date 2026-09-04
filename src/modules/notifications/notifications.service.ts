import type { OtpRequestedEvent } from '@dewtix/contracts'
import { Injectable } from '@nestjs/common'
import { MailService } from 'src/infrastructure/mail/mail.service'
import { SmsService } from 'src/infrastructure/sms/sms.service'

@Injectable()
export class NotificationsService {
	public constructor(
		private readonly mailService: MailService,
		private readonly smsService: SmsService
	) {}

	public async sendOtp(data: OtpRequestedEvent) {
		const { identifier, code, type } = data

		if (type === 'email') await this.mailService.sendOtp(identifier, code)
		else await this.smsService.sendOtp(identifier, code)
	}
}

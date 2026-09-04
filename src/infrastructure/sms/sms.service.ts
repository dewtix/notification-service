import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { AxiosError } from 'axios'
import {
	catchError,
	delay,
	firstValueFrom,
	retryWhen,
	scan,
	throwError,
	timeout
} from 'rxjs'

import { SMS_OPTIONS } from './constants'
import type { SendSmsRequest, SendSmsResponse, SmsOptions } from './interfaces'

@Injectable()
export class SmsService {
	private readonly logger = new Logger(SmsService.name)

	private readonly BASE_URL = 'https://rest.nexmo.com/sms/json'

	public constructor(
		private readonly httpService: HttpService,
		@Inject(SMS_OPTIONS) private readonly options: SmsOptions
	) {}

	public async sendOtp(phone: string, code: string) {
		return this.send({
			destination: phone,
			text: `Ваш код подтверждения: ${code}`
		})
	}

	public async sendPhoneChange(phone: string, code: string) {
		return this.send({
			destination: phone,
			text: `Ваш код подтверждения смены номера телефона: ${code}`
		})
	}

	public async send(data: SendSmsRequest): Promise<SendSmsResponse> {
		const payload = {
			api_key: this.options.apiKey,
			api_secret: this.options.apiSecret,
			from: data.sender ?? this.options.from,
			to: data.destination.replace('+', ''),
			text: data.text,
			type: 'unicode'
		}

		return this.request<SendSmsResponse>('POST', payload)
	}

	private async request<T>(
		method: 'GET' | 'POST',
		body?: Record<string, unknown>
	): Promise<T> {
		try {
			const request = this.httpService
				.request<T>({
					method,
					url: this.BASE_URL,
					data: body,
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.pipe(
					timeout(7000),
					retryWhen(errors =>
						errors.pipe(
							scan((retryCount, error: unknown) => {
								if (retryCount >= 2) throw error

								this.logger.warn(
									`Retry request ${method} ${this.BASE_URL}: ${retryCount + 1}/3`
								)

								return retryCount + 1
							}, 0),
							delay(500)
						)
					),
					catchError((error: AxiosError) => {
						const details = error.response?.data ?? error.message

						this.logger.error(
							`Vonage API error (${method} ${this.BASE_URL})\n${JSON.stringify(details)}`
						)

						return throwError(() => error as Error)
					})
				)

			const response = await firstValueFrom(request)

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return response.data
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error)

			this.logger.error(
				`Request failed (${method} ${this.BASE_URL}): ${message}`
			)

			throw error
		}
	}
}

import { ConfigService } from '@nestjs/config'
import type { SmsOptions } from 'src/infrastructure/sms/interfaces'

export function getVonageConfig(configService: ConfigService): SmsOptions {
	return {
		apiKey: configService.get('vonage.apiKey') ?? '',
		apiSecret: configService.get('vonage.apiSecret') ?? '',
		from: configService.get('vonage.from') ?? ''
	}
}

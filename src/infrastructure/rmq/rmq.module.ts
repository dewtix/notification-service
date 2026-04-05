import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { RmqService } from './rmq.service'

@Global()
@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), RmqService]
})
export class RmqModule {}

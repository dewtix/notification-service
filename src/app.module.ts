import { Module } from '@nestjs/common'
import { RmqModule } from './infrastructure/rmq/rmq.module';

@Module({
	imports: [RmqModule]
})
export class AppModule {}

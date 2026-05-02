import { z } from 'zod'

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test'
}

export default z.object({
	NODE_ENV: z.enum(Environment).default(Environment.Development),

	RMQ_URL: z.string().nonempty(),
	RMQ_QUEUE: z.string().nonempty()
})

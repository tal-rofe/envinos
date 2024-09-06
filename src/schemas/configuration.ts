import { z } from 'zod';

export const configurationSchema = z.object({
	secrets: z.array(
		z.object({
			label: z.string().optional(),
			filePath: z.string(),
			key: z.string(),
		}),
	),
	skipKeyword: z.string().optional(),
	region: z.string().optional(),
});

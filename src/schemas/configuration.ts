import { z } from 'zod';

export const configurationSchema = z.object({
	secrets: z.array(
		z.object({
			label: z.string().optional(),
			key: z.string(),
			filePath: z.string(),
		}),
	),
	skipKeyword: z.string().optional(),
	region: z.string().optional(),
});

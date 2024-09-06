import type { z } from 'zod';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import { readConfiguration } from './helpers/read-configuration.js';
import type { configurationSchema } from './schemas/configuration.js';
import { generateEnvFile } from './utils/generate-env-file.js';
import { LoggerService } from './services/logger.js';

const clientConfiguration = await readConfiguration();
const secretManagerClient = new SecretsManagerClient({ region: clientConfiguration.region });

await Promise.all(
	clientConfiguration.secrets.map((secret, index) =>
		generateEnvFile(clientConfiguration, secretManagerClient, index).catch((error) => {
			LoggerService.warn(`Issues with generation of env file for secrets of "${secret.label ?? secret.key}": ${error}`);
		}),
	),
);

export type EnversifyConfig = z.infer<typeof configurationSchema>;

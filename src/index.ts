import { EOL } from 'node:os';

import type { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import { diff } from 'json-diff';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { readConfiguration } from './helpers/read-configuration.js';
import type { configurationSchema } from './schemas/configuration.js';

const clientConfiguration = await readConfiguration();

const secretManagerClient = new SecretsManagerClient({ region: clientConfiguration.region });

await Promise.allSettled(
	clientConfiguration.secrets.map(async (secret) => {
		const getSecretValueCommand = new GetSecretValueCommand({ SecretId: secret.key });

		const [dotEnvFileContent, getSecretValueResponse] = await Promise.all([
			// * Set to empty string on error (for the case the env file does not exist)
			fs.readFile(secret.filePath, 'utf8').catch(() => ''),
			secretManagerClient.send(getSecretValueCommand),
		]);

		const secretValue = getSecretValueResponse.SecretString;

		if (!secretValue) {
			return;
		}

		const parsedSecretValue = JSON.parse(secretValue);
		const parsedDotEnvFileContent = dotenv.parse(dotEnvFileContent);

		const envDifference = diff(parsedDotEnvFileContent, parsedSecretValue);

		if (!envDifference) {
			return;
		}

		for (const diffKey in envDifference) {
			if (diffKey.endsWith('__deleted')) {
				const envName = diffKey.replace('__deleted', '');

				delete parsedDotEnvFileContent[envName];
			} else if (diffKey.endsWith('__added')) {
				const envName = diffKey.replace('__added', '');
				const newEnvValue = envDifference[diffKey];

				parsedDotEnvFileContent[envName] = newEnvValue;
			} else {
				const newEnvValue = envDifference[diffKey]['__new'];

				if (clientConfiguration.skipKeyword !== undefined && newEnvValue !== clientConfiguration.skipKeyword) {
					parsedDotEnvFileContent[diffKey] = newEnvValue;
				}
			}
		}

		const newEnvFileContent =
			Object.entries(parsedDotEnvFileContent)
				.map((envEntry) => envEntry.join('='))
				.join(EOL) + EOL;

		await fs.outputFile(secret.filePath, newEnvFileContent, 'utf8');
	}),
);

export type EnversifyConfig = z.infer<typeof configurationSchema>;

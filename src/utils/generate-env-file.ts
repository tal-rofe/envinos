import { EOL } from 'node:os';

import type { z } from 'zod';
import fs from 'fs-extra';
import { GetSecretValueCommand, type SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';
import { diff } from 'json-diff';

import type { configurationSchema } from '../schemas/configuration.js';

export const generateEnvFile = async (
	clientConfiguration: z.infer<typeof configurationSchema>,
	secretsManagerClient: SecretsManagerClient,
	secretIndex: number,
) => {
	const secret = clientConfiguration.secrets[secretIndex]!;

	const getSecretValueCommand = new GetSecretValueCommand({ SecretId: secret.key });

	// * Generate the env file if does not exist
	await fs.ensureFile(secret.filePath);

	const [dotEnvFileContent, getSecretValueResponse] = await Promise.all([
		fs.readFile(secret.filePath, 'utf8'),
		secretsManagerClient.send(getSecretValueCommand),
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

			if (clientConfiguration.skipKeyword === undefined || newEnvValue !== clientConfiguration.skipKeyword) {
				parsedDotEnvFileContent[diffKey] = newEnvValue;
			}
		}
	}

	const newEnvFileContent =
		Object.entries(parsedDotEnvFileContent)
			.map((envEntry) => envEntry.join('='))
			.join(EOL) + EOL;

	await fs.outputFile(secret.filePath, newEnvFileContent, 'utf8');
};

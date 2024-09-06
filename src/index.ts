import path from 'node:path';
import { EOL } from 'node:os';

import dotenv from 'dotenv';
import fs from 'fs-extra';
import { diff } from 'json-diff';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const platformsData = {
	linkedin: {
		envFilePath: path.join(process.cwd(), 'apps', 'linkedin-api', '.env.development'),
		secretName: 'development/linkedin',
	},
	facebook: {
		envFilePath: path.join(process.cwd(), 'apps', 'facebook-api', '.env.development'),
		secretName: 'development/facebook',
	},
	twitter: {
		envFilePath: path.join(process.cwd(), 'apps', 'twitter-api', '.env.development'),
		secretName: 'development/twitter',
	},
	instagram: {
		envFilePath: path.join(process.cwd(), 'apps', 'instagram-api', '.env.development'),
		secretName: 'development/instagram',
	},
};

const secretManagerClient = new SecretsManagerClient({ region: 'eu-west-1' });

await Promise.allSettled(
	Object.values(platformsData).map(async (platformData) => {
		const getSecretValueCommand = new GetSecretValueCommand({ SecretId: platformData.secretName });

		const [dotEnvFileContent, getSecretValueResponse] = await Promise.all([
			// * Set to empty string on error (file does not exist)
			fs.readFile(platformData.envFilePath, 'utf8').catch(''),
			secretManagerClient.send(getSecretValueCommand),
		]);

		const parsedSecretValue = JSON.parse(getSecretValueResponse.SecretString);
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

				if (newEnvValue !== 'TODO') {
					parsedDotEnvFileContent[diffKey] = newEnvValue;
				}
			}
		}

		const newEnvFileContent =
			Object.entries(parsedDotEnvFileContent)
				.map((envEntry) => envEntry.join('='))
				.join(EOL) + EOL;

		await fs.outputFile(platformData.envFilePath, newEnvFileContent, 'utf8');
	}),
);

import { cosmiconfig } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import type { z } from 'zod';

import { CONFIGURATION_MODULE_NAME, CONFIGURATION_SEARCH_PLACES } from '../constants/cosmiconfig.js';
import { configurationSchema } from '../schemas/configuration.js';
import { formatSchemaError } from '../utils/format-schema-error.js';
import { LoggerService } from '../services/logger.js';

export const readConfiguration = async () => {
	const configurationExplorer = cosmiconfig(CONFIGURATION_MODULE_NAME, {
		searchPlaces: CONFIGURATION_SEARCH_PLACES,
		loaders: { '.ts': TypeScriptLoader() },
	});

	let clientConfiguration: z.infer<typeof configurationSchema>;

	try {
		const result = await configurationExplorer.search();

		if (!result || result.isEmpty || typeof result.config !== 'object') {
			LoggerService.error('Failed to parse configuration file (missing?)');

			process.exit(1);
		}

		const validatedConfiguration = await configurationSchema.safeParseAsync(result.config);

		if (!validatedConfiguration.success) {
			const schemaErrorMessage = formatSchemaError(validatedConfiguration.error.issues);

			LoggerService.error(schemaErrorMessage);

			process.exit(1);
		}

		clientConfiguration = validatedConfiguration.data;
	} catch (error) {
		LoggerService.error(`Failed to parse configuration file with an error: ${error}`);

		process.exit(1);
	}

	if (!clientConfiguration.region && !process.env.AWS_REGION) {
		LoggerService.error('AWS region must be configured via the Enversify configuration file, or from "AWS_REGION" environment variable');

		process.exit(1);
	} else if (!clientConfiguration.region) {
		clientConfiguration.region = process.env.AWS_REGION;
	}

	return clientConfiguration;
};

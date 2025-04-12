import os from 'node:os';

import type { ZodIssue } from 'zod';

export const formatSchemaError = (issues: ZodIssue[]) => {
	return issues
		.map((issue) => {
			const configurationFieldPath = issue.path.join('.');
			const configurationFieldErrorMessage = `Error from configuration field "${configurationFieldPath}": ${issue.message}`;

			return configurationFieldErrorMessage;
		})
		.join(os.EOL);
};

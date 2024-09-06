import type { ZodIssue } from 'zod';

export const formatSchemaError = (issues: ZodIssue[]) => {
	return issues
		.map((issue) => {
			const configurationFieldPath = issue.path.join('.');
			const configurationFieldErrorMessage = `[Enversify] Error from configuration field "${configurationFieldPath}": ${issue.message}`;

			return configurationFieldErrorMessage;
		})
		.join('\n');
};

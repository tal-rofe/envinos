import type { EnversifyConfig } from './dist';

const config: EnversifyConfig = {
	secrets: [
		{
			filePath: '.env',
			key: 'development/yazif',
		},
	],
	skipKeyword: 'TODO',
	region: 'eu-west-1',
};

export default config;

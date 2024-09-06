import type { Config } from '@exlint.io/inflint';

const inflintConfig: Config = {
	rules: {
		'**/*.yml': 2,
		'src/**/*': [2, 'kebab-case'],
	},
};

export default inflintConfig;

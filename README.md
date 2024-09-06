<p align="center">
    <img src="./assets/brand.png" width="350" />
</p>

<p align="center">
	<a href="https://github.com/tal-rofe/envinos">
    	<img src="https://img.shields.io/github/actions/workflow/status/tal-rofe/envinos/integrate.yaml?label=CI&logo=GitHub" alt="CI status">
  	</a>
	<a href="https://www.npmjs.com/package/envinos">
    	<img src="https://img.shields.io/npm/dm/envinos?logo=NPM" alt="npm downloads">
  	</a>
	<a href="https://github.com/tal-rofe/envinos">
    	<img src="https://img.shields.io/npm/l/envinos" alt="npm license">
  	</a>
	<a href="https://github.com/tal-rofe/envinos">
    	<img src="https://img.shields.io/npm/v/envinos?label=version" alt="version">
  	</a>
</p>

<hr />

Sync and share your local environment variables from AWS Secrets Manager service among developers

> [!NOTE]
> Currently only support AWS Secrets Manager, but in the future, may support other external stores with dedicated plugins

## Usage

To use the package you first need to install it as dev dependency:

```bash
npm i -D envinos
```

Then you need to configure your `package.json#scripts` with:

```json
{
	"postinstall": "envinos"
}
```

This will automatically sync the environment variables from AWS Secrets Manager service once any developer in the team will run `npm i`.

## Configuration

You can specify the configuration of Envinos through various options, but one must be provided.
Configuration can be set in the following files (can be configured in home directory or in the root folder of your project):

-   a `package.json` property: `"envinos": {...}` or in `~/package.json`, for example
-   a `.envinosrc` file in JSON or YAML format
-   a `.envinosrc.json`, `.envinosrc.yaml`, `.envinosrc.yml`, `.envinosrc.js`, or `.envinosrc.cjs` file
-   a `envinos.config.ts`, `envinos.config.js`, or `envinos.config.cjs` CommonJS module exporting an object

### Configuration Options

-   `secrets` (**required**): an array of objects, where you configure multiple environment variables files.
-   `secrets.*.label` (**optional**) - Label of the environment variables
-   `secrets.*.key` (**required**) - The AWS Secrets Manager entry identifier, where the secrets will be fetched from
-   `secrets.*.filePath` (**required**) - The file path where the environment variables will be stored
-   `skipKeyword` (**optional**): sometimes, you have some environment variables that should be configured per each developer and not shared. You can set an explicit keyword, so Envinos won't override the variables with this keyword. For example, if you set it to "TODO" and set the value of variable "MY_ENV" in AWS Secrets Manager with value of "TODO" - Envinos won't override this variable "MY_ENV" (which might have been configured manually by the developer).
-   `region` (**optional**): A valid AWS region - where you store your secrets in the AWS Secrets Manager service. If you don't provide this field, Envinos will fail, **unless** you have `AWS_REGION` configured in the user environment variables.

### Configuration Schema

You can get the schema with JSONSchema, TypeScript or JSDoc, in order to have auto-completions for your configuration file.

**`import` statement (TypeScript & JSDoc):**

```ts
import type { EnvinosConfig } from 'envinos';
```

**`$schema` field (JSON):**

```json
{
	"$schema": "./node_modules/envinos/schema.json"
}
```

## Authors

<a href="https://github.com/tal-rofe">
    <img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/100444463?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" height="50" />
</a>

## License

[MIT](https://choosealicense.com/licenses/mit/)

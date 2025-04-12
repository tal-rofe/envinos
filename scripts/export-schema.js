import fs from "node:fs/promises";
import path from "node:path";

import { load as tsImportLoad } from 'ts-import';
import { z } from "zod";

const schemaPath = path.join(process.cwd(), 'src', 'schemas', 'configuration.ts');
const schemaModule = await tsImportLoad(schemaPath, { useCache: false });
const zodSchema = schemaModule.configurationSchema;
const jsonSchema = z.toJSONSchema(zodSchema, { target: "draft-7" });

const fullJsonSchema = {
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$ref": "#/definitions/envinos",
	"title": "Envinos configuration for JSON",
	"definitions": {
		"envinos": jsonSchema
	}
}

await fs.writeFile(path.join(process.cwd(), 'schema.json'), JSON.stringify(fullJsonSchema, null, 2));
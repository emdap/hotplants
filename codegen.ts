import type { CodegenConfig } from "@graphql-codegen/cli";

const schema = process.argv.slice(-1);

const config: CodegenConfig = {
  schema,
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  ignoreNoDocuments: true,
  config: {
    skipTypename: true,
    nullability: false,
  },

  generates: {
    "src/generated/graphql/": {
      preset: "client",
      config: {
        enumsAsTypes: true,
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "src/generated/graphql/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;

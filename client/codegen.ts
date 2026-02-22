import type { CodegenConfig } from "@graphql-codegen/cli";

const args = process.argv.slice(2);

const config: CodegenConfig = {
  schema: args[0],
  documents: args[1] === "OMIT" ? [] : ["src/**/*.tsx", "src/**/*.ts"],
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

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
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

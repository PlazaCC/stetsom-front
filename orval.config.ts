import { defineConfig } from "orval";

export default defineConfig({
  stetsom: {
    input: "http://localhost:3333/docs/yaml",
    output: {
      target: "./src/api/stetsom/client.ts",
      schemas: "./src/api/stetsom/schemas",
      baseUrl: "https://localhost:3333",
      mock: true,
      httpClient: "axios",
    },
  },
});

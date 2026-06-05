import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiBase = process.env.CMS_API_BASE_URL ?? "http://localhost:3333";

export default defineConfig({
  stetsom: {
    input: {
      target: `${apiBase}/docs/json`,
    },
    output: {
      // Splits generated files by OpenAPI tag (Products, Banners, Pages, etc.)
      mode: "tags-split",
      target: "./src/api/stetsom/endpoints",
      schemas: "./src/api/stetsom/model",
      client: "react-query",
      // axios → mutator receives a single AxiosRequestConfig object
      httpClient: "axios",
      // Custom mutator: handles server-side (direct) vs client-side (BFF proxy)
      override: {
        mutator: {
          path: "./src/api/stetsom/orval-client.ts",
          name: "orvalClient",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write ./src/api/stetsom",
    },
  },
});

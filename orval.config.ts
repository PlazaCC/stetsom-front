import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config();

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";

export default defineConfig({
  stetsom: {
    input: `${apiBase}/docs/yaml`,
    output: {
      target: "./src/api/stetsom/client.ts",
      schemas: "./src/api/stetsom/schemas",
      baseUrl: apiBase,
      mock: true,
      httpClient: "axios",
    },
  },
});

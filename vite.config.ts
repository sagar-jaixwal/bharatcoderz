import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { groqChatPlugin } from "./plugins/groqChatPlugin.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  }

  return {
    plugins: [react(), groqChatPlugin()],
  };
});

import { UserConfig } from "vite";
import dts from "vite-plugin-dts";

interface ViteConfigOptions {
  name: string;
}

export const viteConfig = ({ name }: ViteConfigOptions) =>
  ({
    plugins: [
      dts({
        include: ["./lib"],
        outDir: "./dist",
        entryRoot: "./lib",
        tsconfigPath: "./tsconfig.json",
      }),
    ],
    build: {
      target: "esnext",
      minify: "esbuild",
      lib: {
        name,
        entry: "./lib/index.ts",
        fileName: (format: string) => `index.${format}.js`,
        formats: ["es", "umd", "cjs"],
      },
      rollupOptions: {
        external: ["@hellajs/core"],
        output: {
          globals: {
            "@hellajs/core": "Hella",
          },
        },
      },
    },
    esbuild: {
      pure: ["console.warn", "console.error"],
      legalComments: "none",
    },
  }) as unknown as UserConfig;

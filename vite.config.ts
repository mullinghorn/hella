import { UserConfig } from "vite";
import dts from "vite-plugin-dts";

export const viteConfig = ({ name }: any) =>
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
        external: ["@hella/core"],
        output: {
          globals: {
            "@hella/core": "Hella",
          },
        },
      },
    },
    esbuild: {
      pure: ["console.warn", "console.error"],
      legalComments: "none",
    },
  }) as unknown as UserConfig;

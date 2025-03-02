import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Add ignores at the top level, outside nested configs
    ignores: [
      "**/dist/**/*",
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      }
    },
    // ESLint
    rules: {}
  },
  // TypeScript
  {
    rules: {
      "@typescript-eslint/no-invalid-void-type": "off",
    }
  },
  // Stylistic
  {
    rules: {}
  }
);
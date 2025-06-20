// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Các quy tắc từ cấu hình mới
      '@typescript-eslint/no-explicit-any': 'off', // Giữ nguyên tắt này theo cấu hình mới
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": [
        "error",
        {
          "endOfLine": "auto"
        }
      ],

      // Thêm các quy tắc từ cấu hình cũ
      '@typescript-eslint/interface-name-prefix': 'error', // Sửa từ 'on' sang 'error'
      '@typescript-eslint/explicit-function-return-type': 'error', // Sửa từ 'on' sang 'error'
      '@typescript-eslint/explicit-module-boundary-types': 'error', // Sửa từ 'on' sang 'error'
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all', // Áp dụng cho tất cả các biến
          args: 'after-used', // Kiểm tra các tham số hàm sau khi sử dụng
          ignoreRestSiblings: false, // Kiểm tra các phần tử bị bỏ qua trong destructuring
        },
      ],
    },
  },
);
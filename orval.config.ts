import { defineConfig } from 'orval';

export default defineConfig({
  medistaffAdmin: {
    input: {
      // TODO admin backend api swagger url로 수정
      target: 'api/v1',
    },
    output: {
      mode: 'tags-split',
      target: 'src/orval/api',
      schemas: 'src/orval/model',
      //   client: 'react-query',
      prettier: true,
      tsconfig: 'tsconfig.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

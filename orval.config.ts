import { defineConfig } from 'orval';

export default defineConfig({
  medistaffAdmin: {
    input: {
      target: 'http://localhost:8045' + '/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'src/orval/api',
      schemas: 'src/orval/model',
      client: 'react-query',
      prettier: true,
      tsconfig: 'tsconfig.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
``;

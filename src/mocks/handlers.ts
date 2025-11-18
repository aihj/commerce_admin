import { http } from 'msw';
const confStringIdx = 'test2024';
export const handlers = [
  // Intercept the "GET /resource" request.
  http.get(`/api/pco/${confStringIdx}/programs`, () => {
    return new Response('Hello world!');
  }),
];

export const createSettings = (method: string, body?: object) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

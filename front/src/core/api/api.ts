export const get = (url: string) => fetch(url);

export const post = (url: string, body?: any) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

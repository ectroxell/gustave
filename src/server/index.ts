import express from 'express';
import { createServer as createViteServer } from 'vite';

const PORT = 3030;

async function start() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`Gustave running at http://localhost:${PORT}`);
  });
}

start();

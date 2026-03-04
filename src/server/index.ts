import { createServer as createViteServer } from 'vite';
import { app } from './app.js';

const PORT = 3030;

async function start() {
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

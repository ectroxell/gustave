import { app } from './app.js';

const PORT = 3031;

app.listen(PORT, () => {
  console.log(`Gustave API running at http://localhost:${PORT}`);
});

import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`The server is available at http://localhost:${PORT}`);
});
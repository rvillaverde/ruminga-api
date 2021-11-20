import express from 'express';
import cors from 'cors';
import stories from './routes/story';

const app = express();
const port = 3000;

app.use(cors());

app.use('/stories', stories);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

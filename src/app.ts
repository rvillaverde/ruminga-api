import express from 'express';
import cors from 'cors';
import stories from './routes/story';
import texts from './routes/texts';

const app = express();
const port = 3000;

app.use(cors());

app.use('/stories', stories);
app.use('/texts', texts);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

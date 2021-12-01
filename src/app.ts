import express from 'express';
import cors from 'cors';
import config from './config';
import photos from './routes/photo';
import prints from './routes/print';
import stories from './routes/story';
import texts from './routes/texts';

const app = express();
const port = config.port;

app.use(cors());

app.use('/photos', photos);
app.use('/prints', prints);
app.use('/stories', stories);
app.use('/texts', texts);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

import express from 'express';
import photoApi from '../api/photo';
import { fetchImage } from '../helpers';

const router = express.Router();

router.get('/', async (req, res) => {
  const stories = await photoApi.list();

  res.setHeader('Content-Type', 'application/json');
  res.json(stories);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const photo = await photoApi.find(id);

    res.setHeader('Content-Type', 'application/json');
    res.json(photo);
  } catch (error) {
    res.status(404);
    res.send({ error });
  }
});

// @TODO: Add support for thumbnails
router.get('/:id/image', async (req, res) => {
  try {
    const id = req.params.id;
    const { image } = await photoApi.find(id);

    const blob = await fetchImage(image.originalUrl);
    res.type(blob.type);
    blob.arrayBuffer().then(buf => res.send(Buffer.from(buf)));
  } catch (error) {
    res.status(404);
    res.send({ error });
  }
});

export default router;

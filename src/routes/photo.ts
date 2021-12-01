import express from 'express';
import photoApi from '../api/photo';

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

export default router;

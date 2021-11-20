import express from 'express';
import storyApi from '../api/story';

const router = express.Router();

router.get('/', async (req, res) => {
  const stories = await storyApi.list();

  res.setHeader('Content-Type', 'application/json');
  res.json(stories);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const story = await storyApi.find(id);

    res.setHeader('Content-Type', 'application/json');
    res.json(story);
  } catch (error) {
    res.status(404);
    res.send({ error });
  }
});

export default router;

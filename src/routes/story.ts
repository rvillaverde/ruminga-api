import express from 'express';
const router = express.Router();

import storyApi from '../api/story';

router.get('/', async (req, res) => {
  const stories = await storyApi.list();

  res.setHeader('Content-Type', 'application/json');
  res.json(stories);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const story = await storyApi.get(id);

    res.setHeader('Content-Type', 'application/json');
    res.json(story);
  } catch (error) {
    res.status(404);
    res.send({ errorCode: error });
  }
});

export default router;

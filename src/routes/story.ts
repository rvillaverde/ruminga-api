import express from 'express';
import photoApi from '../api/photo';
import storyApi from '../api/story';

const router = express.Router();

router.get('/', async (req, res) => {
  const stories = await storyApi.list();

  res.json(stories);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const story = await storyApi.find(id);

    res.json(story);
  } catch (error) {
    res.status(500);
    res.send({ error });
  }
});

router.get('/:id/photos', async (req, res) => {
  try {
    const id = req.params.id;
    const photos = await photoApi.findByStoryId(id);

    res.json(photos);
  } catch (error) {
    res.status(500);
    res.send({ error });
  }
});

export default router;

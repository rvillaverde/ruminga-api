import express from 'express';
import textsApi from '../api/texts';

const router = express.Router();

router.get('/', async (req, res) => {
  const texts = await textsApi.list();

  res.setHeader('Content-Type', 'application/json');
  res.json(texts);
});

export default router;

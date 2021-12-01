import express from 'express';
import printApi from '../api/print';

const router = express.Router();

router.get('/', async (req, res) => {
  const prints = await printApi.list();

  res.setHeader('Content-Type', 'application/json');
  res.json(prints);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const print = await printApi.find(Number(id));

    res.setHeader('Content-Type', 'application/json');
    res.json(print);
  } catch (error) {
    res.status(404);
    res.send({ error });
  }
});

export default router;

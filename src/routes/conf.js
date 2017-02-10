import express from 'express';
import config from 'config';

const router = express.Router();

router.get('/', (req, res) => {
  let result = {};

  req.query.keys.split(',').forEach((key) => {
    result[key] = config.get(key);
  });

  res.json(result);
});

export default router;

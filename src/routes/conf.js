import express from 'express';
import config from 'config';

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    let result = {};

    req.query.keys.split(',').forEach((key) => {
      result[key] = config.get(key);
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

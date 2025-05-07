import { Router } from 'express';
import { getSeva, getSevas } from '../controllers/seva.js';

const router = Router();

router.get('/', getSevas);

router.get('/:code', getSeva);

export default router;

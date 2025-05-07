import { Router } from 'express';
import Seva from '../models/Seva';
import { getSeva, getSevas } from '../controllers/seva';

const router = Router();

router.get('/', getSevas);

router.get('/:code', getSeva);

export default router;

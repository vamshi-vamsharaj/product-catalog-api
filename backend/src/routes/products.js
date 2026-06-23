
import { Router }                                       from 'express';
import { listProducts }                                  from '../controllers/productController.js';
import { validateLimit, validateCategory, validateCursor } from '../middleware/validate.js';

const router = Router();


router.get('/', validateLimit, validateCategory, validateCursor, listProducts);

export default router;
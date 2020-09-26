// Core
import express from 'express';
import cors from 'cors';

// Instruments
import { get } from './route';
import { getProject } from './project';
import { getCities } from './cities';
import { addToDb } from './add-to-db';

const router = express.Router();
router.use(cors());

router.get('/', get);

router.get('/cities', getCities);

router.get('/add-to-db', addToDb);

router.get('/:project', getProject);

export { router as projects };

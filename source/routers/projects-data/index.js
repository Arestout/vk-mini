// Core
import express from 'express';
import cors from 'cors';

// Instruments
import { get } from './route';
import { getProject } from './project';
import { getCities } from './cities';

const router = express.Router();

router.get('/', cors(), get);

router.get('/cities', cors(), getCities);

router.get('/:project', cors(), getProject);

export { router as projects };

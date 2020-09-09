// Core
import express from 'express';
import cors from 'cors';

// Instruments
import { get } from './route';
import { getProject } from './project';

const router = express.Router();

router.get('/', get);

router.get('/:project', getProject);

export { router as projects };

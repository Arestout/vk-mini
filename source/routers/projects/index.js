// Core
import express from 'express';
import cors from 'cors';

// Instruments
import { get } from './route';
import { getProject } from './project';

const router = express.Router();

router.get('/', cors(), get);

router.get('/:project', cors(), getProject);

export { router as projects };

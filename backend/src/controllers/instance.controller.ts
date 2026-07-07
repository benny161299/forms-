import { Request, Response } from 'express';
import { InstanceModel } from '../models/Instance.model.js';

export const createInstance = async (req: Request, res: Response) => {
  try {
    const newInstance = await InstanceModel.create(req.body);
    return res.status(201).json(newInstance);
  } catch (error) {
    console.error('Error creating instance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




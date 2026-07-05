import { Request, Response } from 'express';
import { SchemaModel } from '../models/Schema.model.js';
import { Ischema } from '../types/schema.types.js';

export const createSchema = async (req: Request, res: Response) => {
  try {
    const newSchema = await SchemaModel.create(req.body);

    return res.status(201).json(newSchema);
  } catch (error) {
    console.error('Error creating schema:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
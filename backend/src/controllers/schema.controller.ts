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


export const getSchemas = async (req: Request, res: Response) => {
  try {
    const schemas = await SchemaModel.find({ isDraft: false });
    return res.status(200).json(schemas);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const getSchemaDrafts = async (req: Request, res: Response) => {
  try {
    const drafts = await SchemaModel.find({ isDraft: true });
    return res.status(200).json(drafts);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
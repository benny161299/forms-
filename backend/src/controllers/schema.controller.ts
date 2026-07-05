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


export const getSchemaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = await SchemaModel.findById(id);

    if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
    }
    
    return res.status(200).json(schema);
  } catch (error) {
    console.error('Error fetching schema by id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSchema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedSchema = await SchemaModel.findOneAndUpdate(
      { _id: id, isDraft: true }, 
      req.body,
    );

    if (!updatedSchema) {
      return res.status(404).json({ 
        error: 'Schema not found, or it is not a draft' 
      });
    }

    return res.status(200).json(updatedSchema);
  } catch (error) {
    console.error('Error updating schema:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSchema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSchema = await SchemaModel.findByIdAndDelete(id);
    
    if (!deletedSchema) {
      return res.status(404).json({ error: 'Schema not found' });
    }
    
    return res.status(200).json({ message: 'Schema deleted successfully' });
  } catch (error) {
    console.error('Error deleting schema:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
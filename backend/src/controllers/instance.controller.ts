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


export const getInstances = async (req: Request, res: Response) => {
  try {
    const instances = await InstanceModel.find({ isDraft: false });
    return res.status(200).json(instances);
  } catch (error) {
    console.error('Error fetching instances:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInstancesDrafts = async (req: Request, res: Response) => {
  try {
    const instances = await InstanceModel.find({ isDraft: true });
    return res.status(200).json(instances);
  } catch (error) {
    console.error('Error fetching instances drafts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const getInstancesBySchemaId = async (req: Request, res: Response) => {
  try {
    const { schemaId } = req.params;
    const instances = await InstanceModel.find({ schemaId});
    return res.status(200).json(instances);
  } catch (error) {
    console.error('Error fetching instances by schemaId:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
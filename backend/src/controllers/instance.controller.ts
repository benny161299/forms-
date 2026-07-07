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
    const instance = await InstanceModel.find({schemaId});
    if (!instance) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    return res.status(200).json(instance);
  } catch (error) {
    console.error('Error fetching instance by schemaId:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInstanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instance = await InstanceModel.findById(id);

    if (!instance) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    return res.status(200).json(instance);
  } catch (error) {
    console.error('Error fetching instance by id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInstance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedInstance = await InstanceModel.findOneAndUpdate(
      { _id: id, isDraft: true },
      req.body);

    if (!updatedInstance) {
      return res.status(404).json({ 
        error: 'Instance not found, or it is not a draft' 
      });
    }

    return res.status(200).json(updatedInstance);
  } catch (error) {
    console.error('Error updating instance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInstance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedInstance = await InstanceModel.findByIdAndDelete(id);

    if (!deletedInstance) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    return res.status(200).json({message: 'Instance deleted successfully' });
  } catch (error) {
    console.error('Error deleting instance:', error);
    return res.status(500).json({error: 'Internal server error' });
  }
};
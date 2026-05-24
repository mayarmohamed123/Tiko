import { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';
import { paramId } from '../utils/params.js';

export const listCustomers = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const customers = await customerService.listCustomers({
      search: req.query.search as string | undefined,
      status: status === 'active' ? 'ACTIVE' : status === 'inactive' ? 'INACTIVE' : undefined,
    });
    res.json(customers);
  } catch {
    res.status(500).json({ message: 'Failed to fetch customers.' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.getCustomerById(paramId(req.params.id));
    res.json(customer);
  } catch (e: unknown) {
    if ((e as Error).message === 'CUSTOMER_NOT_FOUND') {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(500).json({ message: 'Failed to fetch customer.' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await customerService.softDeleteCustomer(paramId(req.params.id));
    res.json({ message: 'Customer deactivated.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete customer.' });
  }
};

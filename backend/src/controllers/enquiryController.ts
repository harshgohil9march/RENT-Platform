import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// POST: Submit a new enquiry (Guests & Users)
export const createEnquiry = async (req: Request, res: Response): Promise<any> => {
  try {
    const propertyId = req.params.id;
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone, and message are required' });
    }

    const query = 'INSERT INTO enquiries (property_id, name, phone, message) VALUES (?, ?, ?, ?)';
    await pool.execute(query, [propertyId, name, phone, message]);

    res.status(201).json({ message: 'Owner will contact you soon' });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET: Fetch enquiries for the logged-in owner's properties
export const getOwnerEnquiries = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const ownerId = req.user.userId;
    
    // Join properties and enquiries to only get messages for this owner's buildings
    const query = `
      SELECT e.*, p.title as property_title 
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      WHERE p.owner_id = ?
      ORDER BY e.created_at DESC
    `;
    const [enquiries]: any = await pool.execute(query, [ownerId]);
    
    res.json(enquiries);
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
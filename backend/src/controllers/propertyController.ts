import { Request, Response } from 'express';
import pool from '../config/db';
import {AuthRequest} from '../middleware/authMiddleware'
export const getProperties = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM properties';
        let params: any[] = [];

        // If a category is provided in the URL, filter by it
        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    }
    catch (err) {
        console.log('Error fetching properties: ', err);
        res.status(500).json({ message: 'Server Error' })
    }
};

//It searches for a specific ID. If it finds the property, it makes a second query to fetch all linked images from the property_images table,
export const getPropertyById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const [propertyRows]: any = await pool.execute('SELECT * FROM properties WHERE id = ?', [id]);

        if (propertyRows.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const property = propertyRows[0];

        // 2. Fetch the related images for this property
        const [imageRows]: any = await pool.execute('SELECT image_url FROM property_images WHERE property_id = ?', [id]);

        // Convert the image rows into a simple array of strings and attach it to the property object
        property.images = imageRows.map((row: any) => row.image_url);

        res.json(property);
    } catch (error) {
        console.error('Error fetching property by ID:', error);
        res.status(500).json({ message: 'Server Error' });

    }
};

export const createProperty = async(req: Request, res: Response): Promise<any> =>{
    try{
        const {title, description, rent_monthly, deposit, category, locality, owner_id} = req.body;

        if(!title || !rent_monthly){
            return res.status(400).json({message: 'Title and Rent are required'});
        }

        const query = `INSERT INTO properties(title, description, rent, deposit, category,locality, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result]: any = await pool.execute(query, [title, description, rent_monthly, deposit, category,locality , owner_id]);

        res.status(201).json({
            message: 'Property created successfully',
            propertyId: result.insertId
        })
    } catch(err){
        console.log('Error creating property:', err);
        res.status(500).json({messsage: 'Server Error'});
    }
};

// PATCH: Update an existing property
export const updateProperty = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, rent, description } = req.body;

    // 1. Fetch property to check ownership
    const [propCheck]: any = await pool.execute('SELECT owner_id FROM properties WHERE id = ?', [id]);
    
    if (propCheck.length === 0) return res.status(404).json({ message: 'Property not found' });
    
    // 2. CRITICAL: Check if logged-in user is the actual owner
    if (propCheck[0].owner_id !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this property' });
    }

    const query = 'UPDATE properties SET title = ?, rent = ?, description = ? WHERE id = ?';
    await pool.execute(query, [title, rent, description, id]);

    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// DELETE: Remove a property
export const deleteProperty = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const [propCheck]: any = await pool.execute('SELECT owner_id FROM properties WHERE id = ?', [id]);
    
    if (propCheck.length === 0) return res.status(404).json({ message: 'Property not found' });
    if (propCheck[0].owner_id !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this property' });
    }

    await pool.execute('DELETE FROM properties WHERE id = ?', [id]);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET: Fetch only properties owned by the logged-in user
export const getMyProperties = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const [properties]: any = await pool.execute('SELECT * FROM properties WHERE owner_id = ?', [req.user.userId]);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
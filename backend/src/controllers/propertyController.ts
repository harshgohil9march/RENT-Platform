import { Request, Response } from 'express';
import pool from '../config/db';

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

export const updateProperty = async (req: Request, res: Response): Promise<any> => {
  try {
    // req.params pulls the ID from the URL (e.g., /api/properties/5 means id is 5)
    const { id } = req.params;
    
    // We extract the fields the user wants to update from the body
    const { title, rent_monthly, description } = req.body;

    const query = 'UPDATE properties SET title = ?, rent = ?, description = ? WHERE id = ?';
    
    const [result]: any = await pool.execute(query, [title, rent_monthly, description, id]);

    // result.affectedRows tells us how many database rows were changed.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property updated successfully' });

  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const deleteProperty = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM properties WHERE id = ?';
    const [result]: any = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
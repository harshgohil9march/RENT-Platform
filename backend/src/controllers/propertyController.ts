import { Request, Response } from 'express';
import pool from '../config/db';

export const getProperties = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM properties';
        let params: any[] = [];

        // If a category is provided in the URL, filter by it
        if (category) {
            query += 'WHERE category = ?';
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
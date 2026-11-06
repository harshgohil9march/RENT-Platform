import { Request, Response } from "express";
import pool from '../config/db';
import bcrypt from 'bcryptjs'; // brypctjs package do hashes password if database hacks but password doesnt leak
import jwt from 'jsonwebtoken'; // it works as identity card when user login it(server) creates a token so user doesn't need to give password on every request.

// POST: Register a new user
export const register = async(req: Request, res: Response): Promise<any> =>{
    try{
        const {name, email, password, role} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'ALL Name, email and password are required'});
        }

        // 1. Check if given email already exists
        const[existingUsers]: any = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if(existingUsers.length > 0) return res.status(400).json({message: 'Email already registered'});

        // 2. Hash the password
        // genSalt(10) adds random data to the hash to prevent dictionary attacks
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Insert into database
        const userRole = role || 'tenant';
        const query = 'INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)';
        const [result]: any = await pool.execute(query, [name, email, password_hash, userRole])

        res.status(201).json({message: 'User registered successfully', userId: result.insertId});

    }catch(err){
        console.log('Error registering user: ', err);
        res.status(500).json({message: 'Server Error'});
    }
}

// POST: Login User
export const login = async(req: Request, res: Response): Promise<any> => {
    try {
        const {email, password} = req.body;

        if(!email || ! password){
            return res.status(400).json({message: 'Email and Password are required'});
        }
        // 1. fetch user by email
        const [users]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if(users.length == 0) return res.status(410).json({message: 'Invalid Credentials'});

        const user = users[0];

        // 2. Compare the plain-text password with the database hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) return res.status(401).json({message: 'Invalid Credentials'});

        // 3. Generate JWT (The digital ID card) it is given to user by server
        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET as string,
            {expiresIn: '7d'}
        )

        // 4. Set HTTP-only Cookie( it is given by browser & it protects by mallcious attacker )
        // httpOnly means JavaScript cannot read it (prevents XSS hacker attacks)
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day sin milliseconds
        } )

        res.json({
            message: 'Logged in succesfully',
            user: {id: user.id, name:user.name, email: user.email, role: user.role}
        })
    } catch (error) {
        console.error('Error logging in: ', error);
        res.status(500).json({message: 'Seerver Error'});
    }
};

// POST: Logout user
export const logout = (req: Request, res: Response) =>{
    res.clearCookie('token');
    res.json({message: 'Logged out succesfully'});
}



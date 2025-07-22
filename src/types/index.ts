import { Request } from 'express';

export interface User {
    _id?: string;
    email: string;
    password: string;
    name: string;
    role: 'student' | 'instructor' | 'admin';
    profilePicture?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthRequest extends Request {
    user?: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'instructor';
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
import { Request, Response, NextFunction } from 'express';

// Custom logging middleware to show real-time requests and responses
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const timestamp = new Date().toLocaleString();
    
    // Log incoming request
    console.log('\n' + '='.repeat(80));
    console.log(`🔵 INCOMING REQUEST [${timestamp}]`);
    console.log('='.repeat(80));
    console.log(`📍 ${req.method} ${req.originalUrl}`);
    console.log(`🌐 IP: ${req.ip || req.connection.remoteAddress}`);
    console.log(`📱 User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
    
    // Log headers (excluding sensitive ones)
    const headers = { ...req.headers };
    if (headers.authorization) {
        headers.authorization = headers.authorization.substring(0, 20) + '...';
    }
    console.log(`📋 Headers:`, JSON.stringify(headers, null, 2));
    
    // Log request body (excluding sensitive fields)
    if (req.body && Object.keys(req.body).length > 0) {
        const body = { ...req.body };
        if (body.password) {
            body.password = '*'.repeat(body.password.length);
        }
        console.log(`📦 Body:`, JSON.stringify(body, null, 2));
    }
    
    // Capture the original res.json to log responses
    const originalJson = res.json;
    res.json = function(data: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('\n' + '-'.repeat(80));
        console.log(`🟢 OUTGOING RESPONSE [${new Date().toLocaleString()}]`);
        console.log('-'.repeat(80));
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📤 Response:`, JSON.stringify(data, null, 2));
        console.log('='.repeat(80) + '\n');
        
        return originalJson.call(this, data);
    };
    
    next();
};

// Error logging middleware
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction): void => {
    const timestamp = new Date().toLocaleString();
    
    console.log('\n' + '🔴'.repeat(40));
    console.log(`❌ ERROR [${timestamp}]`);
    console.log('🔴'.repeat(40));
    console.log(`📍 ${req.method} ${req.originalUrl}`);
    console.log(`🚨 Error: ${err.message}`);
    console.log(`📚 Stack: ${err.stack}`);
    console.log('🔴'.repeat(40) + '\n');
    
    next(err);
};

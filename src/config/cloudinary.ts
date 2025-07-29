import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

// Create memory storage for multer (we'll upload to Cloudinary manually)
const storage = multer.memoryStorage();

// Create multer upload middleware
export const uploadProfileImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req: any, file: any, cb: any) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (
    buffer: Buffer, 
    userId: string
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const publicId = `profile_${userId}_${timestamp}`;
        
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                folder: 'edugenie/profiles',
                transformation: [
                    { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                    { quality: 'auto:good' },
                    { format: 'webp' }
                ],
                overwrite: true,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                } else {
                    reject(new Error('Upload failed - no result'));
                }
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
    });
};

// Function to delete old profile image from Cloudinary
export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
    try {
        if (imageUrl && imageUrl.includes('cloudinary.com')) {
            // Extract public_id from Cloudinary URL
            const urlParts = imageUrl.split('/');
            const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
            
            if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
                // Get the part after version (folder/filename)
                const pathAfterVersion = urlParts.slice(versionIndex + 1).join('/');
                const publicId = pathAfterVersion.split('.')[0]; // Remove file extension
                
                // Delete from Cloudinary
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted old profile image: ${publicId}`);
            }
        }
    } catch (error) {
        console.error('Error deleting old profile image:', error);
        // Don't throw error - just log it, as this shouldn't block the main operation
    }
};

export default cloudinary;

# Profile Management API

## 📸 Profile Picture Upload Feature

### Overview
Complete profile picture management system using Cloudinary for both students and instructors.

### Features
- ✅ Upload profile pictures (JPG, PNG, GIF, WebP)
- ✅ Automatic image optimization (300x300px, WebP format)
- ✅ Face-focused cropping
- ✅ Replace existing profile pictures
- ✅ Remove profile pictures
- ✅ 5MB file size limit
- ✅ Secure cloud storage with Cloudinary

---

## 🔗 API Endpoints

### 1. Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@email.com",
    "role": "student|instructor|admin",
    "profilePicture": "https://cloudinary.com/...",
    "createdAt": "2025-07-25T10:00:00.000Z",
    "updatedAt": "2025-07-25T10:00:00.000Z"
  }
}
```

### 2. Upload Profile Picture
```http
POST /api/profile/picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- profilePicture: [image file]
```

**Response:**
```json
{
  "message": "Profile picture uploaded successfully",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@email.com",
    "role": "student",
    "profilePicture": "https://res.cloudinary.com/duocpqb1j/image/upload/..."
  },
  "imageDetails": {
    "url": "https://res.cloudinary.com/duocpqb1j/image/upload/...",
    "publicId": "edugenie/profiles/profile_userId_timestamp"
  }
}
```

### 3. Remove Profile Picture
```http
DELETE /api/profile/picture
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Profile picture removed successfully",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@email.com",
    "role": "student",
    "profilePicture": ""
  }
}
```

### 4. Update Profile Information
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "New Name",
    "email": "user@email.com",
    "role": "student",
    "profilePicture": "https://cloudinary.com/...",
    "createdAt": "2025-07-25T10:00:00.000Z",
    "updatedAt": "2025-07-25T10:05:00.000Z"
  }
}
```

---

## 📋 Usage Examples

### Postman Testing

#### 1. Upload Profile Picture
1. **Method**: POST
2. **URL**: `http://your-server:3000/api/profile/picture`
3. **Headers**: 
   - `Authorization: Bearer <your_jwt_token>`
4. **Body**: 
   - Select "form-data"
   - Key: `profilePicture` (change type to "File")
   - Value: Select your image file

#### 2. Get Profile
1. **Method**: GET
2. **URL**: `http://your-server:3000/api/profile`
3. **Headers**: 
   - `Authorization: Bearer <your_jwt_token>`

---

## 🔒 Security Features

- **Authentication Required**: All endpoints require valid JWT token
- **File Type Validation**: Only image files allowed
- **File Size Limit**: Maximum 5MB per image
- **Automatic Cleanup**: Old profile pictures are deleted when new ones are uploaded
- **Image Optimization**: Automatic compression and format conversion

---

## 🛠️ Technical Details

### Image Processing
- **Size**: Resized to 300x300 pixels
- **Crop**: Face-focused cropping for better profile pictures
- **Format**: Converted to WebP for optimal compression
- **Quality**: Auto-optimized for web delivery

### Storage Structure
```
Cloudinary Folder: edugenie/profiles/
File Naming: profile_{userId}_{timestamp}
Example: profile_68822cb412b08b2c587a46f1_1642345678901
```

---

## 🐛 Error Handling

### Common Errors
- **401**: User not authenticated
- **400**: No file provided / Invalid file type / File too large
- **404**: User not found
- **500**: Server/Cloudinary error

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

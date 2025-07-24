import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    instructor: mongoose.Types.ObjectId;
    instructorName: string;
    content: string;
    category: string;
    duration: number; // in hours
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
    thumbnail?: string;
    tags: string[];
    enrolledStudents: mongoose.Types.ObjectId[];
    maxStudents?: number;
    status: 'Draft' | 'Published' | 'Archived';
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Instructor is required']
    },
    instructorName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: [true, 'Course content is required']
    },
    category: {
        type: String,
        required: [true, 'Course category is required'],
        enum: [
            'Programming',
            'Web Development',
            'Mobile Development',
            'Data Science',
            'Machine Learning',
            'Cybersecurity',
            'Cloud Computing',
            'Database',
            'DevOps',
            'UI/UX Design',
            'Business',
            'Marketing',
            'Other'
        ]
    },
    duration: {
        type: Number,
        required: [true, 'Course duration is required'],
        min: [1, 'Duration must be at least 1 hour']
    },
    level: {
        type: String,
        required: [true, 'Course level is required'],
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    price: {
        type: Number,
        required: [true, 'Course price is required'],
        min: [0, 'Price cannot be negative']
    },
    thumbnail: {
        type: String,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    enrolledStudents: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxStudents: {
        type: Number,
        default: null // null means unlimited
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Archived'],
        default: 'Draft'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ title: 'text', description: 'text' });

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function(this: ICourse) {
    return this.enrolledStudents.length;
});

// Virtual for availability
courseSchema.virtual('isAvailable').get(function(this: ICourse) {
    if (this.status !== 'Published') return false;
    if (this.maxStudents && this.enrolledStudents.length >= this.maxStudents) return false;
    return true;
});

export const Course = mongoose.model<ICourse>('Course', courseSchema);

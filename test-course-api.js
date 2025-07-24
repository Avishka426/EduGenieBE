const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test user credentials
const instructorCredentials = {
    email: 'instructor@test.com',
    password: 'password123',
    name: 'Test Instructor',
    role: 'instructor'
};

const studentCredentials = {
    email: 'student@test.com', 
    password: 'password123',
    name: 'Test Student',
    role: 'student'
};

let instructorToken = '';
let studentToken = '';
let courseId = '';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test course creation
async function testCourseEndpoints() {
    console.log('🚀 Starting Course API Tests...\n');

    try {
        // 1. Test public endpoint - Get course categories
        console.log('1️⃣ Testing GET /api/courses/categories (Public)');
        const categoriesResponse = await axios.get(`${BASE_URL}/courses/categories`);
        console.log('✅ Categories:', categoriesResponse.data.categories.length, 'categories found');
        console.log('📋 Sample categories:', categoriesResponse.data.categories.slice(0, 3).map(c => c.name));
        console.log('');

        // 2. Register and login instructor
        console.log('2️⃣ Registering and logging in instructor...');
        try {
            await axios.post(`${BASE_URL}/auth/register`, instructorCredentials);
        } catch (error) {
            // User might already exist
        }
        
        const instructorLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: instructorCredentials.email,
            password: instructorCredentials.password
        });
        instructorToken = instructorLogin.data.token;
        console.log('✅ Instructor logged in successfully');
        console.log('');

        // 3. Register and login student
        console.log('3️⃣ Registering and logging in student...');
        try {
            await axios.post(`${BASE_URL}/auth/register`, studentCredentials);
        } catch (error) {
            // User might already exist
        }
        
        const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: studentCredentials.email,
            password: studentCredentials.password
        });
        studentToken = studentLogin.data.token;
        console.log('✅ Student logged in successfully');
        console.log('');

        // 4. Test course creation (Instructor only)
        console.log('4️⃣ Testing POST /api/courses (Create Course - Instructor)');
        const courseData = {
            title: 'Complete JavaScript Masterclass',
            description: 'Learn JavaScript from beginner to advanced level with hands-on projects',
            content: 'Module 1: JavaScript Basics\nModule 2: DOM Manipulation\nModule 3: Async Programming\nModule 4: Modern ES6+ Features',
            category: 'Programming',
            duration: 40,
            level: 'Intermediate',
            price: 99.99,
            thumbnail: 'https://example.com/js-thumbnail.jpg',
            tags: ['javascript', 'programming', 'web development'],
            maxStudents: 100
        };

        const createCourseResponse = await axios.post(`${BASE_URL}/courses`, courseData, {
            headers: { Authorization: `Bearer ${instructorToken}` }
        });
        courseId = createCourseResponse.data.course.id;
        console.log('✅ Course created successfully:', createCourseResponse.data.course.title);
        console.log('📝 Course ID:', courseId);
        console.log('');

        // 5. Test get instructor courses
        console.log('5️⃣ Testing GET /api/courses/instructor/my-courses');
        const instructorCoursesResponse = await axios.get(`${BASE_URL}/courses/instructor/my-courses`, {
            headers: { Authorization: `Bearer ${instructorToken}` }
        });
        console.log('✅ Instructor courses found:', instructorCoursesResponse.data.courses.length);
        console.log('');

        // 6. Test browse courses (Public)
        console.log('6️⃣ Testing GET /api/courses (Browse Courses - Public)');
        const browseCoursesResponse = await axios.get(`${BASE_URL}/courses?page=1&limit=10&category=Programming`);
        console.log('✅ Public courses found:', browseCoursesResponse.data.courses.length);
        console.log('📊 Pagination:', browseCoursesResponse.data.pagination);
        console.log('');

        // 7. Test get course by ID
        console.log('7️⃣ Testing GET /api/courses/:id (Get Course Details)');
        const courseDetailsResponse = await axios.get(`${BASE_URL}/courses/${courseId}`);
        console.log('✅ Course details retrieved:', courseDetailsResponse.data.course.title);
        console.log('');

        // 8. Test course enrollment (Student)
        console.log('8️⃣ Testing POST /api/courses/:id/enroll (Student Enrollment)');
        const enrollResponse = await axios.post(`${BASE_URL}/courses/${courseId}/enroll`, {}, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('✅ Student enrolled successfully');
        console.log('');

        // 9. Test get enrolled courses (Student)
        console.log('9️⃣ Testing GET /api/courses/student/enrolled');
        const enrolledCoursesResponse = await axios.get(`${BASE_URL}/courses/student/enrolled`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('✅ Enrolled courses found:', enrolledCoursesResponse.data.enrolledCourses.length);
        console.log('');

        // 11. Test get enrolled students for course (Instructor)
        console.log('1️⃣1️⃣ Testing GET /api/courses/:id/students (Get Enrolled Students - Instructor)');
        const enrolledStudentsResponse = await axios.get(`${BASE_URL}/courses/${courseId}/students`, {
            headers: { Authorization: `Bearer ${instructorToken}` }
        });
        console.log('✅ Enrolled students retrieved:', enrolledStudentsResponse.data.enrolledStudents.length, 'students');
        console.log('👥 Course info:', enrolledStudentsResponse.data.course.title);
        console.log('');

        // 12. Test course update (Instructor)
        console.log('1️⃣2️⃣ Testing PUT /api/courses/:id (Update Course - Instructor)');
        const updateData = {
            title: 'Complete JavaScript Masterclass - Updated',
            price: 89.99
        };
        const updateResponse = await axios.put(`${BASE_URL}/courses/${courseId}`, updateData, {
            headers: { Authorization: `Bearer ${instructorToken}` }
        });
        console.log('✅ Course updated successfully:', updateResponse.data.course.title);
        console.log('💰 New price:', updateResponse.data.course.price);
        console.log('');

        // 13. Test advanced filtering
        console.log('1️⃣3️⃣ Testing Advanced Course Filtering');
        const filterResponse = await axios.get(`${BASE_URL}/courses?category=Programming&level=Intermediate&sortBy=price&sortOrder=asc`);
        console.log('✅ Filtered courses found:', filterResponse.data.courses.length);
        console.log('');

        console.log('🎉 ALL COURSE API TESTS COMPLETED SUCCESSFULLY!');
        console.log('');
        console.log('📋 Summary of Available Endpoints:');
        console.log('• GET /api/courses/categories - Get course categories (Public)');
        console.log('• POST /api/courses - Create course (Instructor)');
        console.log('• GET /api/courses/instructor/my-courses - Get instructor courses');
        console.log('• GET /api/courses - Browse courses with filters (Public)');
        console.log('• GET /api/courses/:id - Get course details (Public)');
        console.log('• POST /api/courses/:id/enroll - Enroll in course (Student)');
        console.log('• GET /api/courses/student/enrolled - Get enrolled courses (Student)');
        console.log('• GET /api/courses/:id/students - Get enrolled students (Instructor)');
        console.log('• PUT /api/courses/:id - Update course (Instructor)');
        console.log('• DELETE /api/courses/:id - Delete course (Instructor)');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
    }
}

// Test error cases
async function testErrorCases() {
    console.log('\n🔍 Testing Error Cases...\n');

    try {
        // Test unauthorized course creation
        console.log('Testing unauthorized course creation...');
        try {
            await axios.post(`${BASE_URL}/courses`, { title: 'Test' });
        } catch (error) {
            console.log('✅ Unauthorized request properly rejected:', error.response.status);
        }

        // Test student trying to create course
        console.log('Testing student trying to create course...');
        try {
            await axios.post(`${BASE_URL}/courses`, { title: 'Test' }, {
                headers: { Authorization: `Bearer ${studentToken}` }
            });
        } catch (error) {
            console.log('✅ Student course creation properly rejected:', error.response.status);
        }

        // Test invalid course ID
        console.log('Testing invalid course ID...');
        try {
            await axios.get(`${BASE_URL}/courses/invalid-id`);
        } catch (error) {
            console.log('✅ Invalid course ID properly handled:', error.response.status);
        }

    } catch (error) {
        console.error('Error in error testing:', error.message);
    }
}

// Run tests
testCourseEndpoints().then(() => {
    return testErrorCases();
}).then(() => {
    console.log('\n✅ All tests completed!');
    process.exit(0);
}).catch(error => {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
});

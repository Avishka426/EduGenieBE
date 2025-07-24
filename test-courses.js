// Course Management Test Script
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test data
let instructorToken = '';
let studentToken = '';
let courseId = '';

async function testCourseAPI() {
    console.log('🎓 Testing EduGenie Course Management API...\n');

    try {
        // Step 1: Register Instructor
        console.log('1️⃣ Registering Instructor...');
        const instructorData = {
            name: 'John Instructor',
            email: `instructor${Date.now()}@example.com`,
            password: 'password123',
            role: 'instructor'
        };

        const instructorResponse = await axios.post(`${API_BASE}/auth/register`, instructorData);
        instructorToken = instructorResponse.data.token;
        console.log('✅ Instructor registered:', instructorResponse.data.user.name);

        // Step 2: Register Student
        console.log('\n2️⃣ Registering Student...');
        const studentData = {
            name: 'Jane Student',
            email: `student${Date.now()}@example.com`,
            password: 'password123',
            role: 'student'
        };

        const studentResponse = await axios.post(`${API_BASE}/auth/register`, studentData);
        studentToken = studentResponse.data.token;
        console.log('✅ Student registered:', studentResponse.data.user.name);

        // Step 3: Create Course (as Instructor)
        console.log('\n3️⃣ Creating Course...');
        const courseData = {
            title: 'Full Stack Web Development with MERN',
            description: 'Complete guide to building modern web applications using MongoDB, Express, React, and Node.js',
            content: 'This comprehensive course covers:\n- MongoDB database design\n- Express.js API development\n- React frontend development\n- Node.js backend architecture\n- Authentication and authorization\n- Deployment strategies',
            category: 'Web Development',
            duration: 40,
            level: 'Intermediate',
            price: 99.99,
            tags: ['React', 'Node.js', 'MongoDB', 'Express'],
            maxStudents: 50
        };

        const createResponse = await axios.post(`${API_BASE}/courses`, courseData, {
            headers: { Authorization: `Bearer ${instructorToken}` }
        });
        courseId = createResponse.data.course.id;
        console.log('✅ Course created:', createResponse.data.course.title);
        console.log('📋 Course ID:', courseId);

        // Step 4: Get Instructor's Courses
        console.log('\n4️⃣ Getting Instructor Courses...');
        const instructorCoursesResponse = await axios.get(`${API_BASE}/courses/instructor/my-courses`, {
            headers: { Authorization: `Bearer ${instructorToken}` }
        });
        console.log('✅ Instructor has', instructorCoursesResponse.data.courses.length, 'courses');

        // Step 5: Update Course Status to Published
        console.log('\n5️⃣ Publishing Course...');
        const updateResponse = await axios.put(`${API_BASE}/courses/${courseId}`, 
            { status: 'Published' },
            { headers: { Authorization: `Bearer ${instructorToken}` } }
        );
        console.log('✅ Course published:', updateResponse.data.course.status);

        // Step 6: Get All Courses (Public)
        console.log('\n6️⃣ Getting All Published Courses...');
        const allCoursesResponse = await axios.get(`${API_BASE}/courses?status=Published`);
        console.log('✅ Found', allCoursesResponse.data.courses.length, 'published courses');

        // Step 7: Get Course Details
        console.log('\n7️⃣ Getting Course Details...');
        const courseDetailsResponse = await axios.get(`${API_BASE}/courses/${courseId}`);
        console.log('✅ Course Details:', courseDetailsResponse.data.course.title);
        console.log('📊 Price:', courseDetailsResponse.data.course.price);
        console.log('⏱️ Duration:', courseDetailsResponse.data.course.duration, 'hours');

        // Step 8: Enroll Student in Course
        console.log('\n8️⃣ Enrolling Student...');
        const enrollResponse = await axios.post(`${API_BASE}/courses/${courseId}/enroll`, {}, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('✅ Enrollment successful:', enrollResponse.data.message);

        // Step 9: Get Student's Enrolled Courses
        console.log('\n9️⃣ Getting Student Enrolled Courses...');
        const enrolledCoursesResponse = await axios.get(`${API_BASE}/courses/student/enrolled`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('✅ Student enrolled in', enrolledCoursesResponse.data.enrolledCourses.length, 'courses');

        // Step 10: Test Course Filtering
        console.log('\n🔟 Testing Course Filters...');
        const filteredResponse = await axios.get(`${API_BASE}/courses?category=Web Development&level=Intermediate`);
        console.log('✅ Filtered courses:', filteredResponse.data.courses.length);

        console.log('\n🎉 All Course Management Tests Completed Successfully!');
        console.log('\n📊 Test Summary:');
        console.log('- ✅ Instructor registration and authentication');
        console.log('- ✅ Student registration and authentication');
        console.log('- ✅ Course creation by instructor');
        console.log('- ✅ Course status management');
        console.log('- ✅ Course listing and filtering');
        console.log('- ✅ Student enrollment');
        console.log('- ✅ Enrolled courses tracking');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.response?.status === 500) {
            console.log('💡 This might be due to MongoDB connection issues');
        }
    }
}

// Run the test
testCourseAPI();

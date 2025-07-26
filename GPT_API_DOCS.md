# GPT-3 Course Recommendation System

## 🤖 Overview

This system integrates OpenAI's GPT-3 API to provide intelligent course recommendations based on user prompts. Students can describe their career goals or learning interests, and the AI will recommend relevant courses from the available catalog.

## 🔑 Features

- ✅ **AI-Powered Recommendations**: Uses GPT-3.5-turbo for intelligent course suggestions
- ✅ **Smart Course Matching**: Analyzes available courses and matches them to user goals
- ✅ **API Call Tracking**: Monitors usage to stay within 250 request limit
- ✅ **Fallback System**: Provides keyword-based recommendations when AI is unavailable
- ✅ **Role-Based Access**: Students get recommendations, instructors/admins can view usage stats
- ✅ **Learning Path Guidance**: AI provides suggested course sequences

---

## 🔗 API Endpoints

### 1. Get AI Course Recommendations (Students Only)
```http
POST /api/gpt/recommendations
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "prompt": "I want to be a software engineer, what courses should I follow?"
}
```

**Response:**
```json
{
  "message": "Course recommendations generated successfully",
  "prompt": "I want to be a software engineer, what courses should I follow?",
  "recommendations": [
    {
      "id": "course_id",
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript programming",
      "category": "Programming",
      "level": "Beginner",
      "instructorName": "John Doe",
      "duration": 20,
      "price": 99,
      "recommendationReason": "Recommended by AI based on your goals"
    }
  ],
  "aiResponse": "RECOMMENDED COURSES:\n- JavaScript Fundamentals\n- React Development\n\nLEARNING PATH:\n1. Start with JavaScript Fundamentals...",
  "metadata": {
    "totalAvailableCourses": 15,
    "recommendationsCount": 3,
    "apiCallsUsed": 5,
    "remainingApiCalls": 245
  }
}
```

### 2. Get Popular Courses (Fallback)
```http
GET /api/gpt/popular
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Popular courses retrieved successfully",
  "courses": [
    {
      "id": "course_id",
      "title": "Course Title",
      "description": "Course description",
      "category": "Programming",
      "level": "Beginner",
      "instructorName": "Instructor Name",
      "duration": 10,
      "price": 99,
      "enrollmentCount": 15,
      "popularity": "Popular"
    }
  ],
  "metadata": {
    "totalCourses": 10,
    "sortedBy": "newest"
  }
}
```

### 3. Get API Usage Statistics (Instructors/Admins Only)
```http
GET /api/gpt/usage
Authorization: Bearer <instructor_token>
```

**Response:**
```json
{
  "message": "API usage statistics",
  "usage": {
    "callsUsed": 5,
    "remainingCalls": 245,
    "maxCalls": 250,
    "usagePercentage": 2
  },
  "warning": null
}
```

---

## 🎯 Usage Examples

### Student Prompts Examples:
- "I want to be a software engineer, what courses should I follow?"
- "I'm interested in machine learning and AI, recommend some courses"
- "What courses would help me become a web developer?"
- "I want to learn about cybersecurity, what do you suggest?"
- "Show me courses for mobile app development"
- "I need courses for data science and analytics"
- "Help me learn UI/UX design"

### How It Works:
1. **Student submits prompt** describing their goals
2. **System fetches available courses** from database
3. **GPT-3 analyzes the request** and available courses
4. **AI provides recommendations** with learning path guidance
5. **System parses response** and matches to actual course records
6. **Student receives curated list** with explanations

---

## 🔧 Technical Implementation

### GPT Prompt Engineering:
```
You are an AI course recommendation assistant for EduGenie, an online learning platform.

User Request: "I want to be a software engineer, what courses should I follow?"

Available Courses in our database:
[Course listings with details]

Instructions:
1. Analyze the user's request and career goals
2. From the available courses listed above, recommend the most relevant ones
3. Provide a clear learning path if multiple courses are recommended
4. Explain why each course is relevant to their goals
```

### API Call Management:
- **Maximum Calls**: 250 (as per assessment requirements)
- **Current Usage**: Tracked in real-time
- **Rate Limiting**: Prevents exceeding limits
- **Fallback System**: Keyword matching when API unavailable

### Security:
- **Authentication Required**: All endpoints require valid JWT
- **Role-Based Access**: Students can get recommendations, instructors view stats
- **Input Validation**: Prompts are validated and sanitized

---

## 🧪 Testing

### Run Test Script:
```bash
node test-gpt-api.js
```

### Test Coverage:
- ✅ Student authentication
- ✅ GPT recommendation generation
- ✅ Course matching and parsing
- ✅ API usage tracking
- ✅ Popular courses fallback
- ✅ Role-based access control
- ✅ Error handling

### Postman Testing:

#### Test 1: Get Recommendations
```
POST {{base_url}}/api/gpt/recommendations
Authorization: Bearer {{student_token}}
Content-Type: application/json

{
  "prompt": "I want to be a full-stack developer"
}
```

#### Test 2: Check API Usage
```
GET {{base_url}}/api/gpt/usage
Authorization: Bearer {{instructor_token}}
```

---

## 📊 API Usage Guidelines

### Best Practices:
- **Conservative Usage**: API calls are limited to 250 total
- **Smart Caching**: Similar prompts may reuse previous responses
- **Fallback Ready**: System works even when GPT is unavailable
- **Monitoring**: Usage is tracked and logged
- **Quality Control**: Responses are parsed and validated

### Usage Scenarios:
1. **Peak Usage**: 3-5 calls per student session
2. **Testing**: Limited test calls to preserve quota
3. **Production**: Efficient prompt design to maximize value

---

## 🔄 Error Handling

### Common Errors:
- **401**: User not authenticated
- **403**: Wrong role (non-students trying recommendations)
- **429**: API call limit reached
- **400**: Invalid or empty prompt
- **500**: GPT API error or service unavailable

### Fallback Mechanisms:
1. **Keyword Matching**: When GPT unavailable
2. **Popular Courses**: Generic recommendations
3. **Error Messages**: Clear guidance for users
4. **Graceful Degradation**: System remains functional

---

## 🚀 Deployment Notes

### Environment Variables Required:
```
OPENAI_API_KEY=your-openai-api-key-here
```

### Monitoring:
- **API Usage**: Real-time tracking
- **Request Logging**: All GPT requests logged
- **Error Monitoring**: Failed requests tracked
- **Performance**: Response times monitored

The GPT integration is now fully functional and ready for production use! 🎉

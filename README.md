# 🧠 NexLearn Backend

**Project Name:** NexLearn  
**Live URL:** _[Add Live Link Here]_

---

## 🌟 Overview

This is the backend server for the NexLearn platform, built with **Express.js** and **MongoDB**. It manages all core functionalities such as authentication, study sessions, bookings, notes, materials, reviews, and role-based access for students, tutors, and admins.

---

## 🌟 Overview

The NexLearn backend provides a secure and scalable RESTful API that connects with the frontend application. It handles:

- User registration and authentication (including Google OAuth)
- Study session management
- Role-based dashboards and permissions
- Session bookings and Stripe integration
- Material sharing by tutors
- Student note-taking
- Review and rating system

---

## 🚀 Setup Guide

### 1. Clone the Repository

```bash
git clone <backend-repo-url>
cd nextlearn-server
```
2. Install Dependencies
```bash
 npm install
```

3. Environment Variables
Create a .env file in the root directory with the following values:
```env
MONGO_DB_URL =''
PORT =''
JWT_ACCESS_TOKEN = ''
FIREBASE_PROJECT_ID = ""
FIREBASE_PRIVATE_KEY = " "
FIREBASE_CLIENT_EMAIL = ""
NODE_ENV = ''
STRIPE_SECRET_KEY =''
STRIPE_WEBHOOK_SECRET =''
FRONTEND_URL =''
```



4. Start the Server
```bash
npm run dev
```

## 📦 Mongoose Models

# 🧑 User
```javascript
const UserSchema = new mongoose.Schema({
     avatar : {
          type : String,
          default : 'https://i.ibb.co/hRGTZWdX/download.jpg'
     },
     name :{
          type : String,
          required : [true, 'name is required!'],
          trim : true
     },
     email :{
          type : String,
          required : [true, 'email is required!'],
          unique : true,
          trim : true,
     },
     password :{
          type : String,
          required : function(){
               return !this.google;
          },
          trim : true
     },
     google : {type : Boolean, default : false},
     role: {
    type: String,
    enum: ['student', 'tutor', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true, versionKey : false
});
```

# 🎓 StudySession
```javascript
const sessionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'session title is required'] 
},
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'tutor is required']
  },

  description: { 
    type: String, 
    required: [true, 'session description is required']
},
  image: { 
    type: String, 
    required: [true, 'session image required'],
    trim : true
},
  registrationStart: { 
    type: Date, 
    required: [true, 'registration start date required'] 
},
  registrationEnd: { 
    type: Date, 
    required: [true, 'registration end date required'] 
},
  classStart: { 
    type: Date, 
    required: [true, 'class start date required'] 
},
  classEnd: { 
    type: Date, 
    required: [true,'class end date required'] 
},
  duration : {
    type : String,
    required : [true, 'session duration is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  fee: { 
    type: Number, 
    default: 0 
},
  rejectionReason: { type: String },
  feedback: { type: String }
}, { timestamps: true,versionKey : false });
```

# 📘 Material
```javascript
const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  driveLink: { type: String },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  }
}, { timestamps: true, versionKey : false });
```

# 📝 Note
```javascript
const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  content: { 
    type: String 
},
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true, versionKey : false });
```

# 📅 BookedSession
```javascript
const bookedSessionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session reference is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
```

# ⭐ Review
```javascript
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Comment is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session is required"],
    },
  },
  { timestamps: true, versionKey: false }
);
```

# 🔗 Payment 
```javascript
const paymentSchema = new mongoose.Schema({
  student: {
    type :  mongoose.Schema.Types.ObjectId,
    ref  : 'User',
    required : [true, 'Student id  required']
},
  session: {
    type :  mongoose.Schema.Types.ObjectId,
    ref  : 'Session',
    required : [true, 'Session id  required']
},
  amount: {
    type : Number,
    required : [true, 'Amount is  required']
  },
  status: {
    type :  String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
},
  stripePaymentIntentId: {
    type :  String,
    required : [true, 'stripePaymentIntentId is  required']
}
},{timestamps : true, versionKey : false});
```


## 🔗 API Endpoints

### ▶️ Auth

| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| POST   | /api/v1/user/register   | Register new user            |
| POST   | /api/v1/user/login      | Login with email/password    |
| POST   | /api/v1/user/google/login | Google OAuth login           |
| POST   | /api/v1/user/logout     | Logout (clear cookie)        |

---

### 👤 Users

| Method | Endpoint                             | Description                  |
|--------|--------------------------------------|------------------------------|
| GET    | /api/v1/users/tutors                    | Get list of tutors           |
| GET    | /api/v1/admin/users                     | [Admin] Get all users        |
| PATCH  | /api/v1/admin/users/:id/role            | [Admin] Change user role     |
| GET    | /api/v1/admin/users/search?name=xxx     | [Admin] Search users by name |

---

### 🧑‍🏫 Study Sessions

| Method | Endpoint                 | Description                              |
|--------|--------------------------|------------------------------------------|
| GET    | /api/v1/sessions            | List approved sessions (paginated)       |
| GET    | /api/v1/sessions/:id        | Get session details (with tutor, reviews)|
| GET    | /api/v1/sessions      | [Tutor] Get own sessions                 |
| POST   | /api/v1/sessions            | [Tutor] Create new session               |
| PATCH  | /api/v1/sessions/approve/:id        | [Admin] Approve/update session details   |
| DELETE | /api/v1/sessions/reject/:id        | [Admin/Tutor] Delete session             |

---

### 📚 Materials

| Method | Endpoint                                | Description                  |
|--------|-----------------------------------------|------------------------------|
| GET    | /api/v1/materials/session/:sessionId       | Get materials for a session  |
| GET    | /api/v1/materials/mine                     | [Tutor] Get own materials    |
| POST   | /api/v1/materials                          | [Tutor] Upload material      |
| PATCH  | /api/v1/materials/:id                      | [Tutor] Update material      |
| DELETE | /api/v1/materials/:id                      | [Admin] Delete material      |

---

### 📝 Notes

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | /api/v1/notes           | [Student] Get own notes         |
| POST   | /api/v1/notes           | [Student] Create new note       |
| PATCH  | /api/v1/notes/:id       | [Student] Update if owner       |
| DELETE | /api/v1/notes/:id       | [Student] Delete if owner       |

---

### ✅ Bookings

| Method | Endpoint                           | Description                         |
|--------|------------------------------------|-------------------------------------|
| POST   | /api/v1/bookings                      | [Student] Book a session            |
| GET    | /api/v1/bookings/mine                 | [Student] View own bookings         |
| GET    | /api/v1/bookings/check/:sessionId     | [Student] Check if a session booked |

---

### ⭐ Reviews

| Method | Endpoint                               | Description                    |
|--------|----------------------------------------|--------------------------------|
| POST   | /api/v1/reviews                           | [Student] Add review           |
| GET    | /api/v1/reviews/session/:sessionId        | Public: Get session reviews    |
| GET    | /api/v1/reviews/mine                      | [Student] Get own reviews      |
| DELETE | /api/v1/reviews/:id                       | [Student] Delete own review    |

---


## 🛠️ Error Handling

Custom error messages are returned for validation and business logic issues.

### HTTP Status Codes Used:

- **400** – Bad input
- **401 / 403** – Authentication or authorization errors
- **404** – Resource not found
- **500** – Internal server error


## 📞 Contact
For backend issues or contributions, please reach out to:
**📧 sourob2356@gmail.com**

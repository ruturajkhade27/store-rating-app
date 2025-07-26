## Installation and Setup Instructions

### Backend Setup
1. Create backend directory and initialize:
```bash
mkdir backend && cd backend
npm init -y
npm install express bcryptjs jsonwebtoken zod @prisma/client cors dotenv
npm install -D nodemon prisma
```

2. Setup environment variables in `.env`
3. Initialize Prisma:
```bash
npx prisma init
```

4. Update `schema.prisma` with the provided schema
5. Generate Prisma client and push to database:
```bash
npx prisma generate
npx prisma db push
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Create React app:
```bash
npx create-react-app frontend
cd frontend
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
```

2. Initialize Tailwind:
```bash
npx tailwindcss init -p
```

3. Update `tailwind.config.js` and add Tailwind directives to CSS
4. Start the development server:
```bash
npm start
```

### Database Setup
1. Create MySQL database named `store_rating_db`
2. Update DATABASE_URL in `.env` with your credentials
3. Run Prisma migrations:
```bash
npx prisma db push
```

## Key Features Implemented

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, User, Store Owner)
- Password encryption with bcrypt
- Protected routes

### Form Validations (using Zod)
- Name: 20-60 characters
- Address: Max 400 characters  
- Password: 8-16 characters with uppercase and special character
- Email: Standard email validation

### Admin Features
- Dashboard with statistics
- User management (create, view, filter)
- Store management (create, view, filter)
- Sorting and filtering capabilities

### User Features
- Registration and login
- Store browsing with search
- Rating submission and modification
- Password update

### Store Owner Features  
- Dashboard showing store ratings
- List of users who rated their store
- Average rating display

### Technical Features
- Prisma ORM with MySQL
- RESTful API design
- Responsive UI with Tailwind CSS
- Error handling and validation
- Pagination and sorting
- Search functionality

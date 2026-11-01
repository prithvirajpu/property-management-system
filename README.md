# Real Estate Management System

A full-stack Real Estate Management System designed to manage properties, individual rental units, tenants, and rental agreements through an administrator dashboard.

## 1. Project Overview

The application allows an administrator to manage multiple properties, maintain unit information, register tenants, assign tenants to available units, and track rental agreement details.

The project follows a REST API architecture, with Django REST Framework handling the backend and React.js providing the frontend.

## 2. Technology Stack

### Backend
- Python
- Django
- Django REST Framework
- Django REST Framework Simple JWT
- Django ORM
- PostgreSQL
- django-filter
- Cloudinary

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

### Development and Deployment
- Git
- GitHub
- Postman
- Render (Backend hosting)
- Vercel (Frontend hosting)

## 3. Project Structure

```text
Real-Estate-Management/
│
├── backend/
│   ├── .venv/
│   ├── apps/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
└── README.md
```

## 4. Core Modules

### 4.1 Admin Authentication
- Single administrator authentication.
- Login using email and password.
- JWT access and refresh tokens.
- Protected API endpoints.

### 4.2 Property Management
- Create, view, update, and delete properties.
- Maintain property name, address, and location.
- Manage property descriptions and features.
- Upload property images using Cloudinary.
- View property details and associated units.

### 4.3 Unit Management
- Create and manage units under properties.
- Support 1BHK, 2BHK, 3BHK, and 4BHK unit types.
- Maintain unit number, rent, floor, area, and features.
- Track unit availability.
- Prevent duplicate unit numbers within the same property.

### 4.4 Tenant Management
- Create and maintain tenant profiles.
- Store personal information and contact details.
- Upload tenant documents using Cloudinary.
- View tenant personal and rental information.
- Search and filter tenant records.

### 4.5 Tenancy Management
- Assign tenants to available units.
- Maintain rental agreement start and end dates.
- Store monthly rent and rent due date.
- Maintain tenancy history.
- Prevent overlapping active rental assignments.
- Automatically determine unit occupancy based on active tenancy.

### 4.6 Search and Filtering
- Search properties by name and location.
- Filter units by BHK type.
- Filter units by rent range.
- Filter properties and units by features.
- Filter units by availability.
- Search tenants by personal information.

## 5. Database Design

The application uses PostgreSQL as its relational database.

Planned Django models:

| Model | Responsibility |
|---|---|
| User | Administrator authentication |
| Property | Property information |
| Unit | Individual property units |
| Tenant | Tenant information |
| TenantDocument | Tenant document references |
| Tenancy | Rental assignments and agreements |

### Database Relationships

- One Property can contain multiple Units.
- One Unit can have multiple Tenancy records over time.
- One Tenant can have multiple Tenancy records over time.
- One Tenant can upload multiple documents.
- Each Tenancy connects one Tenant with one Unit.

The Tenancy model maintains rental history and acts as the source of truth for unit occupancy.

## 6. Environment Configuration

Environment variables are stored separately for backend and frontend.

### Backend `.env`

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

DATABASE_URL=postgresql://username:password@localhost:5432/real_estate_db

ALLOWED_HOSTS=localhost,127.0.0.1

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

**Important:** Actual `.env` files must never be committed to GitHub.

## 7. Backend Setup

### Prerequisites

- Python 3.12+
- PostgreSQL 17+
- Git

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Real-Estate-Management
```

### Step 2: Navigate to backend

```bash
cd backend
```

### Step 3: Create virtual environment

```bash
python -m venv .venv
```

Activate on Windows:

```powershell
.venv\Scripts\activate
```

### Step 4: Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Configure environment variables

Create a `.env` file inside the backend directory and configure PostgreSQL credentials and other required environment variables.

### Step 6: Apply migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 7: Run the backend server

```bash
python manage.py runserver
```

Backend development URL:

```text
http://127.0.0.1:8000/
```

API base URL:

```text
http://127.0.0.1:8000/api/
```

## 8. Frontend Setup

### Prerequisites

- Node.js
- npm

### Step 1: Navigate to frontend

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment variables

Create the frontend `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Step 4: Start the frontend

```bash
npm run dev
```

Frontend development URL:

```text
http://localhost:5173/
```

### Step 5: Create production build

```bash
npm run build
```

## 9. API Testing

Postman will be used to test backend endpoints independently before integrating the React frontend.

Testing will cover:

- Authentication and JWT authorization.
- Property CRUD operations.
- Unit CRUD operations.
- Tenant CRUD operations.
- Tenant document uploads.
- Tenant-unit assignment.
- Rental agreement management.
- Search and filtering.
- Input validation and error handling.
- Authorization and business rules.

## 10. Development Workflow

The project follows a backend-first development approach.

1. Complete backend architecture and database design.
2. Implement authentication.
3. Implement property management APIs.
4. Implement unit management APIs.
5. Implement tenant management APIs.
6. Implement tenancy management APIs.
7. Implement search and filtering.
8. Test backend APIs using Postman.
9. Complete backend validation and testing.
10. Develop React frontend.
11. Integrate frontend with backend APIs.
12. Test the complete application.
13. Deploy backend and frontend.

## 11. Git Branching Strategy

The project uses a feature-branch workflow.

| Branch | Purpose |
|---|---|
| main | Stable production-ready code |
| develop | Integration branch |
| feature/project-documentation | Project documentation |
| feature/custom-user | Custom user model |
| feature/authentication | Admin authentication |
| feature/properties | Property management |
| feature/units | Unit management |
| feature/tenants | Tenant management |
| feature/tenancies | Tenancy management |
| feature/search-filtering | Search and filtering |
| feature/backend-testing | Backend testing and fixes |
| feature/frontend | React frontend development |

### Branching Rules

- Do not develop features directly on `main`.
- Do not develop features directly on `develop`.
- Create a separate feature branch for each module.
- Merge completed feature branches into `develop`.
- Merge `develop` into `main` after final testing and release preparation.

## 12. Deployment

### Backend — Render

The Django REST API will be hosted on Render.

Deployment configuration includes:

- Production environment variables.
- PostgreSQL connection.
- Database migrations.
- Gunicorn application server.
- Static file configuration.
- CORS and allowed hosts.
- Cloudinary integration.

### Frontend — Vercel

The React application will be deployed on Vercel.

The production API URL will be configured using:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Media Storage — Cloudinary

Cloudinary will store property images and tenant documents.

Sensitive tenant documents will use private/authenticated access rather than publicly accessible asset URLs.


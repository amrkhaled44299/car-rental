\# 🚗 DriveNow — Car Rental System



A full-stack car rental platform built with React, Node.js, and MySQL.



\---



\## 📋 Prerequisites



Install these programs before anything else:



\### 1. Node.js

\- Download from: https://nodejs.org

\- Choose the \*\*LTS\*\* version (green button)

\- Install with default settings

\- Verify: open CMD and type `node --version` — you should see a version number



\### 2. MySQL

\- Download from: https://dev.mysql.com/downloads/installer/

\- Choose \*\*MySQL Installer for Windows\*\*

\- Select \*\*Developer Default\*\*

\- Set a password during installation — \*\*remember it\*\*, you'll need it later

\- Leave the port as \*\*3306\*\*



\### 3. Git

\- Download from: https://git-scm.com/download/win

\- Install with all default settings



\---



\## 📥 Clone the Project



Open CMD or PowerShell and run:



```bash

git clone https://github.com/amrkhaled44299/car-rental.git

cd car-rental

```



\---



\## 🗄️ Database Setup



Open MySQL Workbench (or any MySQL client) and run:



```sql

CREATE DATABASE car\_rental\_db CHARACTER SET utf8mb4 COLLATE utf8mb4\_unicode\_ci;

```



\---



\## ⚙️ Backend Setup



\### Step 1 — Navigate to the backend folder

```bash

cd car-rental-api

```



\### Step 2 — Create the environment file

On Windows:

```bash

notepad .env

```



Paste the following (replace the password with your MySQL password):

PORT=5000

NODE\_ENV=development

DB\_HOST=localhost

DB\_PORT=3306

DB\_USER=root

DB\_PASSWORD=your\_mysql\_password\_here

DB\_NAME=car\_rental\_db

JWT\_SECRET=abcdefghijklmnopqrstuvwxyz123456

JWT\_EXPIRES\_IN=7d

UPLOAD\_PATH=uploads/

MAX\_FILE\_SIZE=5242880

FRONTEND\_URL=http://localhost:3000



Save with Ctrl+S and close.



\### Step 3 — Install dependencies

```bash

npm install

```



\### Step 4 — Start the server

```bash

npm run dev

```



You should see:

✅ MySQL Connected successfully

✅ Database synced

🚗 Car Rental API running on port 5000



\### Step 5 — Create the Admin account

Open a \*\*new\*\* CMD window (keep the first one running) and run:

```bash

cd car-rental-api

node seeders/createAdmin.js

```



You should see:

✅ Admin created!

Email:    admin@carrental.com

Password: Admin@123456



\---



\## 🎨 Frontend Setup



\### Step 1 — Open a new CMD window and navigate to the frontend

```bash

cd car-rental-frontend

```



\### Step 2 — Create the environment file

```bash

notepad .env

```



Paste:

REACT\_APP\_API\_URL=http://localhost:5000/api

REACT\_APP\_SOCKET\_URL=http://localhost:5000



Save and close.



\### Step 3 — Install dependencies

```bash

npm install

```



\### Step 4 — Start the frontend

```bash

npm start

```



The browser will open automatically at `http://localhost:3000`



\---



\## ✅ Verify Everything Works



| URL | Expected Result |

|-----|----------------|

| http://localhost:5000/api/health | `{"success":true}` |

| http://localhost:3000 | Browse Cars page |

| http://localhost:3000/login | Login page |



\---



\## 👤 Default Login Credentials



| Role | Email | Password |

|------|-------|----------|

| Admin | admin@carrental.com | Admin@123456 |



\---



\## 🔄 How to Use the System



\### 1. Register as a Car Owner

\- Go to `/register`

\- Click \*\*"List My Car"\*\*

\- Fill in your details and register



\### 2. Admin Approves the Car Owner

\- Log in as Admin

\- Go to `/admin/users`

\- Click \*\*Approve\*\*



\### 3. Car Owner Adds a Car

\- Log in as the Owner

\- Go to `/owner/cars/new`

\- Fill in car details and click Submit



\### 4. Admin Approves the Car

\- Log in as Admin

\- Go to `/admin/cars`

\- Click \*\*Approve\*\*



\### 5. Renter Books a Car

\- Register a new account as a Renter

\- Go to `/license` and upload your driver's license

\- Admin verifies the license from `/admin/licenses`

\- Browse cars and request a booking



\---



\## ❗ Common Issues \& Fixes



| Problem | Solution |

|---------|----------|

| `Access denied for user root` | Wrong DB\_PASSWORD in .env |

| `Unknown database car\_rental\_db` | Run the SQL command in MySQL first |

| `Port already in use` | Change PORT=5001 in .env |

| `npm install errors` | Make sure Node.js is version 18+ (`node --version`) |

| `Cannot find module` | Run `npm install` again |

| `react-scripts not recognized` | Run `npm install react-scripts@5.0.1 --legacy-peer-deps` |



\---



\## 📁 Project Structure

car-rental/

├── car-rental-api/           # Backend (Node.js + Express)

│   ├── config/               # Database \& Socket config

│   ├── controllers/          # API business logic

│   ├── middleware/            # Auth \& file upload

│   ├── models/               # Database models

│   ├── routes/               # API routes

│   ├── seeders/              # Admin account seeder

│   └── index.js              # Entry point

│

└── car-rental-frontend/      # Frontend (React)

└── src/

├── pages/            # Application pages

├── components/       # Shared components

├── context/          # Global state (Auth + Socket)

└── services/         # API service layer



\---



\## 🛠️ Tech Stack



\*\*Backend:\*\* Node.js · Express · MySQL · Sequelize ORM · JWT · Socket.io · Multer



\*\*Frontend:\*\* React · React Router · Axios · Socket.io Client · React Hot Toast


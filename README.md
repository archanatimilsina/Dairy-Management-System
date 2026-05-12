# TaskSphere

TaskSphere is a **Task and Employee Management System** designed to efficiently manage employee data, tasks, and projects.  
The system has three panels: **Admin**, **Project Manager**, and **User**, with features like project creation, workspaces, task assignments, and team management.  
It integrates a **Laravel backend** with a **React frontend using Vite**, allowing fast development and modern UI.

---


## **Technologies & Tools Used**

**Backend (Laravel):**  
- PHP 8+  
- Laravel 11  
- MySQL (or other supported databases)  
- Composer (PHP dependency manager)  
- Laravel Sanctum (for API authentication)  

**Frontend (React + Vite):**  
- React 18+  
- Vite (frontend build tool)  
- @vitejs/plugin-react (JSX + Fast Refresh)  

**Other Tools:**  
- Git (version control)  
- Postman (API testing)  

---

## **Features**

- User registration with **email verification and admin approval**  
- Admin panel to manage users, tasks, and projects  
- Project Manager panel for project and team management  
- User panel to view assigned tasks and project workspaces  
- Each project supports multiple **workspaces** (e.g., frontend, backend)  
- Tasks can be assigned to multiple users within workspaces  
- Real-time frontend updates using React + Vite  

---

## **Project Setup**

### **1. Clone the repository**
```
git clone https://github.com/yourusername/TaskSphere.git
```
### **2. Backend (Laravel) Setup**

Install PHP dependencies:
```
composer install
```

Copy .env.example to .env:
```
cp .env.example .env
```

Set database credentials in .env(Load Database first)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tasksphere
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

Generate application key:
```
php artisan key:generate
```

Start Laravel backend server:
```
php artisan serve
```
now, Backend will run at: http://127.0.0.1:8000

### **3. Frontend (React + Vite) Setup**
Install Node dependencies:
```
npm install
```

Build frontend for production:
```
npm run build
```

Run Vite dev server (development mode):
```
npm run dev
```




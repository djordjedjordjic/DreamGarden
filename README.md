# DreamGarden Application

**"Your Imagination – Your Garden"** is a web-based platform for exterior decoration of private and restaurant gardens.
The system allows users to explore, design, and manage garden decoration services in a structured and user-friendly way.

The frontend is developed using **Angular**, the backend is built with **Node.js**, and **MongoDB** is used as the database.

---

## Setup Instructions

### 1. Prepare the Project Structure

1. Open **Visual Studio Code** (or your preferred IDE).
2. Create a **new Angular project**:

```bash
ng new frontend
```

3. Create a **new Node.js project**:

```bash
mkdir backend
cd backend
npm init -y
```

4. Combine the two projects into a single folder:

```
dream-garden-project/
├── frontend/   (Angular project)
└── backend/    (Node.js project)
```

5. Open the **root folder** `dream-garden-project` in Visual Studio Code.

---

### 2. Replace `src` Folders

* Replace the Angular `src` folder with the `src_frontend` folder from the repository.
* Replace the Node.js `src` folder with the `src_backend` folder from the repository.

---

### 3. Install Dependencies

**Frontend (Angular):**

```bash
cd frontend
npm install @agm/core
npm install @angular/google-maps@16.0.0
npm install ngx-swiper-wrapper
npm install chart.js
```

**Backend (Node.js):**

```bash
cd backend
npm install multer
```

> **Optional Cleanup**
> If you encounter dependency issues, you may need to remove `node_modules` and `package-lock.json` and reinstall packages:

```powershell
rmdir /s /q node_modules
del package-lock.json
npm install
```

This ensures all packages are freshly installed, avoiding conflicts from previous installations or corrupted dependencies.

---

### 4. Set up MongoDB

1. Start MongoDB:

```powershell
net start MongoDB
```

2. Open **MongoDB Compass**.
3. Create a new database named `Masta-Basta`.
4. Import the data from the `MongoDB` folder provided in the repository.

---

### 5. Run the Application

**Start the backend server:**

```bash
cd backend
npm run serve
```

**Start the frontend server:**

```bash
cd frontend
ng serve
```

* The frontend application will run at: [http://localhost:4200](http://localhost:4200)

---

### 6. Notes

* Make sure you are in the **correct folder** when running commands (`frontend` for Angular, `backend` for Node.js).
* Replace the placeholder `GOOGLE_API_KEY` in the code with your actual Google Maps API key to enable map functionality.

# Academic Progression Monitoring

An academic dashboard and management system that enables university administrators and students to track academic progress, analyze module performance, send communications, and upload student data in bulk. Built with Node.js, Express.js, EJS, and MySQL.

## Features

- Admin and student role-based dashboards.
- View and manage degree programs, modules, and student data.
- Upload and process student records from CSV files.
- Track academic progression and eligibility using built in progression rules.
- Messaging and notification system.
- Data visualization for academic reports, module and degree pass fail stats and module and degree progression stats.

## Screenshots

Below are a selection of some of the main pages of the web app, illustrating some of the main features.

### Login Page
![Screenshot 2025-05-13 at 12 58 15](https://github.com/user-attachments/assets/050a020f-3dea-42a5-a1eb-b546f910a3b6)

### Contact Page
![Screenshot 2025-05-13 at 12 58 38](https://github.com/user-attachments/assets/80e2b129-a82b-4a3e-9da5-aa1150baef35)

### Admin Dashboard
![Screenshot 2025-05-13 at 12 59 04](https://github.com/user-attachments/assets/2bed53b4-ea01-4d72-91b3-46e0731ea097)

### Messaging Hub
![Screenshot 2025-05-13 at 12 59 24](https://github.com/user-attachments/assets/302ad22e-746c-4e87-90cd-883fd2c2cd0c)

### Mass Record Upload Page
![Screenshot 2025-05-13 at 12 59 36](https://github.com/user-attachments/assets/16cfd64c-df5e-4f7e-88e7-1b2946c62065)

### All Students Page
![Screenshot 2025-05-13 at 13 03 35](https://github.com/user-attachments/assets/26f559a5-0a8c-4a48-be27-851ffd54e96c)

### Student Details Page
![Screenshot 2025-05-13 at 13 04 03](https://github.com/user-attachments/assets/1dbc1c3b-1fb9-458b-9b74-2920df047f91)
![Screenshot 2025-05-13 at 13 04 16](https://github.com/user-attachments/assets/d441a967-baba-4cc4-bc1c-8b923a869c91)
![Screenshot 2025-05-13 at 13 04 24](https://github.com/user-attachments/assets/86128640-5d4d-49ed-a8fd-a9ef7827a12d)

### Student Dashboard
![Screenshot 2025-05-13 at 13 04 45](https://github.com/user-attachments/assets/80e183aa-cadf-4ebb-a4c9-09062f24df39)


## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS templates, HTML, CSS, JavaScript
- **Database:** MySQL
- **Other:** CSV parsing, bcrypt password handling, Chart.js

## Installation

### Requirements

- Node.js (v18+)
- MySQL (v8+)
- Git

### Steps

1. Clone the repository:
   ```bash
   git clone https://gitlab.eeecs.qub.ac.uk/40430805/academic-progression-monitoring.git
   cd academic-progression-monitoring

2. Install dependencies:
    npm install

3. Database set up:
    Create a new MySQL database called 40430805.
    Import the provided base SQL file available at /db/40430805.sql
    Note that the provided db has modules and programs pre populated this is important for progression logic to operate correctly. 
    If you want to to use a clean db you will then have to add degree programs and associated module with their details before processing reports. 
    An admin account will also have to be made in the db as there is no way to this out side the db.
    Use this query to add admin account :
    INSERT INTO `user`( `email`, `password`, `salt`, `role`) VALUES ('Admin01@university.edu','$2b$12$znzj6Fw8QJg8LOCl/1Ceg.9OtuZv2xtXGTXACX//i4ewhdvyQsTEm','$2b$12$znzj6Fw8QJg8LOCl/1Ceg.','admin')

4. Run the app:
    npm run start

5. Open Web App 
    Open desired browser at http://localhost:3500

### Logging in

    Admin log in
        Email: Admin01@university.edu
        Password: Admin2025

    Student log in 
        Email: student first name first letter + . + lastname + @university.edu (e.g. EMAIL = r.adams@university.edu)
        Password  student last name + sID (e.g. Adams22-IFSY-0933003)

        student emails and passwords are generated automatically when a new student is made through students page or mass uploaded and can be changed only by admins.

### Usage
	
    Admins can log in to:
        - Add/update/delete programs, modules, and students.
        - Upload CSV files for bulk student data.
        - Send messages/notifications.
        - Generate academic progression reports.
	Students can log in to:
        - View user details.
        - Edit secondary user email.
        - View their modules, grades, and progression status.
        - Receive messages and notifications.

### Authors
	- John Livingstone 

### License

This project is for academic use. You may fork and adapt it for educational purposes. 

# FileDrive


1. Project Initialization
Initialize a new Node.js project with npm init.

Install dependencies: Express, Prisma, Passport.js, bcryptjs, multer, session store, and EJS for templating.

Set up folder structure (e.g., /routes, /controllers, /views, /middlewares, /uploads).

2. Set Up Prisma and Database
Configure the Prisma schema:

Define models for User, Session, Folder, File, and later SharedLink.

Connect to a PostgreSQL database.

Run Prisma migration or db push to apply schema.

3. Express Application Setup
Set up Express with middlewares (body parsing, static files, view engine).

Configure session management using express-session and Prisma session store.

Initialize Passport.js and connect it to the session.

4. Implement User Authentication
Configure Passport LocalStrategy for login.

Set up routes for login, signup, and logout.

Protect routes to ensure only authenticated users can access them.

5. Implement File Upload Functionality
Set up Multer middleware to handle file uploads.

Store uploaded files temporarily in the filesystem.

Create a form for authenticated users to upload files.

6. Implement Folder CRUD Operations
Create routes and controllers to allow users to:

Create new folders

View their folders and contents

Rename or delete folders

Associate uploaded files with specific folders.

7. File Details and Download Route
Create a route to view file metadata (name, size, upload time).

Add functionality to download files from the server.

8. Integrate Cloud Storage
Set up integration with Cloudinary or Supabase Storage.

Update the file upload logic to upload to cloud storage.

Save the cloud file URL in the database instead of a local file path.

9. Share Folder Feature (Extra Credit)
Allow users to share folders by generating a share link with an expiration duration.

Store the share link and expiration in the database.

Create a public route to view shared folder contents, accessible without authentication.

Add logic to validate that the link has not expired.


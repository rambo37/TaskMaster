# TaskMaster

TaskMaster is a web application which provides convenient and effective task management for users. Built using the MERN stack (MongoDB, Express, React, Node).

## Current functionalities
- User authentication
- Task CRUD operations
- Tasks currently store:
	- Title
	- Description (optional)
	- Due date
	- Priority (optional)
	- Tags (optional)
	- Status
- Task related settings (e.g., date and time formats)
- Filter and sort tasks according to various criteria, including text match (i.e., search in task titles/descriptions)
- Dashboard page showing charts that break down tasks by status, priority, and progress
- Sections on the dashboard for expired, upcoming, and urgent tasks


## Installation
1. Clone the repository
	`git clone <repository-url>`
	
2. Install MongoDB on your local machine and start the MongoDB database server by running the `mongod` command in your terminal

3. Create a `.env` file in the root directory and add the following environment variables:
	`MONGODB_URI=your-mongodb-uri`
	`PORT=5000`
	`JWT_SECRET=your-jwt-secret`
	`REACT_APP_BACKEND_URL="http://localhost:5000"`
	`REACT_APP_FRONTEND_URL="http://localhost:3000"`
	`MAIL_SERVICE=your-mail-service`
	`MAIL_USER=your-mail-user`
	`MAIL_PASSWORD=your-mail-password`

	> **Note:** If using a gmail account to send emails, you will need to ensure the Google account has 2-Step-Verification enabled and then set up an App password. The App password is the password you should specify for the `MAIL_PASSWORD` variable, not your Google account password.

4. Install dependencies for both client and server:
	`npm run client-install`
	`npm run server-install`

5. Start the client and server (in separate terminals):
	`npm run client-start`
	`npm run server-start`

6. Access the application at [http://localhost:3000](http://localhost:3000/) in your browser.


## Future enhancements
- Add notifications for upcoming tasks
- Implement a calendar view for tasks
- Add ability to archive tasks
- Implement a modifiable checklist for the task descriptions (bullet points but with checkboxes for the bullets \- clicking a checkbox will add/remove a strike through the text).
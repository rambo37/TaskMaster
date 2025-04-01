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

### Running Locally

1. Clone the repository: `git clone <repository-url>`
	
2. Install MongoDB on your local machine and start the MongoDB database server by running the `mongod` command in your terminal

3. Create a `.env` file in the root directory and add the following environment variables:

	```
	MONGODB_URI=mongodb://127.0.0.1/your-database-name
	REACT_APP_BACKEND_URL=http://localhost:5000
	REACT_APP_FRONTEND_URL=http://localhost:3000
	PORT=5000
	JWT_SECRET=your-jwt-secret
	MAIL_SERVICE=your-mail-service
	MAIL_USER=your-mail-user
	MAIL_PASSWORD=your-mail-password
	```

	> **Note:** If using a gmail account to send emails, you will need to ensure the Google account has 2-Step-Verification enabled and then set up an App password. The App password is the password you should specify for the `MAIL_PASSWORD` variable, not your Google account password.

4. Create a `.env` file in the client directory with:

	```
	REACT_APP_BACKEND_URL="http://localhost:5000"
	```

5. Install dependencies for both client and server:
	`npm run client-install`
	`npm run server-install`

6. Start the client and server (in separate terminals):
	`npm run client-start`
	`npm run server-start`

7. Access the application at [http://localhost:3000](http://localhost:3000/) in your browser.

### Running with Docker

1. Clone the repository: `git clone <repository-url>`

2. Create a `.env` file in the root directory with the following variables:

	```
	MONGODB_URI_DOCKER=mongodb://mongo:27017/your-database-name
	REACT_APP_FRONTEND_URL_DOCKER=http://client:3000
	REACT_APP_BACKEND_URL_DOCKER=http://server:5000
	PORT=5000
	JWT_SECRET=your-jwt-secret
	MAIL_SERVICE=your-mail-service
	MAIL_USER=your-mail-user
	MAIL_PASSWORD=your-mail-password
	```

	> **Note:** If using a gmail account to send emails, you will need to ensure the Google account has 2-Step-Verification enabled and then set up an App password. The App password is the password you should specify for the `MAIL_PASSWORD` variable, not your Google account password.

3. For development with hot-reloading: `docker compose watch`

   For production or without hot-reloading: `docker compose up --build`

4. Access the application at [http://localhost:3000](http://localhost:3000/) in your browser.

> **Note:** The `docker compose watch` command enables hot-reloading for both client and server. It will:
> - Sync changes from `./client/src` and `./client/public` to the client container
> - Sync changes from `./server/server.js` and `./server/models` to the server container
> - Sync changes from `./shared-utils` to both containers
> - Rebuild containers when `package.json` files change
>
> If you don't need hot-reloading, use `docker compose up --build` instead.

> **Note:** To stop the Docker containers, press Ctrl+C in the terminal where they're running, or run `docker compose down` in a separate terminal. The MongoDB data is stored in a Docker volume and will persist between container restarts.


## Future enhancements
- Add notifications for upcoming tasks
- Implement a calendar view for tasks
- Add ability to archive tasks
- Add pagination for View all tasks page
- Implement a modifiable checklist for the task descriptions (bullet points but with checkboxes for the bullets \- clicking a checkbox will add/remove a strike through the text).
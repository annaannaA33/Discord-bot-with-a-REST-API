Discord Bot with REST API

This project is a Discord bot with a REST API, capable of sending congratulatory messages with GIFs and managing related data.

Setup Instructions

1. Install Dependencies
   After cloning the repository, navigate to the project folder and install the necessary dependencies:
   npm install

2. Configure Environment Variables
   Create a .env file from the .env.example(Copy .env.example to .env)

Fill in the required values:

Giphy API Key:
Register and get your API key from [Giphy Developers](https://developers.giphy.com/).

Database URL:
Set the path for your SQLite database, for example:
DATABASE_URL=./database.sqlite

Discord Bot Token:
Create a bot and get the token from [Discord Developer Portal](https://discord.com/developers/applications).

Discord Channel ID:
To get the channel ID, enable "Developer Mode" in User Settings > Advanced > Developer Mode. Then right-click on the desired channel and select "Copy ID".

3. Generate an invite link for your bot and invite it to your server:
   Select your bot from the list of applications at [Discord Developer Portal](https://discord.com/developers/applications).
   Go to the OAuth2 section, then to the URL Generator.
   Under Scopes, select bot.
   Under Bot Permissions, select the permissions your bot will need (e.g., Send Messages).
   Copy the generated URL and paste it in your browser to invite the bot to your server.
4. Run Migrations
   To create the required tables in the database, run:
   tsx src/migrations/runMigrations.ts

5. To populate the database with initial data, run:
   tsx populateDatabase.ts

5.1. Check the Database
To verify the data is in the database, use the following command with SQLite3:

sqlite3 ./database.sqlite
Then, run:

SELECT \* FROM messages;

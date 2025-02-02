# Discord Bot with REST API

This project is a Discord bot with a REST API, capable of sending congratulatory messages with GIFs and managing related data.

## Setup Instructions


###  1. Install Dependencies
   After cloning the repository, navigate to the project folder and install the necessary dependencies:
   npm install

###  2. Configure Environment Variables
   Create a .env file from the .env.example(Copy .env.example to .env)

Fill in the required values:

#### FALLBACK_GIF_URL: fallback GIF
(Since this project is educational, I’ve included this default fallback GIF URL for simplicity and ease of use.)

#### Giphy API Key:
Register and get your API key from [Giphy Developers](https://developers.giphy.com/).
Instructions: https://developers.giphy.com/docs/.

#### Database URL:
Set the path for your SQLite database, for example:
DATABASE_URL=./database.sqlite

#### Discord Bot Token:
Create a bot and get the token from [Discord Developer Portal](https://discord.com/developers/applications).
instructions: https://discord.com/developers/docs/intro.

#### Discord Channel ID:
To get the channel ID, enable "Developer Mode" in User Settings > Advanced > Developer Mode. Then right-click on the desired channel and select "Copy ID".

### 3. Generate an invite link for your bot and invite it to your server:
   Select your bot from the list of applications at [Discord Developer Portal](https://discord.com/developers/applications).
   Go to the OAuth2 section, then to the URL Generator.
   Under Scopes, select bot.
   Under Bot Permissions, select the permissions your bot will need (e.g., Send Messages).
   Copy the generated URL and paste it in your browser to invite the bot to your server.
### 4. Run Migrations
   To create the required tables in the database, run:
   tsx src/migrations/runMigrations.ts

### 5. To populate the database with initial data, run:

```
   tsx populateDatabase.ts
   tx-node populateDatabase.ts
```


### 6. Run the following command to check the records in the database:

```
   sqlite3 ./database.sqlite
```
```
   SELECT \* FROM messages;
```

### 7. Test the application:

Once everything is set up, the bot will be ready to send congratulatory messages. Use a tool like Postman to send a POST request to:

```
   POST http://localhost:3000/messages
```
With the following JSON data:

```
   {
   "username": "Anya",
   "sprintCode": "1"
   }
```

A congratulatory message along with a GIF should appear in your Discord channel.


### 8. Tests:

I decided to place the tests next to the files
to run use this:

```
   npm run test
```
```
   npm run test:coverage
```

>>sqlite> .schema
>>CREATE TABLE IF NOT EXISTS "messages" ("id" integer primary key autoincrement, >>"username" varchar, "sprintCode" varchar, "message" varchar, "gifUrl" varchar, >>"createdAt" datetime default CURRENT_TIMESTAMP);
>>CREATE TABLE IF NOT EXISTS "templates" ("id" integer primary key autoincrement, >>"text" varchar);
>>CREATE TABLE IF NOT EXISTS "sprints" ("code" varchar unique primary key, "title" >>varchar);


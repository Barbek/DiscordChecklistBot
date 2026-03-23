# ChecklistBot

## About
Discord bot for creating checklists

Join the Discord server for any help and to keep up with updates: https://discord.gg/USxvyB9QTz
  
 
  
  
## Requirements
1: Node 16+ installed on server

2: Discord bot with:
  - Server Members Intent
  - Message Content Intent
  - Read/write perms in channels
  
 
  
  
## Install
```
git clone https://github.com/RagingRectangle/ChecklistBot.git
cd ChecklistBot
cp -r config.example config
npm install
```  
 
  
  

## Config Setup
- **token:** Discord bot token.
- **slashGuildIDs:** List of guild IDs where commands should be registered.
- **checklistCommand:** Name of slash command.

### Secure Runtime Configuration

The bot no longer fetches secrets from GitHub Pages. GitHub Pages is public static hosting and is only used for project documentation.

Runtime config is resolved in this order:
1. `config.example/config.json` as defaults
2. `config/config.json` if present
3. Environment variable overrides

### Local Development
1. Copy the template: `cp -r config.example config`
2. Edit `config/config.json`
3. Run the bot: `npm start`

### Production / Server Runtime
Set these environment variables on the machine that actually runs the bot:
- `DISCORD_TOKEN` (or fallbacks: `CHECKLIST_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `TOKEN`)
- `DISCORD_SERVER_ID` (or fallbacks: `CHECKLIST_SLASH_GUILD_IDS`, `SLASH_GUILD_IDS`) - JSON array `["123","456"]` or comma-separated `123,456`
- `CHECKLIST_COMMAND`

Example:

```bash
DISCORD_TOKEN=your-token
DISCORD_SERVER_ID=123456789012345678
CHECKLIST_COMMAND=checklist
npm start
```

### GitHub Pages Deployment
`npm run deploy` publishes the project README to GitHub Pages. It does not publish bot secrets or runtime config.

 
  

  
## Premade Checklist Setup
- Config file: */config/checklists.json*
- Fill out the name for the checklist and an array of the items to be included.
 
  
  

## Usage
- Start the bot in a console with `node checklist.js`
- Can (*should*) use PM2 to run instead with `pm2 start checklist.js`
- Check whether the bot is alive with `/<checklistCommand> status`
- Begin by typing `/<checklistCommand>` and select `custom` or `premade`.
- Fill out or confirm that everything looks good on the popop response.
- Use the dropdown list to mark items as completed (or unmark them).
- The `Finish` button will complete the checklist.
- The `Edit` button allows you to rename the checklist and add/remove any items.
- The `Delete` button will delete the entire message.




## Screenshots
###### Create Custom Checklists:
![custom](https://i.imgur.com/e9uK4zj.png)
###### Mark Off Completed Items:
![Scripts](https://i.imgur.com/YrMzjEn.png)
###### Edit Checklists:
![Links](https://i.imgur.com/H6GbaLS.png)
###### Sample:
![Links](https://media.giphy.com/media/SM06qTChdII9IU7VT4/giphy.gif)

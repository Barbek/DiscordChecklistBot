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

### Configuration with Secrets Registry

The bot uses a **secrets registry** approach to separate build time from secret injection:

#### Local Development
1. Copy the template: `cp -r config.example config`
2. Edit `config/config.json` with your Discord token and server IDs
3. Run the bot: `npm start`

#### GitHub Actions Deployment
For secure deployment to GitHub Pages:

1. Set GitHub repository secrets and variables:
   - **Secret** `DISCORD_TOKEN` - Your Discord bot token
   - **Variable** `DISCORD_SERVER_ID` - Guild IDs (JSON array or comma-separated)
   - **Variable** `CHECKLIST_COMMAND` - Slash command name

2. Create a GitHub Actions workflow that:
   - Has access to secrets/variables
   - Runs `npm run generate-config` to inject secrets into `config/config.json`
   - Runs `npm run deploy` to publish to GitHub Pages

   **Example workflow (`.github/workflows/deploy.yml`):**
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [deploy]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         
         - name: Install dependencies
           run: npm install
         
         - name: Generate config with secrets
           env:
             DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
             DISCORD_SERVER_ID: ${{ vars.DISCORD_SERVER_ID }}
             CHECKLIST_COMMAND: ${{ vars.CHECKLIST_COMMAND }}
           run: npm run generate-config
         
         - name: Deploy to GitHub Pages
           run: npm run deploy
   ```

3. The generated `config/config.json` will be published as part of the GitHub Pages site.

#### Runtime Config Loading
The bot loads config in this order:
1. **Local file** - `config/config.json` (if exists)
2. **GitHub Pages** - Fetches from deployed secrets registry (fallback)
3. **Template** - Uses `config.example/config.json` if neither above exists

This allows the bot to:
- ✅ Run locally without CI/CD secrets
- ✅ Fetch secrets from GitHub Pages when deployed
- ✅ Use template values as defaults

### Environment Variables (Optional for Local Development)
- `DISCORD_TOKEN` (or fallbacks: `CHECKLIST_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `TOKEN`)
- `DISCORD_SERVER_ID` (or fallbacks: `CHECKLIST_SLASH_GUILD_IDS`, `SLASH_GUILD_IDS`) - JSON array `["123","456"]` or comma-separated `123,456`
- `CHECKLIST_COMMAND`

 
  

  
## Premade Checklist Setup
- Config file: */config/checklists.json*
- Fill out the name for the checklist and an array of the items to be included.
 
  
  

## Usage
- Start the bot in a console with `node checklist.js`
- Can (*should*) use PM2 to run instead with `pm2 start checklist.js`
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

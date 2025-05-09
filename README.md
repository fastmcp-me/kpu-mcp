# KeywordsPeopleUse MCP Server

A Model Context Protocol (MCP) server implementation that integrates with [KeywordsPeopleUse](https://keywordspeopleuse.com) for keyword research features.

## Features

- Get People Also Ask questions
- Get Google Autocomplete suggestions
- Get Reddit and Quora questions
- Get Semantic Keywords

## Installation

### Clone from Github

```bash
git clone https://github.com/data-skunks/kpu-mcp.git
```

### Get the API Key

MCP Server integration is available on KeywordsPeopleUse Standard plan and above. Go to [KeywordsPeopleUse Settings](https://keywordspeopleuse.com/settings) to get the API key. Press `Show key`, copy the key, and paste it inside the `.env` file, so the file looks like this:

`KPU_API_KEY=sk_01234567890123456789012345678901`

### Install dependencies

```bash
npm install
```

### Running on Cursor

To configure Firecrawl MCP in Cursor **v0.45.6**

1. Open Cursor Settings
2. Go to Features > MCP Servers
3. Click "+ Add New MCP Server"
4. Enter the following:
   - Name: "keywordspeopleuse" (or your preferred name)
   - Type: "command"
   - Command: `node /ABSOLUTE/PATH/TO/PARENT/FOLDER/kpu-mcp/index.js`

To configure Firecrawl MCP in Cursor **v0.48.6**

1. Open Cursor Settings
2. Go to Features > MCP Servers
3. Click "+ Add new global MCP server"
4. Enter the following code:

On MacOS/Linux

```json
{
  "mcpServers": {
    "keywordspeopleuse": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/PARENT/FOLDER/kpu-mcp/index.js"]
    }
  }
}
```

On Windows

```json
{
  "mcpServers": {
    "keywordspeopleuse": {
      "command": "node",
      "args": ["C:/PATH/TO/PARENT/FOLDER/kpu-mcp/index.js"]
    }
  }
}
```

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

#### On MacOS/Linux

```json
{
  "mcpServers": {
    "keywordspeopleuse": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/PARENT/FOLDER/kpu-mcp/index.js"]
    }
  }
}
```

#### On Windows

```json
{
  "mcpServers": {
    "keywordspeopleuse": {
      "command": "node",
      "args": ["C:/PATH/TO/PARENT/FOLDER/kpu-mcp/index.js"]
    }
  }
}
```

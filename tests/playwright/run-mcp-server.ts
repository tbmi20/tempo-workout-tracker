import { startMCPServer } from './mcp-server';

async function run() {
  console.log('Starting Tempo Workout Tracker MCP Server...');
  
  try {
    const { url, page } = await startMCPServer();
    console.log(`
====================================================
🚀 Tempo Workout Tracker MCP Server is running!
----------------------------------------------------
MCP WebSocket URL: ${url}
Browser page opened to: ${page.url()}

The server allows you to programmatically control the 
Tempo Workout Tracker app using WebSocket messages.

Available commands:
- navigate: Go to a specific page
- click: Click on an element
- fill: Fill in a form field
- screenshot: Take a screenshot
- getWorkouts: Retrieve workout data
- getMeals: Retrieve meal data
- addWorkout: Add a new workout
- addMeal: Add a new meal
- getElementContent: Get text from an element
- getTitle: Get page title

Press Ctrl+C to stop the server.
====================================================
`);
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

run();
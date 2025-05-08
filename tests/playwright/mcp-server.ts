import { chromium, devices } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

/**
 * Model Context Protocol (MCP) Server for Tempo Workout Tracker
 * 
 * This server allows programmatic control of the app through a WebSocket interface.
 * It enables automated testing and demonstration of the app's features.
 */

// Required interfaces
interface MCPRequest {
  id: string;
  method: string;
  params: any;
}

interface MCPResponse {
  id: string;
  result?: any;
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * Starts the MCP server on the specified port
 */
export async function startMCPServer(port: number = 3300): Promise<{
  url: string;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  stop: () => Promise<void>;
}> {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: './tests/videos/' },
  });
  const page = await context.newPage();
  
  // Create HTTP server
  const server = createServer();
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to MCP server');
    
    ws.on('message', async (data) => {
      let request: MCPRequest;
      try {
        request = JSON.parse(data.toString());
      } catch (e) {
        ws.send(JSON.stringify({
          id: 'error',
          error: { message: 'Invalid JSON' }
        }));
        return;
      }
      
      console.log(`MCP request received: ${request.method}`, request.params);
      
      try {
        const response = await handleRequest(request, page);
        ws.send(JSON.stringify(response));
      } catch (e) {
        const error = e as Error;
        ws.send(JSON.stringify({
          id: request.id,
          error: { message: error.message, stack: error.stack }
        }));
      }
    });
  });
  
  // Start server
  await new Promise<void>((resolve) => server.listen(port, resolve));
  console.log(`MCP server started on ws://localhost:${port}`);
  
  // Navigate to the app
  await page.goto('http://localhost:5173/');
  
  return {
    url: `ws://localhost:${port}`,
    browser,
    context,
    page,
    stop: async () => {
      server.close();
      await context.close();
      await browser.close();
    }
  };
}

/**
 * Handle MCP requests
 */
async function handleRequest(request: MCPRequest, page: Page): Promise<MCPResponse> {
  const { id, method, params } = request;
  
  switch (method) {
    case 'navigate':
      await page.goto(params.url);
      return { id, result: { url: page.url() } };
      
    case 'click':
      await page.click(params.selector);
      return { id, result: { success: true } };
      
    case 'fill':
      await page.fill(params.selector, params.value);
      return { id, result: { success: true } };
    
    case 'screenshot':
      const buffer = await page.screenshot({ path: params.path || undefined });
      return { id, result: { 
        buffer: buffer.toString('base64'),
        mimeType: 'image/png'
      }};
    
    case 'getWorkouts':
      const workouts = await page.evaluate(() => {
        // This accesses data from the application if available
        // @ts-ignore - Accessing potential global data
        return window.tempoApp?.workouts || [];
      });
      return { id, result: { workouts } };
    
    case 'getMeals':
      const meals = await page.evaluate(() => {
        // @ts-ignore - Accessing potential global data
        return window.tempoApp?.meals || [];
      });
      return { id, result: { meals } };
      
    case 'getElementContent':
      const content = await page.textContent(params.selector);
      return { id, result: { content } };
      
    case 'getTitle':
      return { id, result: { title: await page.title() } };

    case 'addWorkout':
      // Navigate to workout form
      await page.click('[data-testid="add-workout-button"]');
      // Fill workout details
      if (params.workoutName) await page.fill('[data-testid="workout-name-input"]', params.workoutName);
      if (params.duration) await page.fill('[data-testid="workout-duration-input"]', params.duration);
      // Submit form
      await page.click('[data-testid="save-workout-button"]');
      return { id, result: { success: true } };

    case 'addMeal':
      // Navigate to meal form
      await page.click('[data-testid="add-meal-button"]');
      // Fill meal details
      if (params.mealName) await page.fill('[data-testid="meal-name-input"]', params.mealName);
      if (params.calories) await page.fill('[data-testid="meal-calories-input"]', params.calories);
      // Submit form
      await page.click('[data-testid="save-meal-button"]');
      return { id, result: { success: true } };
      
    default:
      return { id, error: { message: `Method not implemented: ${method}` } };
  }
}

// ES Modules compatible way to check if file is run directly
if (import.meta.url.endsWith(process.argv[1])) {
  startMCPServer().catch(console.error);
}
Difference between 
playwright package - provide support for only the browser automation.Provides only the core APIs for launching and interacting with browsers.
Automation Focus: Best suited for non-testing tasks like web scraping, PDF generation, or building custom automation tools.
No Runner: It does not include a test runner, so you would have to manually integrate it with other frameworks like Jest, Mocha, or Vitest if you want to run tests.
@playwright/test package- support browser automation, has built in test runner,
Smart Assertions: Provides the expect function with web-first assertions that automatically wait for conditions to be met.
Orchestration: Manages configuration files, reporters (like HTML reports), and the Trace Viewer for debugging
Fixtures: Includes powerful Test Fixtures like page and context that are automatically set up and torn down.

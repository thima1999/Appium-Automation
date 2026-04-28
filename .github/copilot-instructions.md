# Appium Automation Instructions

## Project Context
- **Framework:** WebDriverIO (WDIO)
- **Tooling:** Appium, Appium MCP Server
- **Language:** JavaScript (CommonJS/ES Modules)
- **Platform:** Android and iOS
- **Design Pattern:** Page Object Model (POM)

## Coding Standards
- **POM Structure:** - Store Page Objects in `./test/pageobjects/`.
  - Store Test Specs in `./test/specs/`.
  - Use `async/await` for all interactions.
- **Naming Conventions:** - Page files should end in `.page.js`.
  - Spec files should end in `.spec.js`.
- **Locators:** - Prefer using the **Appium MCP server** to find elements via natural language descriptions first.
  - When writing code, use `get` properties for selectors (e.g., `get loginButton() { return $('~login'); }`).

## AI Agent Rules (MCP Integration)
- When I give a plain English command, use the **Appium MCP tool** to execute the step on the device before writing the code.
- After successfully executing the flow via MCP, analyze the session to generate the Page Objects and Spec files.
- Ensure the generated code includes assertions (e.g., `await expect(element).toBeDisplayed()`).

## Example Structure
If I ask to automate a login, generate code like this:
- **Page Object:** `LoginPage.login(username, password)`
- **Spec:** `it('should login with valid credentials', async () => { ... })`
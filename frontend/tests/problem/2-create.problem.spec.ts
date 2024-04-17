import { Page, expect, test } from "@playwright/test";
import { logInAsAdmin } from "../common";

test.describe.configure({ mode: 'serial' })

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
})

test.afterAll(async () => {
    await page.close();
});

test('No unit tests', async() => {
    await logInAsAdmin( { page });
    await page.waitForTimeout(3000);
    
    await page.locator('#navbarSupportedContent').getByRole('link', { name: 'Submit a problem' }).click();
    await page.goto('/create-problem');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('Test problem');
    await page.locator('.view-lines').first().click();
    await page.getByLabel('Editor content;Press Alt+F1').first().fill('This is a test problem for an e2e test');
    await page.locator('div:nth-child(9) > div:nth-child(2) > .card > section > div > .monaco-editor > .overflow-guard > .monaco-scrollable-element > .lines-content > .view-lines').click();
    await page.locator('section').filter({ hasText: '# Hello world' }).getByLabel('Editor content;Press Alt+F1').fill('# Hello world\ndef solution():\n    pass');
    await page.getByRole('button', { name: 'Submit for review' }).click();

    await expect(page.getByText('At least one unit test is required')).toBeVisible({timeout: 10000});
})

test('Create problem', async () => {
    await page.getByText('Add a unit test').click();
    await page.locator('.d-flex > .card > section > div > .monaco-editor > .overflow-guard > .monaco-scrollable-element > .lines-content > .view-lines > .view-line').click();
    await page.locator('div').filter({ hasText: /^1Add a unit test$/ }).getByLabel('Editor content;Press Alt+F1').fill('assert solution() == 0');
    await page.getByRole('button', { name: 'Submit for review' }).click();
    await expect(page.getByText('Problem submitted for review')).toBeVisible();
})
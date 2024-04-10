import { test, Page, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' })

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
});

test.afterAll(async () => {
    await page.close();
});

test('Log in', async () => {
    await page.getByTestId('login-button').click();
    await page.locator('#username').click();
    await page.locator('#username').fill('testuser');
    await page.locator('#username').press('Tab');
    await page.locator('#inputPassword').fill('123qwe123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByTestId('login-button')).not.toBeVisible();
});

test('Log out', async () => {
    // await page.locator('div').filter({ hasText: /^testuserSubmit a problemMy profileAdmin panelSign out$/ }).getByRole('link').first().click();
    await page.getByTestId('signout-button').click();
})
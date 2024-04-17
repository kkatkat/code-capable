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

test('Delete account', async () => {
    page.on('dialog', dialog => dialog.accept());

    await page.getByTestId('login-button').click();
    await page.locator('#username').click();
    await page.locator('#username').fill('testuser');
    await page.locator('#username').press('Tab');
    await page.locator('#inputPassword').fill('123qwe123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByTestId('profile-icon').click();
    await page.locator('#navbarSupportedContent').getByRole('link', { name: 'My profile' }).click();
    await page.getByTestId('data-overview-button').click();
    await page.getByLabel('I understand that deleting my account is irreversible and all my data will be lost.').check();
    await page.getByRole('button', { name: 'Delete my account forever' }).click();
    await expect(page.getByText('Your account has been deleted successfully.')).toBeVisible();
})
import test, { Page, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' })

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
})

test.afterAll(async () => {
    await page.close();
});

test('Username taken', async () => {
    await page.locator('#navbarSupportedContent').getByRole('link', { name: 'Sign up' }).click();
    await page.locator('#firstname').click();
    await page.locator('#firstname').fill('kiril');
    await page.locator('#email').click();
    await page.locator('#email').fill('kiril@example.com');
    await page.locator('#inputPassword').click();
    await page.locator('#inputPassword').fill('123qwe123');
    await page.locator('#confirmPassword').click();
    await page.locator('#confirmPassword').fill('123qwe123');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Username or email already taken')).toBeVisible();
});

test('test2', async () => {
    await expect(page.getByText('Username or email already taken')).toBeVisible();
})


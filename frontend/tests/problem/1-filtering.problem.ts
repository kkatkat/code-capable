import test, { Page } from "@playwright/test";

//test.describe.configure({ mode: 'serial' })

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
})

test.afterAll(async () => {
    await page.close();
});

test('Go to problem page', async () => {
    await page.getByRole('link', { name: 'Problems', exact: true }).click();
})

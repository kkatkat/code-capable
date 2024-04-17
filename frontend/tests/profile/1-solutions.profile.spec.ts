import { Page, expect, test } from "@playwright/test";
import { logInAsAdmin, testCode } from "../common";

test.describe.configure({ mode: 'serial' })

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
})

test.afterAll(async () => {
    await page.close();
});

test('Solution is visible in profile', async () => {
    await logInAsAdmin({ page });
    await page.waitForTimeout(3000);

    await page.goto('/profile/7');
    await page.getByTestId('solutions-view-button').click();
    await expect(page.getByTestId('solution-card').first()).toBeVisible();
})

test('Delete solution', async () => {
    page.on('dialog', dialog => dialog.accept());

    await page.getByTestId('solution-card').first().click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Solution deleted successfully')).toBeVisible({timeout: 10000});
})
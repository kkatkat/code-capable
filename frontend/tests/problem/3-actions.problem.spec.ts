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

test('Approve problem', async () => {
    await logInAsAdmin({page});
    await page.waitForTimeout(3000);
    await page.goto('/problems');
    await page.getByTestId('problem-card').first().click();
    await page.getByTestId('approve-problem').click();
    await expect(page.getByText('Problem has been approved')).toBeVisible();
})

test('Delete problem', async () => {
    await page.waitForTimeout(1000);
    await page.getByLabel('close').click();
    await page.getByTestId('delete-problem').click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Problem has been deleted')).toBeVisible();
})
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

test('Submit solution', async () => {
    await logInAsAdmin({page});
    await page.waitForTimeout(3000);
    await page.goto('/problem/1');
    await page.locator('.view-lines').first().click();
    await page.locator('section').filter({ hasText: '1def twoSum(nums, target):' }).getByLabel('Editor content;Press Alt+F1').fill(testCode(true));
    await page.getByTestId('submit-code').click();

    await expect(page.getByTestId('success-button')).toBeVisible();
    await expect(page.getByText('Your solution has been submitted!')).toBeVisible();
    await page.waitForTimeout(3000);
    await expect(page.getByTestId('solution-card').first()).toBeVisible();
})

test('Solution is visible in profile', async () => {
    await page.goto('/profile/7');
    await expect(page.getByTestId('solution-card').first()).toBeVisible();
})
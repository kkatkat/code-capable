import { Page, expect, test } from "@playwright/test";
import { logInAsAdmin, testCode } from "../common";

test.describe.configure({ mode: 'serial' })

test('Run code with syntax error', async ({page}) => {
    await page.goto('/');
    await logInAsAdmin({page});
    await page.waitForTimeout(3000);
    await page.goto('/problem/1');
    await page.locator('.view-lines').first().click();
    await page.locator('section').filter({ hasText: '1def twoSum(nums, target):' }).getByLabel('Editor content;Press Alt+F1').fill(testCode(false));
    await page.getByTestId('run-code').click();

    //await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText("SyntaxError: '[' was never closed")).toBeVisible({timeout: 10000});
});

test('Run correct code', async ({page}) => {
    await page.goto('/');
    await logInAsAdmin({page});
    await page.waitForTimeout(3000);
    await page.goto('/problem/1');
    await page.locator('.view-lines').first().click();
    await page.locator('section').filter({ hasText: '1def twoSum(nums, target):' }).getByLabel('Editor content;Press Alt+F1').fill(testCode(true));
    await page.getByTestId('run-code').click();

    await expect(page.getByTestId('success-button')).toBeVisible();
})
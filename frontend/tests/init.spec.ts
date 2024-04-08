import { test, expect, Page } from '@playwright/test';

test('Loads index', async ({ page }) => {
  await waitForAppToBeReady(page);

  await expect(page).toHaveTitle('CodeCapable');
});

async function waitForAppToBeReady(page: Page) {
  let retries = 0;
  const maxRetries = 6;
  while (retries < maxRetries) {
    try {
      await page.goto('/');
      break;
    } catch (error) {
      await page.waitForTimeout(10000);
      retries += 1;
    }
  }
  if (retries >= maxRetries) {
    throw new Error('Frontend could not be reached.');
  }
}
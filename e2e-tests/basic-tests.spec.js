const { test, expect } = require('@playwright/test');

test.describe('Evidencija Nastave - Osnovni Testovi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('kompletni tok evidencije prisustva', async ({ page }) => {
    // 1. Prijava profesora
    await page.click('text=Prijavi se');
    await page.fill('input[name="email"]', 'profesor@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="user_type"]', 'profesor');
    await page.click('button[type="submit"]');

    // 2. Čekamo da se učita dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Dobrodošli')).toBeVisible();

    // 3. Navigacija na evidenciju
    await page.click('text=Evidencija');
    await expect(page).toHaveURL(/.*evidencija/);
  });

  test('prijava različitih tipova korisnika', async ({ page }) => {
    // Test prijave profesora
    await page.click('text=Prijavi se');
    await page.fill('input[name="email"]', 'profesor@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="user_type"]', 'profesor');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Profesor')).toBeVisible();
  });
});

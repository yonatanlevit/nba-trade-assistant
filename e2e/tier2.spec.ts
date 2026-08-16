// Tier 2 — scripted LLM + the REAL bball-GM engine. Uses real rostered stars
// (LeBron is a free agent in this synthetic dataset and cannot be traded).

import { expect, test } from "@playwright/test";

async function say(page: import("@playwright/test").Page, message: string) {
  await page.getByTestId("chat-input").fill(message);
  await page.getByTestId("chat-send").click();
}

test("real league data resolves criteria through the real API", async ({ page }) => {
  await page.goto("/");
  await say(page, "I'm Boston and I want Anthony Davis");

  await expect(page.getByTestId("team-chip")).toContainText("Boston Celtics", {
    timeout: 30_000,
  });
  await expect(page.getByTestId("target-chip")).toContainText("Anthony Davis");
});

test("the real validation engine produces displayable validated trades", async ({ page }) => {
  await page.goto("/");
  await say(page, "I'm Boston and I want Anthony Davis");
  await expect(page.getByTestId("target-chip")).toContainText("Anthony Davis", {
    timeout: 30_000,
  });

  await say(page, "yes");
  await expect(page.getByTestId("confirmation-status")).toHaveText(/confirmed/i, {
    timeout: 60_000,
  });

  // The real engine must produce displayable, API-confirmed trades.
  const cards = page.getByTestId("trade-card");
  await expect(cards.first()).toBeVisible({ timeout: 60_000 });
  await expect(cards.first()).toContainText(/valid/i);
  await expect(cards.first()).toContainText("Anthony Davis");
  await expect(page.getByTestId("validation-error")).toHaveCount(0);

  // Show more continues validating the SAME saved list (no re-search).
  const before = await cards.count();
  const showMore = page.getByTestId("show-more");
  await expect(showMore).toBeVisible();
  await showMore.click();
  await expect.poll(async () => cards.count(), { timeout: 60_000 }).toBeGreaterThan(before);
});

test("real free-agent data is reported as untradeable (LeBron gotcha)", async ({ page }) => {
  await page.goto("/");
  await say(page, "I want LeBron James");
  await expect(page.getByTestId("assistant-message").last()).toContainText(/free agent/i, {
    timeout: 30_000,
  });
  await expect(page.getByTestId("target-chip")).toHaveText("not set");
});

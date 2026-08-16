import { expect, test } from "@playwright/test";

async function say(page: import("@playwright/test").Page, message: string) {
  await page.getByTestId("chat-input").fill(message);
  await page.getByTestId("chat-send").click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("chat drives state and the board mirrors it", async ({ page }) => {
  await expect(page.getByTestId("team-chip")).toHaveText("not set");
  await expect(page.getByTestId("target-chip")).toHaveText("not set");

  await say(page, "I'm Boston and I want Anthony Davis");

  // Chat reflects the criteria and asks for confirmation.
  await expect(page.getByTestId("assistant-message").last()).toContainText(
    /should i search/i,
  );
  // The GUI mirror shows the same state, from the same object.
  await expect(page.getByTestId("team-chip")).toContainText("Boston Celtics");
  await expect(page.getByTestId("target-chip")).toContainText("Anthony Davis");
  await expect(page.getByTestId("confirmation-status")).toHaveText(/awaiting confirmation/i);
});

test("no search runs until the user confirms, then cards appear", async ({ page }) => {
  await say(page, "I'm Boston and I want Anthony Davis");
  await expect(page.getByTestId("target-chip")).toContainText("Anthony Davis");
  await expect(page.getByTestId("trade-card")).toHaveCount(0);

  await say(page, "yes");
  await expect(page.getByTestId("confirmation-status")).toHaveText(/confirmed/i);
  await expect(page.getByTestId("trade-card").first()).toBeVisible();
  await expect(page.getByTestId("results-count")).toContainText("valid");
});

test("trade cards show both sides, salary badge and a valid indicator", async ({ page }) => {
  await say(page, "I'm Boston and I want Anthony Davis");
  await say(page, "yes");

  const card = page.getByTestId("trade-card").first();
  await expect(card).toContainText("Option #1");
  await expect(card).toContainText("You send");
  await expect(card).toContainText("You receive");
  await expect(card).toContainText("Anthony Davis");
  await expect(card).toContainText(/valid/i);
  await expect(card).toContainText(/SAVED|ADDED|NO SALARY CHANGE/);
});

test("initial board shows at most 9 cards and Show more reveals more", async ({ page }) => {
  await say(page, "I'm Boston and I want Anthony Davis");
  await say(page, "yes");
  await expect(page.getByTestId("trade-card").first()).toBeVisible();

  const initial = await page.getByTestId("trade-card").count();
  expect(initial).toBeLessThanOrEqual(9);

  const showMore = page.getByTestId("show-more");
  if (await showMore.isVisible()) {
    await showMore.click();
    await expect
      .poll(async () => page.getByTestId("trade-card").count())
      .toBeGreaterThan(initial);
  }
});

test("changing the target invalidates confirmation and clears results", async ({ page }) => {
  await say(page, "I'm Boston and I want Anthony Davis");
  await say(page, "yes");
  await expect(page.getByTestId("trade-card").first()).toBeVisible();

  await say(page, "Actually I want Stephen Curry instead");

  await expect(page.getByTestId("target-chip")).toContainText("Stephen Curry");
  await expect(page.getByTestId("confirmation-status")).toHaveText(/awaiting confirmation/i);
  await expect(page.getByTestId("trade-card")).toHaveCount(0);
  await expect(page.getByTestId("assistant-message").last()).toContainText(/confirm/i);
});

test("ambiguous player names ask for clarification without searching", async ({ page }) => {
  await say(page, "I'm Boston and I want Anthony Davis");
  await say(page, "Actually give me Smith");

  await expect(page.getByTestId("assistant-message").last()).toContainText(/which one/i);
  await expect(page.getByTestId("trade-card")).toHaveCount(0);
});

test("free agents are reported as untradeable", async ({ page }) => {
  await say(page, "I want LeBron James");
  await expect(page.getByTestId("assistant-message").last()).toContainText(/free agent/i);
  await expect(page.getByTestId("target-chip")).toHaveText("not set");
});

test("unknown players produce a not-found reply and no search", async ({ page }) => {
  await say(page, "I want zzz nobody");
  await expect(page.getByTestId("assistant-message").last()).toContainText(/couldn't find/i);
  await expect(page.getByTestId("trade-card")).toHaveCount(0);
});

test("the tool trail makes each state change auditable", async ({ page }) => {
  await say(page, "I'm Boston and I want Anthony Davis");
  const trail = page.getByTestId("tool-trail").first();
  await expect(trail).toContainText("set_team");
  await expect(trail).toContainText("set_target_player");
});

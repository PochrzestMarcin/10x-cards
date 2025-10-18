import type { FullConfig } from "@playwright/test";
import { cleanupTestData } from "./helpers/db.helper";

async function globalTeardown(config: FullConfig) {
  await cleanupTestData();
}

export default globalTeardown;

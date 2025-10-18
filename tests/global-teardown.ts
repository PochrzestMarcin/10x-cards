import { cleanupTestData } from "./helpers/db.helper";

async function globalTeardown() {
  await cleanupTestData();
}

export default globalTeardown;

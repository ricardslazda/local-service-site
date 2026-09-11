import { defineConfig } from '@playwright/test';

const port = 4331;

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    use: {
        baseURL: `http://localhost:${port}`,
    },
    webServer: {
        command: `npm run build && npx astro preview --port ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: false,
        env: { ASTRO_PREVIEW_BACKGROUND: '0' },
        timeout: 120_000,
    },
});

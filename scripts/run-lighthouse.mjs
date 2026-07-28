import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2] === 'desktop' ? 'desktop' : 'mobile';
const targetUrl = process.env.LIGHTHOUSE_URL || 'http://localhost:4200';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDir, '..');
const reportDir = join(projectRoot, 'reports', 'lighthouse');
const tempDir = join(reportDir, 'tmp');
const outputPath = join(reportDir, mode);
const jsonReportPath = `${outputPath}.report.json`;
const lighthouseBin = join(
    projectRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse'
);

mkdirSync(tempDir, { recursive: true });

const args = [
    targetUrl,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--output=html',
    '--output=json',
    `--output-path=${outputPath}`,
    '--chrome-flags=--headless=new --disable-gpu --no-sandbox --disable-dev-shm-usage'
];

if (mode === 'desktop') {
    args.splice(1, 0, '--preset=desktop');
}

const result = spawnSync(lighthouseBin, args, {
    cwd: projectRoot,
    env: {
        ...process.env,
        TEMP: tempDir,
        TMP: tempDir
    },
    stdio: 'inherit',
    shell: process.platform === 'win32'
});

if (result.error) {
    console.error(result.error.message);
}

if (existsSync(jsonReportPath)) {
    process.exit(0);
}

process.exit(result.status ?? 1);

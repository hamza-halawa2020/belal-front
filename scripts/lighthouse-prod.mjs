import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDir, '..');
const browserRoot = join(projectRoot, 'dist', 'belal-lighthouse', 'browser');
const port = Number(process.env.LIGHTHOUSE_PROD_PORT || 4300);
const url = `http://localhost:${port}`;

const mimeTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.svg', 'image/svg+xml'],
    ['.webp', 'image/webp'],
    ['.woff2', 'font/woff2'],
    ['.ttf', 'font/ttf']
]);

if (!existsSync(join(browserRoot, 'index.html'))) {
    console.error(`Production browser build was not found at ${browserRoot}`);
    process.exit(1);
}

function resolveRequestPath(requestUrl) {
    const pathname = decodeURIComponent(new URL(requestUrl || '/', url).pathname);
    const requestedPath = normalize(join(browserRoot, pathname));
    const relativePath = relative(browserRoot, requestedPath);

    if (relativePath.startsWith('..')) {
        return null;
    }

    if (existsSync(requestedPath) && statSync(requestedPath).isFile()) {
        return requestedPath;
    }

    return join(browserRoot, 'index.html');
}

const server = createServer((request, response) => {
    const filePath = resolveRequestPath(request.url);

    if (!filePath) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    response.writeHead(200, {
        'Content-Type': mimeTypes.get(extname(filePath)) || 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const options = {
        cwd: projectRoot,
        env: {
            ...process.env,
            LIGHTHOUSE_URL: url
        },
        shell: process.platform === 'win32',
        stdio: 'inherit'
    };

    const mobileResult = spawnSync(npmCommand, ['run', 'lighthouse:mobile'], options);
    const desktopResult = spawnSync(npmCommand, ['run', 'lighthouse:desktop'], options);

    server.close(() => {
        process.exit(mobileResult.status || desktopResult.status || 0);
    });
});

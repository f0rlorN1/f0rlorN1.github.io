// f0rLorN Panel Server
// Run: node panel-server.js
// Then open: http://localhost:4823

const http = require('http');
const fs   = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT        = 4823;
const APPS_FILE   = path.join(__dirname, 'apps.js');
const CONFIG_FILE = path.join(__dirname, 'site-config.js');
const PANEL_DIR   = path.join(__dirname, 'hiu5q3xq7c38r9iy2s');

// ── Run git command ──────────────────────────────────────────────
function gitPush(callback) {
  const cmd = 'git add apps.js site-config.js && git commit -m "panel: update" && git push';
  exec(cmd, { cwd: __dirname, shell: true }, (err, stdout, stderr) => {
    const output = (stdout + stderr).toLowerCase();
    // "nothing to commit" is not a real error
    if (err && !output.includes('nothing to commit')) {
      callback({ ok: false, error: stderr || err.message });
    } else {
      callback({ ok: true, output: stdout });
    }
  });
}

// ── CORS headers ─────────────────────────────────────────────────
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Read body ────────────────────────────────────────────────────
function readBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => callback(body));
}

// ── Server ───────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  cors(res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // Serve panel HTML
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync(path.join(PANEL_DIR, 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html); return;
  }

  // GET /apps — return current apps array
  if (req.method === 'GET' && req.url === '/apps') {
    try {
      const code  = fs.readFileSync(APPS_FILE, 'utf8');
      const match = code.match(/const APPS\s*=\s*(\[[\s\S]*\]);/);
      if (!match) throw new Error('Could not parse APPS array');
      const apps = Function('"use strict"; return ' + match[1])();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, apps }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // POST /apps — save apps array and git push
  if (req.method === 'POST' && req.url === '/apps') {
    readBody(req, body => {
      try {
        const { apps } = JSON.parse(body);
        if (!Array.isArray(apps)) throw new Error('Invalid apps data');

        // Build apps.js content
        const arr = apps.map(app => `  {
    name: ${JSON.stringify(app.name)},
    tag: ${JSON.stringify(app.tag)},
    desc: ${JSON.stringify(app.desc)},
    downloadUrl: ${JSON.stringify(app.downloadUrl || '')},
    icon: ${JSON.stringify(app.icon)},
    badge: ${JSON.stringify(app.badge || 'Free')},
    status: ${JSON.stringify(app.status)},
  }`).join(',\n');

        const content = `// ============================================================
//  f0rLorN Apps Config — managed via panel
// ============================================================

const APPS = [
${arr},
];
`;
        fs.writeFileSync(APPS_FILE, content, 'utf8');

        // Git push via SSH
        gitPush(result => {
          res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        });

      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // GET /config — return site config
  if (req.method === 'GET' && req.url === '/config') {
    try {
      const code  = fs.readFileSync(CONFIG_FILE, 'utf8');
      const match = code.match(/const SITE_CONFIG\s*=\s*(\{[\s\S]*\});/);
      if (!match) throw new Error('Could not parse SITE_CONFIG');
      const config = Function('"use strict"; return ' + match[1])();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, config }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // POST /config — save site config
  if (req.method === 'POST' && req.url === '/config') {
    readBody(req, body => {
      try {
        const { config } = JSON.parse(body);
        const content = `// ============================================================
//  f0rLorN Site Config — managed via panel
// ============================================================

const SITE_CONFIG = {
  kofi:    ${JSON.stringify(config.kofi)},
  discord: ${JSON.stringify(config.discord)},
  ads: {
    enabled:     ${config.ads.enabled},
    publisherId: ${JSON.stringify(config.ads.publisherId)},
    slots: {
      banner:  ${JSON.stringify(config.ads.slots.banner)},
      sidebar: ${JSON.stringify(config.ads.slots.sidebar)},
    }
  }
};
`;
        fs.writeFileSync(CONFIG_FILE, content, 'utf8');
        gitPush(result => {
          res.writeHead(result.ok ? 200 : 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        });
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  f0rLorN Panel running at http://localhost:${PORT}\n`);
  // Auto-open browser
  const open = process.platform === 'win32' ? 'start' : 'open';
  exec(`${open} http://localhost:${PORT}`);
});

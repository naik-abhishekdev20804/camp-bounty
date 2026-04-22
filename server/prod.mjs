import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '../dist');
const isProd = process.env.NODE_ENV === 'production';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const app = express();
app.set('x-powered-by', false);
if (isProd) {
  app.set('trust proxy', 1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'"],
        'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
      },
    },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
  })
);
app.use(compression());

app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, service: 'campus-hub' });
});

app.use(
  express.static(dist, {
    index: false,
    maxAge: isProd ? '1h' : 0,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.set('Cache-Control', isProd ? 'public, max-age=3600, immutable' : 'no-cache');
      }
    },
  })
);

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/assets/')) {
    return res.status(404).end();
  }
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.sendFile(path.join(dist, 'index.html'), (err) => {
    if (err) next(err);
  });
});

app.use((err, _req, res, _next) => {
  if (!isProd) console.error(err);
  res.status(500).end();
});

app.listen(port, () => {
  console.log(`[campus-hub] ${isProd ? 'production' : 'development'}  http://localhost:${port}/`);
});

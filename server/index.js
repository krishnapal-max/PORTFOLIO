import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || process.env.API_PORT || 8787);
const ROOT = path.resolve(__dirname, '..');
const STORAGE_DIR = path.resolve(process.env.STORAGE_DIR || path.join(__dirname, 'data'));
const DATA_DIR = STORAGE_DIR;
const UPLOAD_DIR = path.join(STORAGE_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'content.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const defaults = {
  about: {
    heading: "ENGINEER'S MIND. CREATOR'S SOUL.",
    biography: "I'm Krishna Pal — a developer and engineering enthusiast exploring where code, hardware and visual storytelling meet. From connected devices to immersive browser experiences, I love turning ideas into things you can actually interact with.",
    skills: ["React / TypeScript", "Three.js / WebGL", "GSAP / Motion", "ESP32 / IoT"],
    image: "/images/unmasked-portrait.jpg"
  },
  projects: [
    { id: 'panelify', title: 'Panelify', category: 'SAAS / AUTOMATION', description: 'Lead workflows, WhatsApp messaging and customer journeys.', image: '/assets/project-covers/panelify.jpg', stack: ['React','Node.js','MongoDB','WhatsApp API'], detail: 'A SaaS concept designed to connect lead capture with practical customer communication workflows.' },
    { id: 'vehicle-security', title: 'Vehicle Security', category: 'EMBEDDED / IOT', description: 'GPS tracking, motion sensing and theft alerts.', image: '/assets/project-covers/vehicle-security.jpg', stack: ['ESP32','GPS','MPU6050','GSM'], detail: 'An embedded security prototype combining motion sensing, GPS location and GSM alerts.' },
    { id: 'gas-detector', title: 'Smart Gas Detector', category: 'HARDWARE / SAFETY', description: 'Gas detection with alerts and automated valve control.', image: '/assets/project-covers/smart-gas-detector.jpg', stack: ['Arduino','MQ-2','SIM800L','Servo'], detail: 'A gas monitoring prototype designed around local alerts, a display and a servo-actuated shutoff concept.' },
    { id: '3d-world', title: '3D Interactive World', category: 'CREATIVE DEVELOPMENT', description: 'Immersive scenes and interactive web experiments.', image: '/assets/project-covers/3d-interactive-portfolio.jpg', stack: ['Three.js','React','GSAP','WebGL'], detail: 'Cinematic web storytelling using 3D scenes, interaction design and browser-based experiences.' }
  ]
};
function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { fs.writeFileSync(DB_FILE, JSON.stringify(defaults, null, 2)); return structuredClone(defaults); }
}
let db = readDB();
function saveDB() { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().slice(0, 8);
      cb(null, `${Date.now()}-${crypto.randomBytes(5).toString('hex')}${ext}`);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(file.mimetype)) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  }
});
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.get('/api/health', (_req,res) => res.json({ok:true}));
app.get('/api/projects', (req,res) => { const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); const isAdmin = token && sessions.has(token); res.json(isAdmin && req.query.all === '1' ? db.projects : db.projects.filter(p => p.published !== false)); });
app.get('/api/about', (_req,res) => res.json(db.about));
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const sessions = new Set();
function requireAdmin(req,res,next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token || !sessions.has(token)) return res.status(401).json({error:'Admin login required'});
  next();
}
app.post('/api/admin/login', (req,res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({error:'Set ADMIN_PASSWORD in .env before using admin login.'});
  const supplied = String(req.body?.password || '');
  const a = Buffer.from(supplied), b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return res.status(401).json({error:'Incorrect password'});
  const token = crypto.randomBytes(32).toString('hex'); sessions.add(token);
  res.json({token});
});
app.post('/api/admin/logout', requireAdmin, (req,res) => { sessions.delete((req.headers.authorization || '').replace(/^Bearer\s+/i,'')); res.json({ok:true}); });
app.put('/api/admin/about', requireAdmin, (req,res) => {
  const {heading, biography, skills, image} = req.body || {};
  db.about = { heading: String(heading || '').slice(0,180), biography: String(biography || '').slice(0,4000), skills: Array.isArray(skills) ? skills.map(x=>String(x).slice(0,80)).slice(0,30) : [], image: String(image || '').slice(0,500) };
  saveDB(); res.json(db.about);
});
app.post('/api/admin/upload', requireAdmin, upload.array('images',12), (req,res) => {
  res.json({ files: (req.files || []).map(f => `/uploads/${f.filename}`) });
});
app.post('/api/admin/projects', requireAdmin, (req,res) => {
  const p = cleanProject(req.body);
  if (!p.title || !p.id) return res.status(400).json({error:'Project title is required'});
  if (db.projects.some(x=>x.id===p.id)) return res.status(409).json({error:'That project slug already exists'});
  db.projects.push(p); saveDB(); res.status(201).json(p);
});
app.put('/api/admin/projects/:id', requireAdmin, (req,res) => {
  const idx = db.projects.findIndex(x=>x.id===req.params.id);
  if (idx < 0) return res.status(404).json({error:'Project not found'});
  const p = cleanProject({...req.body, id:req.params.id});
  db.projects[idx] = p; saveDB(); res.json(p);
});
app.delete('/api/admin/projects/:id', requireAdmin, (req,res) => {
  const idx = db.projects.findIndex(x=>x.id===req.params.id);
  if (idx < 0) return res.status(404).json({error:'Project not found'});
  db.projects.splice(idx,1); saveDB(); res.json({ok:true});
});
function cleanProject(body) {
  const id = String(body.id || body.title || '').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
  return {
    id, title:String(body.title||'').slice(0,120), category:String(body.category||'PROJECT').slice(0,100),
    description:String(body.description||'').slice(0,500), detail:String(body.detail||'').slice(0,6000),
    image:String(body.image||'').slice(0,500), stack:Array.isArray(body.stack)?body.stack.map(x=>String(x).slice(0,60)).slice(0,30):[],
    screenshots:Array.isArray(body.screenshots)?body.screenshots.map(x=>String(x).slice(0,500)).slice(0,12):[],
    demoUrl:String(body.demoUrl||'').slice(0,500), repoUrl:String(body.repoUrl||'').slice(0,500), published:body.published!==false
  };
}
if (process.env.NODE_ENV === 'production') {
  const DIST_DIR = path.join(ROOT, 'dist');
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'), error => { if (error) next(error); });
  });
}
app.use((err,_req,res,_next) => { res.status(400).json({error:err.message || 'Upload failed'}); });
app.listen(PORT, () => console.log(`Portfolio API running at http://localhost:${PORT}`));

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Github, Instagram, Linkedin, Menu, MoveUpRight, Volume2, VolumeX, X, Zap, LockKeyhole, Upload, Plus, Pencil, Trash2, Save, LogOut } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

const InteractiveGames = lazy(() => import('./InteractiveGames'))

type Project = { id: string; title: string; category: string; description: string; image: string; stack: string[]; detail: string }
const projects: Project[] = [
  { id: 'panelify', title: 'Panelify', category: 'SAAS / AUTOMATION', description: 'Lead workflows, WhatsApp messaging and customer journeys.', image: '/assets/project-covers/panelify.jpg', stack: ['React', 'Node.js', 'MongoDB', 'WhatsApp API'], detail: 'A SaaS concept designed to connect lead capture with practical customer communication workflows. The next iteration focuses on reliable integrations, plan management and a clear client dashboard.' },
  { id: 'vehicle-security', title: 'Vehicle Security', category: 'EMBEDDED / IOT', description: 'GPS tracking, motion sensing and theft alerts.', image: '/assets/project-covers/vehicle-security.jpg', stack: ['ESP32', 'GPS', 'MPU6050', 'GSM'], detail: 'An embedded security prototype combining motion sensing, GPS location and GSM alerts to help detect suspicious vehicle movement.' },
  { id: 'gas-detector', title: 'Smart Gas Detector', category: 'HARDWARE / SAFETY', description: 'Gas detection with alerts and automated valve control.', image: '/assets/project-covers/smart-gas-detector.jpg', stack: ['Arduino', 'MQ-2', 'SIM800L', 'Servo'], detail: 'A gas monitoring prototype designed around local alerts, a display, audible warning and a servo-actuated shutoff concept. Physical safety testing and fail-safe validation are essential before real-world use.' },
  { id: '3d-world', title: '3D Interactive World', category: 'CREATIVE DEVELOPMENT', description: 'Immersive scenes and interactive web experiments.', image: '/assets/project-covers/3d-interactive-portfolio.jpg', stack: ['Three.js', 'React', 'GSAP', 'WebGL'], detail: 'An exploration of cinematic web storytelling using 3D scenes, interaction design, motion and lightweight browser-based experiences.' },
]
const games = [
  { id: 'car', name: '3D Car Racing', kind: 'RACING', icon: '▰', desc: 'Steer through a neon track and dodge traffic.', image: '/assets/game-covers/3d-car-racing.jpg' },
  { id: 'runner', name: '3D Subway Runner', kind: 'RUNNER', icon: '◈', desc: 'Switch lanes, jump and slide past obstacles.', image: '/assets/game-covers/3d-subway-runner.jpg' },
  { id: 'tictactoe', name: '3D Tic-Tac-Toe', kind: 'STRATEGY', icon: '✕', desc: 'Play X and O on a glowing 3D board.', image: '/assets/game-covers/3d-tic-tac-toe.jpg' },
  { id: 'chess', name: '3D Chess', kind: 'STRATEGY', icon: '♞', desc: 'Challenge the robot or play with a friend.', image: '/assets/game-covers/3d-chess.jpg' },
  { id: 'space', name: '3D Space Shooter', kind: 'ARCADE', icon: '✦', desc: 'Shoot incoming drones in deep space.', image: '/assets/game-covers/3d-space-shooter.jpg' },
  { id: 'physics', name: '3D Physics Playground', kind: 'SANDBOX', icon: '✳', desc: 'Play with glowing objects in a 3D world.', image: '/assets/game-covers/3d-physics-playground.jpg' },
]
function useProjects() {
  const [items, setItems] = useState<Project[]>(projects)
  useEffect(() => { fetch('/api/projects').then(r=>r.ok?r.json():null).then(data=>{if(Array.isArray(data)&&data.length>=0)setItems(data)}).catch(()=>{}) }, [])
  return items
}
function useAbout() {
  const [about, setAbout] = useState<any>(null)
  useEffect(() => { fetch('/api/about').then(r=>r.ok?r.json():null).then(data=>{if(data)setAbout(data)}).catch(()=>{}) }, [])
  return about
}

function CursorFX() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) { dot.current.style.left = `${e.clientX}px`; dot.current.style.top = `${e.clientY}px` }
      if (ring.current) { ring.current.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 230, fill: 'forwards', easing: 'ease-out' }) }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <><div className="cursor-dot" ref={dot}/><div className="cursor-ring" ref={ring}/></>
}
function MaskReveal() {
  const container = useRef<HTMLDivElement>(null)
  const [point, setPoint] = useState({ x: 50, y: 45 })
  const [active, setActive] = useState(false)
  const update = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = container.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const x = (clientX - rect.left) / rect.width * 100
    const y = (clientY - rect.top) / rect.height * 100
    setPoint({ x, y })
    setActive(x >= 27 && x <= 76 && y >= 20 && y <= 79)
  }
  return <div className="portrait-stage" ref={container} onMouseMove={update} onMouseLeave={() => setActive(false)} onTouchMove={update} onTouchEnd={() => setActive(false)}>
    <div className="portrait-glow"/>
    <img className="portrait-base" src="/assets/mask-frames/frame_01.jpg" alt="Original futuristic masked character shown from head to shoulders"/>
    <div className={`reveal-layer ${active ? 'is-active' : ''}`} style={{ clipPath: active ? `circle(48% at ${point.x}% ${point.y}%)` : 'circle(0% at 50% 45%)' }}>
      <img src="/assets/mask-frames/frame_50.jpg" alt="Original character with a clear, unmasked face"/>
    </div>
    <div className="portrait-shade"/>
    <div className={`reveal-reticle ${active ? 'visible' : ''}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}><span/></div>
    <div className="portrait-label"><span className="live-dot"/> LIVE FACE REVEAL <span className="label-divider"/> MOVE CURSOR</div>
  </div>
}
function Header() {
  const [menu, setMenu] = useState(false), [sound, setSound] = useState(false)
  return <header className="site-header">
    <Link className="brand" to="/" onClick={() => setMenu(false)}>KRISHNA PAL<span>.</span></Link>
    <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X/> : <Menu/>}</button>
    <nav className={menu ? 'nav-links open' : 'nav-links'}>
      {[['HOME','/'],['PROJECTS','/projects'],['ABOUT','/about'],['CONTACT','/contact']].map(([name,path]) => <Link key={path} to={path} onClick={() => setMenu(false)}>{name}</Link>)}
    </nav>
    <div className="header-actions"><button className="sound-toggle" onClick={() => setSound(!sound)} title="Visual demo sound toggle">{sound ? <Volume2 size={16}/> : <VolumeX size={16}/>} <span>{sound ? 'ON' : 'OFF'}</span></button><Link to="/contact" className="outline-button">LET'S TALK <ArrowRight size={15}/></Link></div>
  </header>
}
function Footer() { return <footer className="footer"><Link className="brand" to="/">KRISHNA PAL<span>.</span></Link><span>© {new Date().getFullYear()} — MADE WITH CURIOSITY</span><div className="footer-links"><a href="https://github.com/" target="_blank" rel="noreferrer">GITHUB</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LINKEDIN</a><a href="https://www.instagram.com/mr.krishna0_pal1/" target="_blank" rel="noreferrer">INSTAGRAM</a></div><span className="footer-tech"><Zap size={13}/> REACT · THREE.JS · GSAP</span></footer> }
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <Link to={`/projects/${project.id}`} className="project-card"><div className="project-image"><img src={project.image} alt="" style={{ objectPosition: index === 1 ? 'center' : 'center 38%' }}/><span className="project-index">0{index + 1}</span><span className="project-open"><ArrowUpRight size={18}/></span></div><div className="project-meta">{project.category}</div><h3>{project.title}</h3><p>{project.description}</p><div className="project-bottom"><span>EXPLORE PROJECT</span><ArrowRight size={14}/></div></Link>
}
function Home() {
  const liveProjects = useProjects()
  const about = useAbout()
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 28, opacity: 0, duration: .8, stagger: .09, ease: 'power3.out', delay: .15 })
      gsap.from('.portrait-stage', { scale: .96, opacity: 0, duration: 1.1, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => gsap.from(el, { y: 35, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
    }, root)
    const lenis = new Lenis({ lerp: .09 })
    let raf = 0
    const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    lenis.on('scroll', ScrollTrigger.update)
    return () => { ctx.revert(); lenis.destroy(); cancelAnimationFrame(raf) }
  }, [])
  return <main ref={root}>
    <section className="hero section-shell">
      <div className="hero-kicker"><span className="live-dot"/> INDEPENDENT CREATIVE DEVELOPER <span className="hero-location">BASED IN INDIA · AVAILABLE FOR SELECT PROJECTS</span></div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="eyebrow">PORTFOLIO / 2026</div><h1>KRISHNA<br/><em>PAL</em><span className="title-period">.</span></h1>
          <div className="role-line">3D WEB DESIGNER <b>·</b> ENGINEER <b>·</b> CREATIVE CODER</div>
          <p className="hero-description">I build <span>immersive digital experiences</span>, interactive 3D worlds and real-world tech solutions.</p>
          <div className="hero-ctas"><Link className="primary-button" to="/projects">EXPLORE MY WORK <ArrowRight size={16}/></Link><a className="text-button" href="#about"><span className="play-icon">↘</span> DISCOVER MY WORLD</a></div>
          <div className="hero-stats"><div><strong>04<span>+</span></strong><small>FEATURED BUILDS</small></div><div><strong>3D</strong><small>CREATIVE TECH</small></div><div><strong>∞</strong><small>IDEAS IN PROGRESS</small></div></div>
        </div>
        <MaskReveal/>
        <div className="hero-vertical"><span>DESIGN WITH INTENT</span><i/><span>BUILD WITHOUT LIMITS</span></div>
      </div>
      <a className="scroll-cue" href="#work"><ArrowDown size={15}/> SCROLL TO EXPLORE <span/></a>
      <div className="hero-bottom-note"><span>01 / 05</span><div><i/></div><span>THE DIGITAL PLAYGROUND</span></div>
    </section>
    <section className="ticker" aria-label="Skills"><div className="ticker-track">{Array.from({length:2}).map((_,i)=><span key={i}>CREATIVE CODE <b>✳</b> IMMERSIVE 3D <b>✳</b> INTERACTION DESIGN <b>✳</b> EMBEDDED SYSTEMS <b>✳</b> EXPERIMENTAL WEB <b>✳</b></span>)}</div></section>
    <section className="work-section section-shell" id="work"><div className="section-heading reveal-up"><div><div className="eyebrow">02 / SELECTED WORK</div><h2>BUILT WITH <em>INTENT.</em></h2></div><Link to="/projects" className="outline-button">ALL PROJECTS <ArrowUpRight size={15}/></Link></div><div className="project-grid">{<div className="project-flow"><div className="project-flow-track">{[...liveProjects,...liveProjects].map((p,i)=><div className="project-flow-item" key={`${p.id}-${i}`}><ProjectCard project={p} index={i%liveProjects.length}/></div>)}</div></div>}</div></section>
    <section className="about-band" id="about"><div className="about-visual"><img src={about?.image || "/assets/mask-frames/frame_50.jpg"} alt="Original character with a clear, unmasked face"/><div className="about-stamp">CURIOUS<br/>BY DESIGN<span>✳</span></div></div><div className="about-copy reveal-up"><div className="eyebrow">03 / A LITTLE ABOUT ME</div><h2>{about?.heading ? about.heading.split('. ').map((part:string,i:number)=><span key={i}>{part}{i===0?<br/>:'.'}</span>) : <>ENGINEER'S MIND.<br/><em>CREATOR'S SOUL.</em></>}</h2><p>{about?.biography || "I'm Krishna Pal — a developer and engineering enthusiast exploring where code, hardware and visual storytelling meet. From connected devices to immersive browser experiences, I love turning ideas into things you can actually interact with."}</p><div className="skill-list">{(Array.isArray(about?.skills)?about.skills:['REACT / TYPESCRIPT','THREE.JS / WEBGL','GSAP / MOTION','ESP32 / IOT']).map((skill:string)=><span key={skill}>{skill.toUpperCase()}</span>)}</div><Link to="/about" className="text-link">MORE ABOUT ME <ArrowUpRight size={16}/></Link></div></section>
    <section className="contact-banner"><div className="eyebrow">05 / HAVE SOMETHING IN MIND?</div><h2>LET'S MAKE<br/><em>IT REAL.</em></h2><p>Got an interesting idea, a wild experiment or a project to build? Let's talk.</p><Link to="/contact" className="primary-button">START A CONVERSATION <ArrowRight size={16}/></Link><div className="contact-orb">KP<span>✳</span></div></section>
  </main>
}
function PageTitle({ overline, title, italic }: { overline: string; title: string; italic: string }) { return <div className="page-title"><div className="eyebrow">{overline}</div><h1>{title}<br/><em>{italic}</em><span className="title-period">.</span></h1></div> }
function ProjectsPage() {
  const liveProjects = useProjects()
  return <main className="inner-page section-shell"><PageTitle overline="SELECTED WORK / 2024—2026" title="IDEAS INTO" italic="EXPERIENCES"/><p className="inner-intro">A collection of experiments across software, hardware and immersive web experiences. Each project starts with a question and a willingness to build.</p><div className="project-grid projects-page-grid">{liveProjects.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}</div></main>
}
function ProjectDetail() {
  const liveProjects = useProjects()
  const { pathname } = useLocation()
  const slug = pathname.split('/').pop()
  const project = liveProjects.find(p=>p.id===slug)
  if (!project) return <main className="inner-page section-shell"><PageTitle overline="PROJECT NOT FOUND" title="WRONG" italic="TURN"/></main>
  return <main className="inner-page section-shell detail-page"><Link to="/projects" className="back-link"><ArrowLeft size={15}/> BACK TO PROJECTS</Link><div className="eyebrow">{project.category}</div><h1>{project.title.split(' ').slice(0,-1).join(' ') || project.title}<br/><em>{project.title.split(' ').slice(-1)[0]}</em><span className="title-period">.</span></h1><p className="inner-intro">{project.description}</p><div className="detail-image"><img src={project.image} alt={project.title}/><span>PROJECT / {project.id.toUpperCase()}</span></div><div className="detail-columns"><div><div className="eyebrow">THE IDEA</div><p>{project.detail}</p></div><div><div className="eyebrow">TECH STACK</div><div className="skill-list">{project.stack.map(s=><span key={s}>{s}</span>)}</div></div></div><Link to="/contact" className="primary-button">BUILD SOMETHING TOGETHER <ArrowRight size={16}/></Link></main>
}
function AboutPage() {
  const about = useAbout()
  return <main className="inner-page section-shell about-page"><PageTitle overline="A PERSON BEHIND THE PIXELS" title="ALWAYS" italic="EXPLORING"/><div className="about-page-grid"><div className="about-page-image"><img src={about?.image || "/assets/mask-frames/frame_50.jpg"} alt="Krishna Pal original character with a clear face"/><span>KRISHNA PAL / INDIA</span></div><div><div className="eyebrow">HELLO, I'M KRISHNA.</div><h2>{about?.heading || 'PART ENGINEER. PART EXPERIMENTER.'}</h2><p>{about?.biography || 'I enjoy creating things that sit between technology and imagination. My interests range from web development and cinematic 3D scenes to microcontrollers, sensors and connected systems.'}</p><div className="eyebrow timeline-label">CURRENT CURIOSITIES</div><div className="timeline"><div><span>01</span><p><b>Immersive web</b><small>Three.js, WebGL, interaction design</small></p></div><div><span>02</span><p><b>Connected hardware</b><small>ESP32, Arduino, sensors and IoT</small></p></div><div><span>03</span><p><b>Useful software</b><small>Full-stack tools and automation</small></p></div></div><Link to="/projects" className="text-link">EXPLORE MY WORK <ArrowUpRight size={16}/></Link></div></div></main>
}
function PlaygroundPage() {
  return <main className="inner-page section-shell playground-page"><PageTitle overline="INTERACTIVE 3D EXPERIMENTS" title="PLAY IS" italic="SERIOUS WORK"/><p className="inner-intro">Six interactive 3D experiments. Pick a game, learn the controls and play.</p><Suspense fallback={<p className="inner-intro">Loading experiments...</p>}><InteractiveGames/></Suspense></main>
}

function ContactPage() {
  const [sent,setSent] = useState(false)
  const [form,setForm] = useState({name:'',email:'',message:''})
  return <main className="inner-page section-shell contact-page"><PageTitle overline="HAVE A PROJECT IN MIND?" title="LET'S" italic="CONNECT"/><div className="contact-page-grid"><div><p className="inner-intro">Have an idea, a question, or just want to talk about creative technology? Drop a message and let's see what we can make.</p><a className="contact-detail" href="https://github.com/" target="_blank" rel="noreferrer"><Github/><span><small>FIND MY CODE</small><b>GitHub</b></span><ArrowUpRight/></a><a className="contact-detail" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin/><span><small>LET'S CONNECT</small><b>LinkedIn</b></span><ArrowUpRight/></a><a className="contact-detail" href="https://www.instagram.com/mr.krishna0_pal1/" target="_blank" rel="noreferrer"><Instagram/><span><small>BEHIND THE SCENES</small><b>Instagram</b></span><ArrowUpRight/></a></div><form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Your name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="What should I call you?"/></label><label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>What's on your mind?<textarea required rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me a little about your idea…"/></label><button className="primary-button" type="submit">{sent?'MESSAGE READY':'PREPARE MESSAGE'} <ArrowRight size={16}/></button>{sent&&<p className="form-note">Your message is ready, but no backend is connected yet. Copy your message or connect an email service to enable delivery.</p>}<button type="button" className="text-link copy-message" onClick={()=>navigator.clipboard?.writeText(`From: ${form.name} (${form.email})\n\n${form.message}`)}>COPY MESSAGE TEXT <MoveUpRight size={14}/></button></form></div></main>
}

type AdminProject = Project & { screenshots?: string[]; demoUrl?: string; repoUrl?: string; published?: boolean }
function AdminPage() {
  const [token,setToken] = useState(()=>localStorage.getItem('kp-admin-token')||'')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [message,setMessage] = useState('')
  const [tab,setTab] = useState<'projects'|'about'>('projects')
  const [items,setItems] = useState<AdminProject[]>([])
  const [about,setAbout] = useState<any>({heading:"ENGINEER'S MIND. CREATOR'S SOUL.",biography:'',skills:[],image:'/assets/mask-frames/frame_50.jpg'})
  const [editing,setEditing] = useState<AdminProject|null>(null)
  const [title,setTitle] = useState(''); const [category,setCategory] = useState('CREATIVE DEVELOPMENT'); const [description,setDescription] = useState(''); const [detail,setDetail] = useState(''); const [stack,setStack] = useState('React, Three.js'); const [image,setImage] = useState(''); const [demoUrl,setDemoUrl] = useState(''); const [repoUrl,setRepoUrl] = useState(''); const [published,setPublished] = useState(true)
  const headers = () => ({'Content-Type':'application/json',Authorization:`Bearer ${token}`})
  const load = async () => {
    try { const [p,a]=await Promise.all([fetch('/api/projects?all=1',{headers:{Authorization:`Bearer ${token}`}}),fetch('/api/about')]); if(p.ok)setItems(await p.json()); if(a.ok)setAbout(await a.json()) } catch { setError('Cannot connect to the portfolio API. Start the project with npm.cmd run dev.') }
  }
  useEffect(()=>{if(token)load()},[token])
  const login = async (e:React.FormEvent) => {e.preventDefault();setError('');try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Login failed');localStorage.setItem('kp-admin-token',d.token);setToken(d.token);setMessage('Logged in successfully.')}catch(err:any){setError(err.message||'Login failed')}}
  const resetForm = () => {const coverInput=document.getElementById('project-cover-upload') as HTMLInputElement|null;if(coverInput)coverInput.value='';setEditing(null);setTitle('');setCategory('CREATIVE DEVELOPMENT');setDescription('');setDetail('');setStack('React, Three.js');setImage('');setDemoUrl('');setRepoUrl('');setPublished(true)}
  const editProject = (p:AdminProject) => {setEditing(p);setTitle(p.title);setCategory(p.category);setDescription(p.description);setDetail(p.detail);setStack((p.stack||[]).join(', '));setImage(p.image);setDemoUrl(p.demoUrl||'');setRepoUrl(p.repoUrl||'');setPublished(p.published!==false);window.scrollTo({top:0,behavior:'smooth'})}
  const uploadFiles = async (files:FileList|null) => {if(!files?.length)return [];const fd=new FormData();Array.from(files).forEach(f=>fd.append('images',f));const r=await fetch('/api/admin/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error||'Upload failed');return d.files as string[]}
  const saveProject = async (e:React.FormEvent) => {e.preventDefault();setError('');setMessage('');try{const coverFiles=(document.getElementById('project-cover-upload') as HTMLInputElement)?.files;let finalImage=image;if(coverFiles?.length){const uploaded=await uploadFiles(coverFiles);finalImage=uploaded[0]||image}const slug=(editing?.id||title).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const payload={id:slug,title,category,description,detail,stack:stack.split(',').map(s=>s.trim()).filter(Boolean),image:finalImage,demoUrl,repoUrl,published};const r=await fetch(editing?`/api/admin/projects/${editing.id}`:'/api/admin/projects',{method:editing?'PUT':'POST',headers:headers(),body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not save project');resetForm();await load();setMessage('Project saved. Published changes now appear on the public website.')}catch(err:any){setError(err.message||'Save failed')}}
  const saveAbout = async (e:React.FormEvent) => {e.preventDefault();setError('');try{const files=(document.getElementById('about-image-upload') as HTMLInputElement)?.files;let imageUrl=about.image;if(files?.length){const uploaded=await uploadFiles(files);imageUrl=uploaded[0]||imageUrl}const payload={...about,image:imageUrl,skills:typeof about.skills==='string'?about.skills.split(',').map((s:string)=>s.trim()).filter(Boolean):about.skills};const r=await fetch('/api/admin/about',{method:'PUT',headers:headers(),body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not save About');setAbout(d);setMessage('About page updated successfully.')}catch(err:any){setError(err.message||'Save failed')}}
  const remove = async (p:AdminProject) => {if(!confirm(`Delete "${p.title}"? This cannot be undone.`))return;try{const r=await fetch(`/api/admin/projects/${p.id}`,{method:'DELETE',headers:headers()});if(!r.ok)throw new Error('Delete failed');await load();setMessage('Project deleted.')}catch(e:any){setError(e.message)}}
  const logout = async () => {try{await fetch('/api/admin/logout',{method:'POST',headers:headers()})}catch{}localStorage.removeItem('kp-admin-token');setToken('');setItems([])}
  if(!token)return <main className="admin-page section-shell"><div className="admin-login"><LockKeyhole size={34}/><div className="eyebrow">PRIVATE CONTENT MANAGEMENT</div><h1>ADMIN <em>LOGIN.</em></h1><p>Sign in to edit About content and manage published projects.</p><form onSubmit={login}><label>Admin password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="primary-button" type="submit">SIGN IN <ArrowRight size={15}/></button></form>{error&&<p className="admin-error">{error}</p>}<small>Configure ADMIN_PASSWORD in the server .env file before logging in.</small></div></main>
  return <main className="admin-page section-shell"><div className="admin-heading"><div><div className="eyebrow">PRIVATE WORKSPACE</div><h1>CONTENT <em>STUDIO.</em></h1><p>Changes saved here are served to the public website by the portfolio API.</p></div><button className="outline-button" onClick={logout}><LogOut size={15}/> LOG OUT</button></div>
    <div className="admin-tabs"><button className={tab==='projects'?'active':''} onClick={()=>setTab('projects')}>PROJECTS ({items.length})</button><button className={tab==='about'?'active':''} onClick={()=>setTab('about')}>EDIT ABOUT</button></div>
    {error&&<div className="admin-error">{error}</div>}{message&&<div className="admin-success">{message}</div>}
    {tab==='projects'?<div className="admin-columns"><form className="admin-form" onSubmit={saveProject}><div className="admin-form-head"><h2>{editing?'Edit project':'Add a project'}</h2><button type="button" className="text-link" onClick={resetForm}>CLEAR</button></div><label>Project title<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="My new project"/></label><label>Category<input value={category} onChange={e=>setCategory(e.target.value)} placeholder="3D / HARDWARE / WEB"/></label><label>Short description<textarea required rows={2} value={description} onChange={e=>setDescription(e.target.value)}/></label><label>Full project details<textarea rows={4} value={detail} onChange={e=>setDetail(e.target.value)}/></label><label>Technologies (comma separated)<input value={stack} onChange={e=>setStack(e.target.value)}/></label><label>Cover image URL<input value={image} onChange={e=>setImage(e.target.value)} placeholder="/uploads/filename.jpg"/></label><label>Or upload a cover image<input id="project-cover-upload" type="file" accept="image/png,image/jpeg,image/webp,image/avif" /></label><label>Live demo URL (optional)<input type="url" value={demoUrl} onChange={e=>setDemoUrl(e.target.value)}/></label><label>GitHub URL (optional)<input type="url" value={repoUrl} onChange={e=>setRepoUrl(e.target.value)}/></label><label className="admin-check"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish immediately</label><div className="admin-actions"><button className="primary-button" type="submit"><Save size={15}/> {editing?'SAVE CHANGES':'PUBLISH PROJECT'}</button>{editing&&<button type="button" className="outline-button" onClick={resetForm}>CANCEL</button>}</div></form><div className="admin-project-list"><div className="admin-form-head"><h2>Existing projects</h2><button className="outline-button" onClick={()=>load()}>REFRESH</button></div>{items.map(p=><article className="admin-project-row" key={p.id}><img src={p.image||'/assets/project-covers/3d-interactive-portfolio.jpg'} alt=""/><div className="admin-project-info"><b>{p.title}</b><small>{p.category} · {p.published===false?'DRAFT':'PUBLISHED'}</small><span>{p.description}</span></div><button aria-label="Edit project" onClick={()=>editProject(p)}><Pencil size={15}/></button><button aria-label="Delete project" onClick={()=>remove(p)}><Trash2 size={15}/></button></article>)}{!items.length&&<p>No projects yet. Add your first project.</p>}</div></div>:<form className="admin-form about-admin-form" onSubmit={saveAbout}><h2>Edit About page</h2><label>Heading<input value={about.heading||''} onChange={e=>setAbout({...about,heading:e.target.value})}/></label><label>Biography<textarea rows={8} value={about.biography||''} onChange={e=>setAbout({...about,biography:e.target.value})}/></label><label>Skills (comma separated)<input value={Array.isArray(about.skills)?about.skills.join(', '):about.skills||''} onChange={e=>setAbout({...about,skills:e.target.value})}/></label><label>Current image URL<input value={about.image||''} onChange={e=>setAbout({...about,image:e.target.value})}/></label><label>Upload replacement image<input id="about-image-upload" type="file" accept="image/png,image/jpeg,image/webp,image/avif"/></label><button className="primary-button" type="submit"><Save size={15}/> SAVE ABOUT PAGE</button></form>}
  </main>
}
function ScrollTop() { const { pathname }=useLocation(); useEffect(()=>{window.scrollTo({top:0,behavior:'instant'} as ScrollToOptions)},[pathname]); return null }
export default function App() {
  return <><CursorFX/><Header/><ScrollTop/><Routes><Route path="/" element={<Home/>}/><Route path="/projects" element={<ProjectsPage/>}/><Route path="/projects/:slug" element={<ProjectDetail/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/playground" element={<PlaygroundPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/admin/login" element={<AdminPage/>}/><Route path="*" element={<Home/>}/></Routes><Footer/></>
}
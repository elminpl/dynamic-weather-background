/* Dynamic Weather Background v1.7.1 | MIT | No runtime dependencies. */
export const VERSION = "1.7.1";
export const CONDITIONS = ["sunny", "clear-night", "partlycloudy", "cloudy", "rainy", "pouring", "snowy", "snowy-rainy", "fog", "lightning", "lightning-rainy", "windy", "windy-variant", "hail", "exceptional"];
export const DEFAULTS = Object.freeze({
  entity: "weather.forecast_dom", sun_entity: "sun.sun",
  hide_card: true, cloud_speed: 42, cloud_speed_secondary: 68,
  cloud_opacity: 80, effects_opacity: 65, clouds: true, rain: true, snow: true,
  fog: true, hail: true, lightning: false, animation: "auto", performance: "balanced",
  precipitation_intensity: 100, precipitation_speed: 100,
  lightning_strength: 65, lightning_interval: 14,
  preview_weather: "off", preview_time: "auto", preview_cloud_coverage: 50,
  card_background_transparency: 0, fade_card_content: false, card_content_transparency: 0,
  card_effect: "none", glass_blur: 10, glass_shine: 35, card_border: true, card_shadow: 35,
});
const ENUMS = { card_effect: ["none", "glass", "frosted", "soft"], animation: ["auto", "reduced", "off"], performance: ["high", "balanced", "battery"],
  preview_weather: ["off", ...CONDITIONS], preview_time: ["auto", "day", "night", "dawn", "dusk"] };
const RANGES = { cloud_speed: [10, 240], cloud_speed_secondary: [10, 240], cloud_opacity: [0, 100], effects_opacity: [0, 100], preview_cloud_coverage: [0, 100], card_background_transparency: [0, 100], card_content_transparency: [0, 100], precipitation_intensity: [0, 200], precipitation_speed: [10, 200], lightning_strength: [0, 100], lightning_interval: [6, 60], glass_blur: [0, 24], glass_shine: [0, 100], card_shadow: [0, 100] };
export function normalizeConfig(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Konfiguracja musi być obiektem.");
  const c = { ...DEFAULTS, ...input };
  for (const [key, choices] of Object.entries(ENUMS)) if (!choices.includes(c[key])) throw new Error(`Niepoprawna opcja: ${key}`);
  for (const [key, [min, max]] of Object.entries(RANGES)) {
    if (typeof c[key] !== "number" || !Number.isFinite(c[key]) || c[key] < min || c[key] > max) throw new Error(`${key}: wymagana liczba ${min}–${max}`);
  }
  for (const key of ["clouds", "rain", "snow", "fog", "hail", "lightning", "hide_card", "fade_card_content", "card_border"]) if (typeof c[key] !== "boolean") throw new Error(`${key}: wymagana wartość true/false`);
  for (const [key, domain] of [["entity", "weather"], ["sun_entity", "sun"]]) {
    if (typeof c[key] !== "string" || !new RegExp(`^${domain}\\.[a-z0-9_]+$`).test(c[key])) throw new Error(`Niepoprawna encja: ${key}`);
  }
  // Old route selectors are deliberately discarded: placement defines the scope.
  delete c.target_path; delete c.target_paths; delete c.glass_tint;
  // Standardowy wygląd jest całkowitym wyłączeniem ingerencji w karty.
  if (c.card_effect === "none") {
    c.card_background_transparency = 0;
    c.fade_card_content = false;
    c.card_content_transparency = 0;
    c.card_border = false;
    c.card_shadow = 0;
  }
  return c;
}
const numeric = v => (typeof v === "number" || (typeof v === "string" && v.trim() !== "")) && Number.isFinite(Number(v)) ? Number(v) : null;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function matchesPath(path, target) { return (Array.isArray(target) ? target : [target]).includes(path.replace(/\/$/, "")); }
export function timeOfDay(sun, now = Date.now()) {
  const a = sun?.attributes || {};
  const e = numeric(a.elevation);
  if (sun?.state === "unavailable" || sun?.state === "unknown" || !sun) return "day";
  if (e !== null && e >= -6 && e <= 6) {
    let rising = a.rising;
    if (typeof rising !== "boolean") {
      const rise = Date.parse(a.next_rising), set = Date.parse(a.next_setting);
      rising = Number.isFinite(rise) && Number.isFinite(set) ? Math.abs(rise - now) < Math.abs(set - now) : sun.state === "below_horizon";
    }
    return rising ? "dawn" : "dusk";
  }
  return e !== null ? (e < -6 ? "night" : "day") : sun.state === "below_horizon" ? "night" : "day";
}
export function deriveScene(c, states = {}, now) {
  const weather = states[c.entity];
  const preview = c.preview_weather !== "off";
  const condition = preview ? c.preview_weather : CONDITIONS.includes(weather?.state) ? weather.state : "partlycloudy";
  const raw = preview ? c.preview_cloud_coverage : numeric(weather?.attributes?.cloud_coverage);
  const fallback = { sunny: 0, "clear-night": 0, partlycloudy: 45, windy: 25, "windy-variant": 60 };
  const coverage = clamp(raw ?? fallback[condition] ?? 100, 0, 100);
  return { condition, coverage, storm: ["lightning", "lightning-rainy"].includes(condition), time: c.preview_time === "auto" ? (preview && condition === "clear-night" ? "night" : timeOfDay(states[c.sun_entity], now)) : c.preview_time,
    rain: c.rain && ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(condition),
    hail: c.hail && condition === "hail",
    snow: c.snow && ["snowy", "snowy-rainy"].includes(condition), fog: c.fog && condition === "fog",
    lightning: c.lightning && ["lightning", "lightning-rainy"].includes(condition),
    warning: !preview && (!weather || ["unknown", "unavailable"].includes(weather.state)) ? "Brak danych pogody — zastępcze niebo." : "" };
}
export function quality(c, reduced, mobile) {
  const still = c.animation === "off" || (c.animation === "auto" && reduced);
  const low = c.animation === "reduced" || c.performance === "battery";
  return { fps: still ? 0 : low ? 12 : c.performance === "high" && !mobile ? 30 : 20,
    dpr: low ? 1 : c.performance === "high" && !mobile ? 1.5 : 1,
    particles: low ? 16 : c.performance === "high" && !mobile ? 90 : 36,
    flash: !still && !low && !reduced };
}
const PALETTES = { day: ["#3277a7", "#a9d9ec", "#e4edf2"], night: ["#080e24", "#162c4d", "#4c6380"], dawn: ["#343354", "#be8c9b", "#f3c2a0"], dusk: ["#272d55", "#87698f", "#e3a39b"] };
const fraction = value => value - Math.floor(value);
export function stormFlash(seconds, interval) {
  const cycle=Math.floor(seconds/interval), phase=seconds%interval;
  const start=2+fraction(cycle*.618)*1.1;
  const pulse=(offset,duration) => {const t=(phase-start-offset)/duration;return t>=0&&t<1?Math.sin(t*Math.PI)*Math.exp(-t*1.6):0;};
  return { cycle, strength: Math.max(pulse(0,.36),pulse(.65,.28)*.6) };
}
export function precipitationBudget(c, q, w, h, condition) {
  const area = clamp(Math.sqrt(w * h / 850000), .6, 1.35);
  const density = condition === "pouring" || condition === "lightning-rainy" ? 1.6 : condition === "hail" ? .65 : 1;
  return Math.min(q.particles <= 16 ? 64 : q.particles <= 36 ? 210 : 380, Math.round(q.particles * 3.2 * area * density * c.precipitation_intensity / 100));
}
function precipitationSprites() {
  const sprites = {};
  for (const type of ["rain", "snow", "flake", "hail"]) {
    const canvas = document.createElement("canvas"); canvas.width = type === "rain" ? 24 : 40; canvas.height = type === "rain" ? 96 : 40;
    const ctx = canvas.getContext("2d");
    if (type === "rain") {
      const gradient = ctx.createLinearGradient(0, 0, 0, 96); gradient.addColorStop(0, "rgba(175,211,242,0)"); gradient.addColorStop(.7, "rgba(199,226,250,.65)"); gradient.addColorStop(1, "rgba(232,246,255,1)");
      ctx.strokeStyle = gradient; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(20, 1); ctx.lineTo(4, 91); ctx.stroke();
    } else if (type === "hail") {
      const gradient = ctx.createLinearGradient(9, 7, 29, 33); gradient.addColorStop(0, "#fff"); gradient.addColorStop(.4, "#d9efff"); gradient.addColorStop(1, "#789fbf");
      ctx.fillStyle = gradient; ctx.beginPath();
      for (let j=0;j<7;j++) { const a=j*Math.PI*2/7; const x=20+Math.cos(a)*14, y=20+Math.sin(a)*12; j ? ctx.lineTo(x,y) : ctx.moveTo(x,y); } ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.85)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(11,17);ctx.lineTo(17,10);ctx.lineTo(25,12);ctx.stroke();
    } else {
      const glow=ctx.createRadialGradient(20,20,0,20,20,19);glow.addColorStop(0,"rgba(255,255,255,1)");glow.addColorStop(.3,"rgba(239,248,255,.9)");glow.addColorStop(1,"rgba(221,238,255,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,40,40);
      if(type==="flake") {ctx.strokeStyle="#fff";ctx.lineWidth=1.7;for(let j=0;j<6;j++){ctx.save();ctx.translate(20,20);ctx.rotate(j*Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-14);ctx.moveTo(0,-8);ctx.lineTo(-4,-11);ctx.moveTo(0,-8);ctx.lineTo(4,-11);ctx.stroke();ctx.restore();}}
    }
    sprites[type] = canvas;
  }
  return sprites;
}
// Canvas uses a bounded pixel ratio, no CSS blur, no images, and no network requests.
export class SkyRenderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d", { alpha: false });
    let seed = 87321;
    const random = () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed/4294967296; };
    this.particles = Array.from({length:380}, () => ({x:random(),y:random(),depth:random(),phase:random()*Math.PI*2,cycle:random()}));
  }
  _storm(scene,c,q,seconds) {
    if(!scene.lightning||!q.flash||!c.lightning_strength) return;
    const event=stormFlash(seconds,c.lightning_interval); if(event.strength<=0)return;
    const ctx=this.ctx,w=this.w,h=this.h,intensity=event.strength*c.lightning_strength/100;
    const origin=w*(.2+fraction(event.cycle*.381966)*.6);
    ctx.globalAlpha=intensity*.18;ctx.fillStyle="#c9dbff";ctx.fillRect(0,0,w,h);
    const glow=ctx.createRadialGradient(origin,h*.1,0,origin,h*.1,w*.65);glow.addColorStop(0,"rgba(210,224,255,.65)");glow.addColorStop(1,"rgba(130,160,220,0)");ctx.globalAlpha=intensity;ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    const points=[[origin,-10]];let x=origin;
    for(let i=1;i<=8;i++){x+=(fraction((i+1)*(event.cycle+3)*.754877)-.5)*w*.12;points.push([x,h*(i/8)*.62]);}
    const stroke=(width,color,alpha) => {ctx.lineWidth=width;ctx.strokeStyle=color;ctx.globalAlpha=intensity*alpha;ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.stroke();};
    ctx.lineJoin="round";stroke(9,"#8caaff",.15);stroke(3,"#c0d4ff",.7);stroke(1.1,"#f3f7ff",.95);
    ctx.lineWidth=.8;ctx.globalAlpha=intensity*.55;
    for(const n of [3,5]){const p=points[n];ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(p[0]+w*.055,p[1]+h*.04);ctx.lineTo(p[0]+w*.035,p[1]+h*.12);ctx.stroke();}
    ctx.globalAlpha=1;
  }
  _precipitation(scene, c, q, seconds) {
    if ((!scene.rain && !scene.snow && !scene.hail) || !c.effects_opacity || !c.precipitation_intensity) return;
    if (!this.sprites) this.sprites = precipitationSprites();
    const ctx=this.ctx, w=this.w, h=this.h, t=seconds*c.precipitation_speed/100;
    const count=precipitationBudget(c,q,w,h,scene.condition), opacity=c.effects_opacity/100;
    for(let i=0;i<count;i++) {
      const p=this.particles[i], d=.25+p.depth*.75;
      const snow=scene.snow && (!scene.rain || i%2===0);
      ctx.globalAlpha=opacity*(.35+d*.65);
      if(scene.hail) {
        const ground=h*(.78+p.y*.2), speed=270+d*480;
        const phase=fraction(p.cycle+t*speed/(ground+100));
        let x=fraction(p.x+t*(30+d*35)/(w+70))*(w+70)-35, y;
        if(phase<.78) {const f=phase/.78;y=-30+(ground+30)*f*f;}
        else {const bounce=(phase-.78)/.22;y=ground-(18+d*48)*4*bounce*(1-bounce);x+=bounce*(14+d*24);}
        const size=4+d*7;ctx.drawImage(this.sprites.hail,x-size/2,y-size/2,size,size);
        if(phase>.78 && phase<.83) {const radius=(phase-.78)*140;ctx.strokeStyle="rgba(215,237,255,.65)";ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,ground,radius,radius*.22,0,0,Math.PI*2);ctx.stroke();}
      } else if(snow) {
        const y=fraction(p.y+t*(18+d*63)/(h+35))*(h+35)-18;
        const wind=Math.sin(t*(.45+d*.55)+p.phase)*(12+d*34);
        const x=fraction(p.x+t*(5+d*12)/(w+60))*(w+60)-30+wind;
        const size=3+d*d*12;
        if(d>.75) {ctx.save();ctx.translate(x,y);ctx.rotate(t*.25+p.phase);ctx.drawImage(this.sprites.flake,-size/2,-size/2,size,size);ctx.restore();}
        else ctx.drawImage(this.sprites.snow,x-size/2,y-size/2,size,size);
      } else {
        const heavy=scene.condition==="pouring" || scene.condition==="lightning-rainy";
        const speed=(heavy?700:470)+d*600;
        const y=fraction(p.y+t*speed/(h+100))*(h+100)-60;
        const gust=45+Math.sin(t*.55)*12;
        const x=fraction(p.x-t*(gust+d*45)/(w+100))*(w+100)-50;
        const length=(heavy?28:18)+d*44;
        ctx.drawImage(this.sprites.rain,x,y,5+d*9,length);
        if(i%6===0) {const pulse=fraction(p.cycle+t*(heavy?2.3:1.7));if(pulse<.24){ctx.globalAlpha=opacity*(1-pulse/.24)*.38;ctx.strokeStyle="#cde9ff";ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(p.x*w,h*(.91+p.y*.08),2+pulse*32,1+pulse*5,0,Math.PI,Math.PI*2);ctx.stroke();}}
      }
    }
    ctx.globalAlpha=1;
  }
  resize(w, h, dpr) {
    this.w = Math.max(1, w); this.h = Math.max(1, h);
    this.canvas.width = Math.round(this.w * dpr); this.canvas.height = Math.round(this.h * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  draw(scene, c, q, seconds) {
    const ctx = this.ctx; if (!ctx) return;
    const w = this.w, h = this.h;
    const p = scene.storm ? (scene.time === "night" ? ["#070d1c","#17273e","#354759"] : ["#142235","#34495e","#6b7d89"]) : PALETTES[scene.time];
    ctx.globalAlpha = 1;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, p[0]); sky.addColorStop(0.65, p[1]); sky.addColorStop(1, p[2]);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    if (scene.time === "night" && !scene.storm) {
      ctx.globalAlpha = (1 - scene.coverage / 100) * .65;
      ctx.fillStyle = "#e4eeff";
      for (let i = 0; i < 55; i++) ctx.fillRect(((i * 137.51) % 997) / 997 * w, ((i * 73.7) % 431) / 431 * h * .65, 1.4, 1.4);
    }
    const darkness = scene.coverage / 100 * (scene.time === "night" ? .2 : .36);
    ctx.globalAlpha = darkness; ctx.fillStyle = "#25364c"; ctx.fillRect(0, 0, w, h);
    const coverage=scene.storm?Math.max(85,scene.coverage):scene.coverage;
    if (c.clouds && coverage > 0) {
      for (let layer = 0; layer < 2; layer++) {
        const speed = layer ? c.cloud_speed_secondary : c.cloud_speed;
        for (let i = 0; i < 7; i++) {
          const size = w * (.24 + (i % 3) * .09);
          const x = (((i / 6 + seconds / speed * (scene.storm?2.1:1.5) * (layer ? -1 : 1)) % 1.5 + 1.5) % 1.5 - .25) * w;
          const y = h * (.06 + ((i * .137 + layer * .23) % .55));
          ctx.save(); ctx.translate(x, y); ctx.scale(1, .38);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          const color = scene.storm ? "103,123,146" : scene.time === "night" ? "149,168,198" : "239,245,248";
          g.addColorStop(0, `rgba(${color},.8)`); g.addColorStop(.55, `rgba(${color},.38)`); g.addColorStop(1, `rgba(${color},0)`);
          ctx.globalAlpha = coverage / 100 * c.cloud_opacity / 100 * (scene.storm ? .9 : .66);
          ctx.fillStyle = g; ctx.fillRect(-size, -size, size * 2, size * 2); ctx.restore();
        }
      }
    }
    ctx.globalAlpha = c.effects_opacity / 100;
    this._precipitation(scene, c, q, seconds);
    ctx.globalAlpha = c.effects_opacity / 100;
    if (scene.fog) {
      const fog = ctx.createLinearGradient(0, 0, 0, h);
      fog.addColorStop(0, "rgba(200,215,225,.12)"); fog.addColorStop(1, "rgba(215,226,232,.8)");
      ctx.fillStyle = fog; ctx.fillRect(0, 0, w, h);
    }
    this._storm(scene,c,q,seconds);
    ctx.globalAlpha = 1;
  }
}
function composedParent(node) { return node.parentElement || node.getRootNode?.().host || null; }
export function fadeGradient(image, factor) {
  if (!/gradient\(/.test(image) || /url\(/.test(image)) return image;
  return image.replace(/rgba?\([^)]*\)/g, color => `color-mix(in srgb, ${color} ${factor * 100}%, transparent)`);
}
export function glassBlur(c,mobile) {
  if(c.performance==="battery"||c.card_effect==="soft"||c.card_effect==="none")return 0;
  return Math.min(mobile?8:24,c.glass_blur*(c.card_effect==="frosted"?1.5:1));
}
// Only touches surfaces inside the selected view; every inline property is reversible.
export class ViewCardStyles {
  constructor(view) { this.view = view; this.saved = new Map(); this.observers = []; this.dirty = true; this.bases = new WeakMap(); }
  _set(el, property, value) {
    let record = this.saved.get(el);
    if (!record) { record = new Map(); record.hadStyleAttribute = el.hasAttribute("style"); this.saved.set(el, record); }
    if (!record.has(property)) record.set(property, { value: el.style.getPropertyValue(property), priority: el.style.getPropertyPriority(property) });
    el.style.setProperty(property, value, "important"); record.get(property).applied = el.style.getPropertyValue(property);
  }
  _border(el,visible) {
    for(const side of ["top","right","bottom","left"]) {
      this._set(el,`border-${side}-width`,visible?"1px":"0px");
      if(visible) {
        this._set(el,`border-${side}-style`,"solid");
        this._set(el,`border-${side}-color`,"color-mix(in srgb, var(--primary-text-color, white) 32%, transparent)");
      }
    }
  }
  restore() {
    if(this.pending!==undefined)cancelAnimationFrame(this.pending);this.pending=undefined;
    for (const observer of this.observers) observer.disconnect(); this.observers = [];
    for (const [el, record] of this.saved) {
      for (const [property, original] of record) {
      // Preserve a newer inline edit made by another component while the effect was active.
      if (el.style.getPropertyValue(property) !== original.applied || el.style.getPropertyPriority(property) !== "important") {
        if(["background-color","background-image","opacity"].includes(property))this.bases.delete(el);
        continue;
      }
      if (original.value) el.style.setProperty(property, original.value, original.priority);
      else el.style.removeProperty(property);
      }
      if (!record.hadStyleAttribute && !el.style.length) el.removeAttribute("style");
    }
    this.saved.clear(); this.key = undefined; this.dirty = true;
  }
  apply(c) {
    this.config=c;
    const mobile=matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const key = JSON.stringify([c.card_background_transparency,c.fade_card_content,c.card_content_transparency,c.card_effect,c.glass_blur,c.glass_shine,c.card_border,c.card_shadow,c.performance,mobile,c._sceneContrast]);
    if (this.key === key && !this.dirty) return;
    this.restore(); this.key = key; this.dirty = false;
    if (c.card_effect==="none") return;
    const roots = [this.view], surfaces = [], wrappers = [], details = [], fills = [];
    const seen = new Set();
    while (roots.length) {
      const root = roots.shift(); if (seen.has(root)) continue; seen.add(root);
      const observer = new MutationObserver(records => {
        this.dirty = true;
        for(const record of records) {
          if(record.type==="attributes")this.bases.delete(record.target);
          const node=record.target.nodeType===3?record.target.parentElement:record.target;
          if(node?.localName==="style")this.bases=new WeakMap();
        }
        if(this.pending===undefined)this.pending=requestAnimationFrame(()=>{this.pending=undefined;if(this.view.isConnected)this.apply(this.config);});
      });
      observer.observe(root, { childList: true, characterData:true, subtree: true, attributes:true,attributeFilter:["style","class"] }); this.observers.push(observer);
      for (const el of root.querySelectorAll("*")) {
        if (el.localName === "dynamic-weather-background" || el.hasAttribute("data-dynamic-weather-background")) continue;
        // Keep native section heading cards untouched by the weather glass styling.
        let headingNode = el, isHeading = false;
        while (headingNode && headingNode !== this.view) {
          if (headingNode.localName === "hui-heading-card") { isHeading = true; break; }
          headingNode = composedParent(headingNode);
        }
        if (isHeading) continue;
        if (el.shadowRoot) roots.push(el.shadowRoot);
        if (el.matches("ha-card, .bubble-button-card-container, .bubble-climate-container")) surfaces.push(el);
        if(el.matches(".bubble-icon-container, .bubble-sub-button, .bubble-climate-button, .bubble-temperature-container, .bubble-sub-slider-background, .box"))details.push(el);
        if(el.matches(".bubble-button-background, .bubble-climate-background"))fills.push(el);
        if (el.localName === "hui-card") wrappers.push(el);
      }
    }
    const ownController = el => {
      for (let node = el; node && node !== this.view; node = composedParent(node)) if (node.localName === "dynamic-weather-background") return true;
      return !!el.querySelector?.("dynamic-weather-background");
    };
    const factor = clamp(1 - c.card_background_transparency / 100 + (c.card_effect === "glass" ? (c._sceneContrast || 0) : 0), .15, 1);
    // A native background transition can expose our previous, already faded color
    // through getComputedStyle. Cancel it before measuring or applying the effect.
    // Ownership tracking restores the card's original transition on cleanup.
    for(const el of [...surfaces,...details,...fills,...wrappers])if(!ownController(el))this._set(el,"transition","none");
    for(const el of [...surfaces,...details,...fills,...wrappers])if(!this.bases.has(el)) {
      const style=getComputedStyle(el);this.bases.set(el,{color:style.backgroundColor,image:style.backgroundImage,opacity:Number.parseFloat(style.opacity)||0});
    }
    const mains=surfaces.filter(el=>el.localName!=="ha-card"),outerShells=new Set(),fillOwners=new Map();
    const nearestMain=el=>{for(let node=composedParent(el);node&&node!==this.view;node=composedParent(node))if(mains.includes(node))return node;return null;};
    for(const main of mains)for(let node=composedParent(main);node&&node!==this.view;node=composedParent(node))if(node.localName==="ha-card"){outerShells.add(node);break;}
    for(const fill of fills){const main=nearestMain(fill);if(main)fillOwners.set(fill,main);}
    const paintBases=new Map();
    for(const main of mains) {
      let base=this.bases.get(main);
      if(base.color==="rgba(0, 0, 0, 0)"||base.color==="transparent")for(const [fill,owner]of fillOwners)if(owner===main){const candidate=this.bases.get(fill);if(candidate.color!=="rgba(0, 0, 0, 0)"&&candidate.color!=="transparent"){base=candidate;break;}}
      paintBases.set(main,base);
      if(!ownController(main)){this._set(main,"background-color",base.color);this._set(main,"background-image",base.image);}
    }
    for(const el of [...outerShells,...fillOwners.keys()])if(!ownController(el)){this._set(el,"background-color","transparent");this._set(el,"background-image","none");}
    if(c.card_effect!=="none") {
      for(const el of surfaces) {
        if(ownController(el))continue;
        if(outerShells.has(el)) {
          // Bubble supplies its own rounded surface; avoid a second glass rectangle around it.
          for(const [property,value] of Object.entries({"background-color":"transparent","background-image":"none","box-shadow":"none","backdrop-filter":"none","-webkit-backdrop-filter":"none"}))this._set(el,property,value);
          this._border(el,false);
          continue;
        }
        if(c.card_effect!=="soft") {
          const shine=c.glass_shine/100*.28;
          this._set(el,"background-color","rgb(from var(--card-background-color, #1c1c1c) r g b / 1)");
          this._set(el,"background-image",`linear-gradient(145deg, rgba(255,255,255,${shine}), rgba(255,255,255,0) 55%)`);
          const filter=`blur(${glassBlur(c,mobile)}px) saturate(1.15)`;
          this._set(el,"backdrop-filter",filter);this._set(el,"-webkit-backdrop-filter",filter);
        }
        this._border(el,c.card_border);
        this._set(el,"box-shadow",c.card_shadow?`0 ${Math.round(2+4*c.card_shadow/100)}px ${Math.round(3+13*c.card_shadow/100)}px ${Math.round(2*c.card_shadow/100)}px rgba(0,0,0,${(.02+.73*Math.pow(c.card_shadow/100,1.3)).toFixed(3)}), 0 1px 3px rgba(0,0,0,${(.02+.28*c.card_shadow/100).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,.12)`:"none");
      }
    }
    if (c.card_background_transparency || c.card_effect!=="none") for (const el of [...surfaces,...details]) {
      if (ownController(el)||outerShells.has(el)) continue;
      const style = c.card_effect!=="none"&&c.card_effect!=="soft"&&surfaces.includes(el)?getComputedStyle(el):null;
      const base=paintBases.get(el)||this.bases.get(el);
      const color = style?style.backgroundColor:base.color, image = style?style.backgroundImage:base.image;
      this._set(el, "background-color", (color==="transparent" || color==="rgba(0, 0, 0, 0)")?"transparent":`rgb(from ${color} r g b / ${factor})`);
      const faded = fadeGradient(image, factor);
      if (faded !== image) this._set(el, "background-image", faded);
    }
    if (c.fade_card_content && c.card_content_transparency) {
      // Foregrounds only: ancestor opacity would fade the painted backgrounds twice.
      const contentFactor=1-c.card_content_transparency/100, targets=[];
      const inCard=el=>{for(let n=el;n&&n!==this.view;n=composedParent(n))if(surfaces.includes(n))return true;return false;};
      for(const root of seen)for(const el of root.querySelectorAll("*")) {
        if(ownController(el)||!inCard(el)||el.closest("svg,script,style"))continue;
        if(el.matches("img,video,canvas"))targets.push([el,"opacity",String(Number.parseFloat(getComputedStyle(el).opacity)*contentFactor)]);
        else if([...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))targets.push([el,"color",`rgb(from ${getComputedStyle(el).color} r g b / calc(alpha * ${contentFactor}))`]);
      }
      for(const root of seen)for(const el of root.querySelectorAll("svg"))if(!ownController(el)&&inCard(el)&&!el.parentElement?.closest("svg")) {
        const style=getComputedStyle(el);
        targets.push([el,"color",style.color],[el,"opacity",String(Number.parseFloat(style.opacity)*contentFactor)]);
      }
      for(const [el,property,value]of targets)this._set(el,property,value);
    }
    // Our own style writes must not trigger another pass or become a new baseline.
    for(const observer of this.observers)observer.takeRecords();
  }
}
export function findView(node) {
  for (let el = composedParent(node); el; el = composedParent(el)) {
    if (["hui-card-preview", "hui-dialog-edit-card", "ha-dialog", "dialog"].includes(el.localName)) return null;
    if (el.localName === "hui-view") return el;
  }
  return null;
}
const owners = new WeakMap();
export class DynamicWeatherBackground extends HTMLElement {
  static getConfigElement() { return document.createElement("dynamic-weather-background-editor"); }
  static getStubConfig() { return { ...DEFAULTS }; }
  constructor() {
    super(); this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>:host{display:block}ha-card{padding:12px;font:14px sans-serif}canvas{width:100%;height:180px;display:block;border-radius:12px}p{margin:8px 0}</style><ha-card><strong>Dynamic Weather Background · ${VERSION}</strong><p></p><canvas aria-hidden="true"></canvas></ha-card>`;
    this._sync = this._sync.bind(this); this._resize = this._resize.bind(this);
    this._frame = this._frame.bind(this); this._last = 0; this._seconds = 0;
    this._previewOverride = null; this._transitionDuration = 12000;
  }
  setConfig(input) { this._config = normalizeConfig(input); this._sync(); }
  set hass(value) { this._hass = value; this._sync(); }
  set preview(value) { this._preview = value; this._sync(); }
  getCardSize() { return this._config?.hide_card && !this._preview ? 0 : 1; }
  getGridOptions() { return { columns: 12, rows: 1, min_rows: 1 }; }
  connectedCallback() {
    if (this._abort) return;
    this._abort = new AbortController(); const signal = this._abort.signal;
    for (const event of ["location-changed", "popstate", "hashchange", "pageshow"]) window.addEventListener(event, this._sync, { signal });
    window.addEventListener("resize", this._resize, { signal });
    document.addEventListener("visibilitychange", this._sync, { signal });
    window.addEventListener("dynamic-weather-temporary-preview", event => { if (event.detail?.path !== location.pathname) return; this._previewOverride = event.detail.preview; this._sync(); }, { signal });
    this._motion = matchMedia("(prefers-reduced-motion: reduce)");
    this._mobile = matchMedia("(max-width: 767px), (pointer: coarse)");
    this._motion.addEventListener("change", this._sync, { signal });
    this._mobile.addEventListener("change", this._sync, { signal });
    // Fallback for routers/custom views that do not emit HA's location-changed.
    this._timer = setInterval(this._sync, 1500);
    this._sync();

  }
  disconnectedCallback() {
    clearInterval(this._timer); this._timer = undefined;
    this._abort?.abort(); this._abort = undefined;
    this._stop(); this._detach(); this._renderer = undefined; this._canvas = undefined; this._sizedRenderer = undefined;
    this._restoreWrapper(); this._boundPath = undefined; this._transitionSnapshot = undefined; this._previewOverride = null;
  }
  _restoreWrapper() {
    if (this._wrapper && this._wrapper.style.getPropertyValue("display") === "none") {
      if (this._wrapperDisplay.value) this._wrapper.style.setProperty("display", this._wrapperDisplay.value, this._wrapperDisplay.priority);
      else this._wrapper.style.removeProperty("display");
    }
    this._wrapper = undefined;
  }
  _visibility(editing) {
    const hide = this._config.hide_card && !editing;
    this.style.display = hide ? "none" : "block";
    if (!hide) { this._restoreWrapper(); return; }
    if (!this._wrapper) {
      let wrapper;
      for (let node = composedParent(this); node && node.localName !== "hui-view"; node = composedParent(node)) {
        if (node.localName === "hui-card") wrapper = node;
        if (node.classList?.contains("card") && node.getRootNode?.().host?.localName === "hui-grid-section") { wrapper = node; break; }
      }
      if (wrapper) {
        this._wrapper = wrapper;
        this._wrapperDisplay = { value: wrapper.style.getPropertyValue("display"), priority: wrapper.style.getPropertyPriority("display") };
        wrapper.style.setProperty("display", "none", "important");
      }
    }
  }
  _stop() { if (this._raf !== undefined) cancelAnimationFrame(this._raf); this._raf = undefined; this._last = 0; }
  _detach() {
    this._cardStyles?.restore(); this._cardStyles = undefined;
    this._portal?.remove(); this._portal = undefined;
    if (this._view && owners.get(this._view) === this) {
      if (this._view.style.getPropertyValue("isolation") === "isolate" && this._view.style.getPropertyPriority("isolation") === "important") {
        if (this._oldIsolation.value) this._view.style.setProperty("isolation", this._oldIsolation.value, this._oldIsolation.priority);
        else this._view.style.removeProperty("isolation");
      }
      owners.delete(this._view);
    }
    this._view = undefined;
  }
  _sync() {
    if (!this.isConnected || !this._config || !this._abort) return;
    const c = this._config;
    const ancestorView = findView(this);
    this._visibility(!!this._preview || !!ancestorView?.lovelace?.editMode || !ancestorView);
    const view = !this._preview && ancestorView;
    if (view && !this._boundPath) {
      const config = view.lovelace?.config?.views?.[view.index];
      this._boundPath = config ? '/' + location.pathname.split('/')[1] + '/' + (config.path || view.index) : location.pathname.replace(/\/$/, '');
    }
    const active = view && matchesPath(location.pathname, this._boundPath) && view.getClientRects().length > 0 && getComputedStyle(view).visibility !== "hidden";
    const full = active && (!owners.has(view) || owners.get(view) === this);
    if (this._view && (this._view !== view || !full)) { this._stop(); this._detach(); }
    if (full && !this._portal) {
      this._view = view; owners.set(view, this);
      this._oldIsolation = { value: view.style.getPropertyValue("isolation"), priority: view.style.getPropertyPriority("isolation") };
      // Only the selected view becomes a stacking context. No card CSS is changed.
      view.style.setProperty("isolation", "isolate", "important");
      this._portal = document.createElement("div"); this._portal.dataset.dynamicWeatherBackground = VERSION;
      this._portal.setAttribute("aria-hidden", "true");
      Object.assign(this._portal.style, { position: "fixed", inset: "0", zIndex: "-1", pointerEvents: "none", overflow: "hidden" });
      const root = this._portal.attachShadow({ mode: "open" });
      root.innerHTML = "<style>canvas{display:block;width:100%;height:100%}</style><canvas></canvas>";
      view.prepend(this._portal);
    }
    if (full && !this._cardStyles) this._cardStyles = new ViewCardStyles(view);
    const canvas = full ? this._portal.shadowRoot.querySelector("canvas") : this.shadowRoot.querySelector("canvas");
    const card = this.shadowRoot.querySelector("ha-card");
    // The controller is visible in edit mode; its own wrapper is removed from normal layout.
    this.shadowRoot.querySelector("canvas").hidden = !!full || !!ancestorView;
    this.shadowRoot.querySelector("canvas").style.display = full || ancestorView ? "none" : "block";
    card.querySelector("p").textContent = full ? "Tło aktywne tylko na tej stronie" : active ? "Tło obsługuje już inna karta w tym widoku." : "Ta karta steruje tłem tylko strony, na której ją dodasz.";
    const previewConfig = this._previewOverride ? { ...c, ...this._previewOverride } : c;
    const nextScene = deriveScene(previewConfig, this._hass?.states);
    const sceneKey = JSON.stringify([nextScene.condition,nextScene.time,nextScene.coverage,nextScene.storm,nextScene.rain,nextScene.snow,nextScene.hail,nextScene.fog,nextScene.lightning]);
    if (this._sceneKey && this._sceneKey !== sceneKey && this._canvas?.width && this._canvas?.height && this._q?.fps) {
      const snapshot = document.createElement("canvas"); snapshot.width=this._canvas.width; snapshot.height=this._canvas.height;
      snapshot.getContext("2d")?.drawImage(this._canvas,0,0);
      this._transitionSnapshot=snapshot; this._transitionStart=performance.now();
    }
    this._sceneKey = sceneKey; this._scene = nextScene;
    if (full && this._cardStyles) {
      const contrast = nextScene.time === "day" ? .13 : nextScene.time === "night" ? -.08 : .05;
      const sceneContrast = Math.round((contrast + nextScene.coverage / 100 * .03) * 40) / 40;
      this._cardStyles.apply({ ...c, _sceneContrast: sceneContrast });
    }
    if (this._scene.warning) card.querySelector("p").textContent += ` · ${this._scene.warning}`;
    this._q = quality(c, !!this._motion?.matches, !!this._mobile?.matches);
    if (canvas !== this._canvas) { this._stop(); this._canvas = canvas; this._renderer = new SkyRenderer(canvas); }
    this._resize();
    if (document.hidden || (view && !active) || (this.style.display === "none" && !full)) { this._stop(); return; }
    if (!this._q.fps) { this._stop(); this._paint(0); }
    else if (this._raf === undefined) this._raf = requestAnimationFrame(this._frame);
  }
  _resize() {
    if (!this._renderer || !this._q) return;
    const rect = this._canvas.getBoundingClientRect();
    const w = this._portal ? window.innerWidth : rect.width || 360;
    const h = this._portal ? window.innerHeight : 180;
    const dpr = Math.min(window.devicePixelRatio || 1, this._q.dpr);
    const key = `${w},${h},${dpr}`;
    if (this._size !== key || this._renderer !== this._sizedRenderer) {
      this._size = key; this._sizedRenderer = this._renderer; this._renderer.resize(w, h, dpr);
    }
    if (this._scene) this._paint(this._q.fps ? this._seconds : 0);
  }
  _paint(seconds) {
    if (!this._renderer || !this._scene) return;
    this._renderer.draw(this._scene, this._config, this._q, seconds);
    if (this._transitionSnapshot) {
      const progress = Math.min(1,(performance.now()-this._transitionStart)/this._transitionDuration);
      const ctx=this._renderer.ctx;
      if (progress>=1 || this._transitionSnapshot.width!==this._canvas.width || this._transitionSnapshot.height!==this._canvas.height) this._transitionSnapshot=undefined;
      else { ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha=1-progress; ctx.drawImage(this._transitionSnapshot,0,0); ctx.restore(); }
    }
  }
  _frame(now) {
    this._raf = undefined;
    if (!this.isConnected || document.hidden || !this._q?.fps) return;
    // Route check before every draw avoids one-frame leakage during navigation.
    if (this._portal && !matchesPath(location.pathname, this._boundPath)) { this._sync(); return; }
    if (!this._last) this._last = now;
    const elapsed = now - this._last;
    if (elapsed >= 1000 / this._q.fps) {
      this._seconds += Math.min(elapsed, 250) / 1000; this._last = now;
      this._paint(this._seconds);
    }
    this._raf = requestAnimationFrame(this._frame);
  }
}
const LABELS = {
  card_effect: "Efekt wyglądu kart",
  glass_blur: "Rozmycie szkła (px)",
  glass_shine: "Połysk szkła (%)",
  card_border: "Delikatne obramowanie",
  card_shadow: "Siła cienia (%)",
  lightning_strength: "Siła błyskawic (%)",
  lightning_interval: "Odstęp między wyładowaniami (s)",
  precipitation_intensity: "Intensywność opadów (%)",
  precipitation_speed: "Prędkość opadów (%)",
  card_background_transparency: "Przezroczystość teł kart (%)",
  fade_card_content: "Włącz dodatkową przezroczystość tekstu, ikon i multimediów",
  card_content_transparency: "Przezroczystość tekstu, ikon i multimediów (%)",
  hide_card: "Ukryj kartę poza trybem edycji",
  entity: "Encja pogody", sun_entity: "Encja Słońca", 
  cloud_speed: "Czas przesuwania chmur — warstwa 1 (s)", cloud_speed_secondary: "Czas przesuwania chmur — warstwa 2 (s)",
  cloud_opacity: "Widoczność chmur (%)", effects_opacity: "Widoczność opadów i mgły (%)",
  clouds: "Chmury", rain: "Deszcz", snow: "Śnieg", hail: "Grad", fog: "Mgła", lightning: "Błyskawice podczas burzy i burzy z deszczem",
  animation: "Animacje", performance: "Wydajność", preview_weather: "Test pogody (tylko do zamknięcia edytora)",
  preview_time: "Podgląd pory dnia", preview_cloud_coverage: "Zachmurzenie w podglądzie (%)"
};
const OPTION_LABELS = { none:"Standardowy (bez efektu)",glass:"Glass — przezroczyste szkło",frosted:"Frosted — matowe szkło",soft:"Soft — obramowanie i cień", auto: "Automatycznie", reduced: "Ograniczone", off: "Wyłączone", high: "Wysoka", balanced: "Zrównoważona", battery: "Oszczędzanie energii", day: "Dzień", night: "Noc", dawn: "Świt", dusk: "Zmierzch", sunny: "Słonecznie", "clear-night": "Bezchmurna noc", partlycloudy: "Częściowe zachmurzenie", cloudy: "Pochmurno", rainy: "Deszcz", pouring: "Ulewa", snowy: "Śnieg", "snowy-rainy": "Deszcz ze śniegiem", fog: "Mgła", lightning: "Burza", "lightning-rainy": "Burza z deszczem", windy: "Wiatr", "windy-variant": "Wiatr i chmury", hail: "Grad", exceptional: "Wyjątkowe warunki" };
export const SETTINGS_GROUPS = [
  {name:"Podstawowe",keys:["entity","sun_entity","hide_card"]},
  {name:"Wygląd kart",keys:["card_effect","glass_blur","glass_shine","card_border","card_shadow","card_background_transparency","fade_card_content","card_content_transparency"]},
  {name:"Niebo i chmury",keys:["clouds","cloud_opacity","cloud_speed","cloud_speed_secondary"]},
  {name:"Opady i mgła",keys:["rain","snow","hail","fog","precipitation_intensity","precipitation_speed","effects_opacity"]},
  {name:"Burza i błyskawice",keys:["lightning","lightning_strength","lightning_interval"]},
  {name:"Animacja i wydajność",keys:["animation","performance"]},
  {name:"Podgląd i testowanie",keys:["preview_weather","preview_time","preview_cloud_coverage"]}
];
export class DynamicWeatherBackgroundEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  setConfig(c) { this._config = normalizeConfig(c); this._build(); }
  set hass(h) { this._hass = h; this._entities(); this._diagnostics(); }
  _emit() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: { ...this._config, type: "custom:dynamic-weather-background" } }, bubbles: true, composed: true }));
  }
  _entities() {
    if (!this._built) return;
    for (const domain of ["weather", "sun"]) {
      const list = this.shadowRoot.getElementById(`${domain}-entities`); list.replaceChildren();
      for (const id of Object.keys(this._hass?.states || {}).filter(id => id.startsWith(`${domain}.`)).sort()) {
        const option = document.createElement("option"); option.value = id; list.append(option);
      }
    }
  }
  _build() {
    if (!this._config) return;
    if (!this._built) {
      this.shadowRoot.innerHTML = `<style>:host{display:block;color:var(--primary-text-color);font:14px sans-serif}label{display:grid;gap:6px;margin:14px 0}input,select{box-sizing:border-box;width:100%;padding:9px;font:inherit;color:inherit;background:var(--card-background-color,#fff);border:1px solid #888;border-radius:6px}input[type=checkbox]{width:22px;height:22px}small{opacity:.75}#error{color:var(--error-color,#b00020)}fieldset{border:0;padding:0}legend{font-weight:bold;margin-top:16px}</style><p>Dynamic Weather Background ${VERSION}</p><small>Niższy czas = szybsze chmury. „Automatycznie” respektuje systemowe ograniczenie ruchu. Podgląd nie zmienia encji HA.</small><fieldset><legend>Ustawienia</legend></fieldset><p id="error" role="alert"></p><datalist id="weather-entities"></datalist><datalist id="sun-entities"></datalist>`;
      this.shadowRoot.querySelector("fieldset").remove();
      const hiddenStyle=document.createElement("style");hiddenStyle.textContent="[hidden]{display:none!important}";this.shadowRoot.append(hiddenStyle);
      const groups=new Map();
      for(const group of SETTINGS_GROUPS) {
        const details=document.createElement("details");details.open=!!group.open;
        const summary=document.createElement("summary");summary.textContent=group.name;summary.style.cssText="font-weight:600;padding:12px 0;cursor:pointer";
        const fieldset=document.createElement("fieldset");fieldset.setAttribute("aria-label",group.name);
        details.append(summary,fieldset);this.shadowRoot.append(details);
        for(const key of group.keys)groups.set(key,fieldset);
      }
      for (const key of SETTINGS_GROUPS.flatMap(group=>group.keys)) {
        const label = document.createElement("label"); label.dataset.setting=key; label.textContent = LABELS[key];
        const control = document.createElement(ENUMS[key] ? "select" : "input"); control.dataset.key = key;
        if (ENUMS[key]) for (const value of ENUMS[key]) {
          const option = document.createElement("option"); option.value = value; option.textContent = OPTION_LABELS[value] || value; control.append(option);
        }
        else if (RANGES[key]) { control.type = ["card_background_transparency", "card_content_transparency", "precipitation_intensity", "precipitation_speed", "lightning_strength", "glass_blur", "glass_shine", "card_shadow"].includes(key) ? "range" : "number"; control.min = RANGES[key][0]; control.max = RANGES[key][1]; control.step = "1"; }
        else if (typeof DEFAULTS[key] === "boolean") control.type = "checkbox";
        else { control.type = "text"; if (key === "entity" || key === "sun_entity") control.setAttribute("list", `${key === "entity" ? "weather" : "sun"}-entities`); }
        control.addEventListener("change", () => {
          const value = control.type === "checkbox" ? control.checked : ["number", "range"].includes(control.type) ? control.value === "" ? NaN : Number(control.value) : control.value;
          if (["preview_weather","preview_time","preview_cloud_coverage"].includes(key)) {
            this._temporary = { ...(this._temporary || {}), [key]: value };
            window.dispatchEvent(new CustomEvent("dynamic-weather-temporary-preview", { detail: { path: location.pathname, preview: this._temporary } }));
            this._diagnostics(); return;
          }
          try {
            const next = normalizeConfig({ ...this._config, [key]: value });
            this._config = next; this._build(); this.shadowRoot.getElementById("error").textContent = "";
            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: { ...next, type: "custom:dynamic-weather-background" } }, bubbles: true, composed: true }));
          } catch (error) { this.shadowRoot.getElementById("error").textContent = error.message; }
        });
        label.append(control);
        if (control.type === "range") {
          const output = document.createElement("output"); output.dataset.outputFor = key;
          control.addEventListener("input", () => { output.textContent = `${control.value}${key==="glass_blur"?" px":"%"}`; }); label.append(output);
          const hint = document.createElement("small"); hint.textContent = key.startsWith("glass_") || key==="card_shadow" ? "Dotyczy wybranego efektu kart. Wyższa wartość wzmacnia efekt. Na telefonie rozmycie ma limit 8 px." : key==="lightning_strength" ? "Siła rozświetlenia nieba i widoczność rozgałęzionego pioruna. Ograniczenie ruchu wyłącza błyskawice." : key.startsWith("precipitation_") ? "100% = normalne opady. Wyższa wartość zwiększa intensywność lub prędkość." : "0% = pełne krycie koloru, 100% = całkowita przezroczystość. Rozmycie i połysk nie zmieniają tego ustawienia."; label.append(hint);
        }
        groups.get(key).append(label);
      }
      const diagnostic=document.createElement("details");diagnostic.innerHTML='<summary style="font-weight:600;padding:12px 0;cursor:pointer">Diagnostyka na żywo</summary><pre id="weather-diagnostics" style="white-space:pre-wrap;font:12px monospace"></pre>';
      this.shadowRoot.append(diagnostic);
      const reset = document.createElement("button"); reset.type = "button"; reset.textContent = "Zakończ test i wróć do pogody na żywo";
      reset.addEventListener("click", () => {
        this._temporary=null; window.dispatchEvent(new CustomEvent("dynamic-weather-temporary-preview", {detail:{path:location.pathname,preview:null}})); this._build(); this._diagnostics();
      });
      groups.get("preview_weather").append(reset);
      this._built = true; this._entities(); this._diagnostics();
    }
    for (const control of this.shadowRoot.querySelectorAll("[data-key]")) {
      if (control.type === "checkbox") control.checked = this._config[control.dataset.key];
      else control.value = this._config[control.dataset.key];
    }
    for (const output of this.shadowRoot.querySelectorAll("[data-output-for]")) output.textContent = `${this._config[output.dataset.outputFor]}${output.dataset.outputFor==="glass_blur"?" px":"%"}`;
    this._dependencies(); this._diagnostics();
  }
  disconnectedCallback() {
    this._temporary=null;
    window.dispatchEvent(new CustomEvent("dynamic-weather-temporary-preview", {detail:{path:location.pathname,preview:null}}));
  }
  _diagnostics() {
    const el=this.shadowRoot.getElementById("weather-diagnostics"); if (!el || !this._hass) return;
    const c={...this._config,...(this._temporary||{})}; const weather=this._hass.states[c.entity]; const sun=this._hass.states[c.sun_entity];
    const scene=deriveScene(c,this._hass.states);
    el.textContent=`Źródło: ${c.entity}\nPogoda: ${weather?.state || "brak danych"}\nScena: ${scene.condition}${this._temporary ? " (TYLKO PODGLĄD)" : ""}\nPora dnia: ${scene.time}\nZachmurzenie: ${Math.round(scene.coverage)}%\nSłońce: ${sun?.attributes?.elevation ?? "brak danych"}°\nOpady: ${scene.rain?"deszcz ":""}${scene.snow?"śnieg ":""}${scene.hail?"grad":""}\nBurza: ${scene.lightning?"tak":"nie"}\nGlass: ${c.card_effect === "glass" ? "kontrast automatyczny" : "nieaktywny"}\nPrzejście: 12 s`;
  }
  _dependencies() {
    for(const key of ["lightning_strength","lightning_interval","card_content_transparency"]) {
      const input=this.shadowRoot.querySelector(`[data-key="${key}"]`);
      if(input) {input.disabled=key==="card_content_transparency"?(this._config.card_effect==="none" || !this._config.fade_card_content):!this._config.lightning;input.closest("label").hidden=input.disabled;}
    }
    for(const key of ["card_background_transparency","fade_card_content","glass_blur","glass_shine","card_border","card_shadow"]) {
      const input=this.shadowRoot.querySelector(`[data-key="${key}"]`);
      if(input) {input.disabled=this._config.card_effect==="none" || (["glass_blur","glass_shine"].includes(key)&&this._config.card_effect==="soft");input.closest("label").hidden=input.disabled;}
    }
  }
}
if (!customElements.get("dynamic-weather-background")) customElements.define("dynamic-weather-background", DynamicWeatherBackground);
if (!customElements.get("dynamic-weather-background-editor")) customElements.define("dynamic-weather-background-editor", DynamicWeatherBackgroundEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === "dynamic-weather-background")) window.customCards.push({ type: "dynamic-weather-background", name: "Dynamic Weather Background", description: "Dynamiczne tło wybranego widoku: pogoda, chmury i Słońce.", preview: true });
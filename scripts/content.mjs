#!/usr/bin/env node
/**
 * Interactive editor for everything that isn't brand/contact (that's `npm run setup`):
 *
 *   npm run content
 *
 * Properties, locations, images, hero text, price filters and section toggles.
 * Properties, locations and images are stored in /content/*.json, so you can also
 * edit those files by hand. Every change is saved immediately.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { stdin, stdout, exit, cwd } from "node:process";

const P = (...p) => path.join(cwd(), ...p);
const FILES = {
  listings: P("content", "listings.json"),
  locations: P("content", "locations.json"),
  images: P("content", "images.json"),
  config: P("site.config.ts"),
  next: P("next.config.ts"),
  client: P("public", "client"),
};

for (const key of ["listings", "locations", "images", "config"]) {
  if (!fs.existsSync(FILES[key])) {
    console.error(`Missing ${path.relative(cwd(), FILES[key])}. Run this from the project root.`);
    exit(1);
  }
}

const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const writeJson = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n");

// ── input helpers ──────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: stdin, output: stdout });
const lines = rl[Symbol.asyncIterator]();

async function ask(prompt) {
  stdout.write(prompt);
  const { value, done } = await lines.next();
  if (done) {
    console.log("\nDone.");
    exit(0);
  }
  return value.trim();
}

/** Text prompt. Enter keeps the current value, "-" clears an optional one. */
async function text(label, current, { required = false } = {}) {
  const has = current !== undefined && current !== "";
  for (;;) {
    const v = await ask(`${label}${has ? ` [${current}]` : ""}: `);
    if (v === "-" && !required) return undefined;
    if (v) return v;
    if (has) return current;
    if (!required) return undefined;
    console.log("  This one is required.");
  }
}

async function number(label, current) {
  for (;;) {
    const v = await ask(`${label}${current !== undefined ? ` [${current}]` : ""}: `);
    if (v === "-") return undefined;
    if (!v) return current;
    const n = Number(v);
    if (!Number.isNaN(n) && n >= 0) return n;
    console.log("  Enter a number.");
  }
}

async function menu(title, options) {
  console.log(`\n${title}`);
  options.forEach((o) => console.log(`  ${o.key}) ${o.label}`));
  for (;;) {
    const v = (await ask("> ")).toLowerCase();
    const hit = options.find((o) => String(o.key).toLowerCase() === v);
    if (hit) return hit.key;
    console.log("  Choose one of the options above.");
  }
}

const slug = (s) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseAmount(textValue) {
  const m = String(textValue).replace(/,/g, "").match(/(\d+(?:\.\d+)?)([kKmMbB])?(?![a-zA-Z])/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const unit = (m[2] ?? "").toLowerCase();
  if (unit === "k") n *= 1e3;
  if (unit === "m") n *= 1e6;
  if (unit === "b") n *= 1e9;
  return Math.round(n);
}

const shortAmount = (n) =>
  n >= 1e6 ? `${+(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${+(n / 1e3).toFixed(1)}K` : String(n);

// ── images ─────────────────────────────────────────────────────────────────

function localImages() {
  if (!fs.existsSync(FILES.client)) return [];
  const out = [];
  const walk = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name), `${rel}${e.name}/`);
      else if (/\.(jpe?g|png|webp|avif|svg)$/i.test(e.name)) out.push(`/client/${rel}${e.name}`);
    }
  };
  walk(FILES.client, "");
  return out.sort();
}

/** Remote image hosts must be allowed in next.config.ts, so add them automatically */
function ensureRemoteHost(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }
  if (!fs.existsSync(FILES.next)) return;
  const cfg = fs.readFileSync(FILES.next, "utf8");
  if (cfg.includes(`hostname: "${parsed.hostname}"`)) return;
  const updated = cfg.replace(
    /(remotePatterns:\s*\[\n)/,
    `$1      { protocol: "${parsed.protocol.replace(":", "")}", hostname: "${parsed.hostname}" },\n`,
  );
  if (updated === cfg) {
    console.log(`  Add "${parsed.hostname}" to images.remotePatterns in next.config.ts yourself.`);
    return;
  }
  fs.writeFileSync(FILES.next, updated);
  console.log(`  Allowed images from ${parsed.hostname} in next.config.ts (restart the dev server if it's running).`);
}

async function pickImage(label, current) {
  console.log(`\n${label}`);
  console.log(`  Current: ${current ?? "(none)"}`);
  const files = localImages();
  if (files.length) {
    console.log("  Files in public/client:");
    files.forEach((f, i) => console.log(`    ${i + 1}) ${f}`));
  } else {
    console.log("  No files in public/client yet. Drop images there, or paste a URL.");
  }
  for (;;) {
    const v = await ask("  Number, /client/file path, https:// URL, or Enter to keep: ");
    if (!v) {
      if (current) return current;
      console.log("  An image is required here.");
      continue;
    }
    if (/^\d+$/.test(v) && files[Number(v) - 1]) return files[Number(v) - 1];
    if (/^https?:\/\//i.test(v)) {
      ensureRemoteHost(v);
      return v;
    }
    if (v.startsWith("/")) {
      if (fs.existsSync(P("public", v))) return v;
      console.log(`  public${v} doesn't exist.`);
      continue;
    }
    console.log("  Not recognised.");
  }
}

async function editImage(label, img, defaultAlt) {
  const src = await pickImage(label, img?.src);
  const changed = src !== img?.src;
  const alt = changed || !img?.alt ? await text("Alt text (describes the image for screen readers)", img?.alt ?? defaultAlt, { required: true }) : img.alt;
  return { src, alt };
}

// ── properties ─────────────────────────────────────────────────────────────

async function listingForm(existing, all) {
  const l = existing ? structuredClone(existing) : { image: undefined };
  l.title = await text("Property name", l.title, { required: true });
  l.location = await text("Location (area, city)", l.location, { required: true });

  const status = await menu("Is it for sale or for rent?", [
    { key: "1", label: `For sale${l.status === "sale" ? " (current)" : ""}` },
    { key: "2", label: `For rent${l.status === "rent" ? " (current)" : ""}` },
  ]);
  l.status = status === "1" ? "sale" : "rent";

  l.price = await text(
    l.status === "rent" ? "Price shown on the card (e.g. $9,800 / month)" : "Price shown on the card (e.g. $4,850,000)",
    l.price,
    { required: true },
  );
  let value = parseAmount(l.price);
  if (value === null || value < 1000) {
    value = await number("Number used by the price filter (e.g. 4850000)", existing?.priceValue ?? value ?? undefined);
  }
  l.priceValue = value ?? 0;

  const types = [...new Set(all.map((x) => x.type))];
  if (types.length) console.log(`  Types used so far: ${types.join(", ")}`);
  l.type = await text("Property type (e.g. Villa, Apartment, Penthouse)", l.type, { required: true });

  console.log('  Optional details: Enter to keep, "-" to clear.');
  l.beds = await number("Bedrooms", l.beds);
  l.baths = await number("Bathrooms", l.baths);
  l.area = await text("Size (e.g. 3,400 sq ft)", l.area);
  l.href = await text("Link for 'View property' (page or URL; blank = contact form)", l.href);
  l.image = await editImage("Property photo", l.image, l.title);

  for (const k of ["beds", "baths", "area", "href"]) if (l[k] === undefined) delete l[k];
  if (!existing) {
    let id = slug(l.title) || "property";
    for (let n = 2; all.some((x) => x.id === id); n++) id = `${slug(l.title)}-${n}`;
    l.id = id;
  }
  // keep key order tidy
  const { id, title, location, price, priceValue, status: st, type, beds, baths, area, image, href } = l;
  return Object.fromEntries(Object.entries({ id, title, location, price, priceValue, status: st, type, beds, baths, area, image, href }).filter(([, v]) => v !== undefined));
}

async function propertiesMenu() {
  for (;;) {
    const data = readJson(FILES.listings);
    console.log("\nProperties");
    if (!data.items.length) console.log("  (none yet)");
    data.items.forEach((l, i) => console.log(`  ${i + 1}) ${l.title}, ${l.location}, ${l.price} (${l.status})`));
    const cmd = (await ask("\n  a = add, e N = edit, r N = remove, up N = move up, b = back\n> ")).toLowerCase();
    if (cmd === "b") return;
    if (cmd === "a") {
      data.items.push(await listingForm(null, data.items));
      writeJson(FILES.listings, data);
      console.log("  Saved.");
      continue;
    }
    const m = cmd.match(/^(e|r|up)\s*(\d+)$/);
    const idx = m ? Number(m[2]) - 1 : -1;
    if (!m || !data.items[idx]) {
      console.log("  Try something like: e 2");
      continue;
    }
    if (m[1] === "e") data.items[idx] = await listingForm(data.items[idx], data.items);
    if (m[1] === "r") {
      const sure = (await ask(`  Remove "${data.items[idx].title}"? (y/N) `)).toLowerCase();
      if (sure !== "y") continue;
      data.items.splice(idx, 1);
    }
    if (m[1] === "up" && idx > 0) [data.items[idx - 1], data.items[idx]] = [data.items[idx], data.items[idx - 1]];
    writeJson(FILES.listings, data);
    console.log("  Saved.");
  }
}

// ── price filters ──────────────────────────────────────────────────────────

async function priceFiltersMenu() {
  const data = readJson(FILES.listings);
  const symbol0 = data.priceRanges.sale[0]?.label.match(/Up to (\D+?)\d/)?.[1] ?? "$";
  console.log("\nSearch price filters (the 'Price' dropdown in the search panel).");
  const symbol = (await text("Currency symbol or code", symbol0.trim(), { required: true })).trim();
  const join = /^[A-Za-z]+$/.test(symbol) ? " " : "";

  const readList = async (label, current) => {
    for (;;) {
      const raw = await text(label, current.map((r) => shortAmount(r.max)).join(", "), { required: true });
      const nums = raw.split(",").map((t) => parseAmount(t.trim()));
      if (nums.every((n) => n)) return nums;
      console.log("  Use amounts like 3M, 500K or 12000.");
    }
  };

  const sale = await readList("Buy limits, comma-separated (e.g. 3M, 5M, 10M)", data.priceRanges.sale);
  const rent = await readList("Rent limits per month (e.g. 10K, 20K)", data.priceRanges.rent);
  data.priceRanges = {
    sale: sale.map((max) => ({ label: `Up to ${symbol}${join}${shortAmount(max)}`, max })),
    rent: rent.map((max) => ({ label: `Up to ${symbol}${join}${shortAmount(max)} / month`, max })),
  };
  writeJson(FILES.listings, data);
  console.log("  Saved. Remember to update each property's price text to match the currency.");
}

// ── locations ──────────────────────────────────────────────────────────────

async function locationForm(existing) {
  const l = existing ? structuredClone(existing) : {};
  l.name = await text("City or area name", l.name, { required: true });
  l.detail = await text("Detail shown on hover (e.g. Florida, USA)", l.detail, { required: true });
  l.href = await text("Link (blank = contact form)", l.href);
  l.image = await editImage(`Background photo for ${l.name}`, l.image, `${l.name} skyline`);
  return Object.fromEntries(Object.entries({ name: l.name, detail: l.detail, image: l.image, href: l.href }).filter(([, v]) => v !== undefined));
}

async function locationsMenu() {
  for (;;) {
    const data = readJson(FILES.locations);
    console.log("\nLocations (the hover list in 'Where we work')");
    if (!data.length) console.log("  (none yet)");
    data.forEach((l, i) => console.log(`  ${i + 1}) ${l.name}, ${l.detail}`));
    const cmd = (await ask("\n  a = add, e N = edit, r N = remove, up N = move up, b = back\n> ")).toLowerCase();
    if (cmd === "b") return;
    if (cmd === "a") {
      data.push(await locationForm(null));
      writeJson(FILES.locations, data);
      console.log("  Saved.");
      continue;
    }
    const m = cmd.match(/^(e|r|up)\s*(\d+)$/);
    const idx = m ? Number(m[2]) - 1 : -1;
    if (!m || !data[idx]) {
      console.log("  Try something like: e 2");
      continue;
    }
    if (m[1] === "e") data[idx] = await locationForm(data[idx]);
    if (m[1] === "r") {
      const sure = (await ask(`  Remove "${data[idx].name}"? (y/N) `)).toLowerCase();
      if (sure !== "y") continue;
      data.splice(idx, 1);
    }
    if (m[1] === "up" && idx > 0) [data[idx - 1], data[idx]] = [data[idx], data[idx - 1]];
    writeJson(FILES.locations, data);
    console.log("  Saved.");
  }
}

// ── images ─────────────────────────────────────────────────────────────────

async function galleryMenu() {
  for (;;) {
    const data = readJson(FILES.images);
    console.log("\nAgent gallery (the sliding strip)");
    data.agentGallery.forEach((g, i) => console.log(`  ${i + 1}) ${g.src}`));
    const cmd = (await ask("\n  a = add, e N = replace, r N = remove, b = back\n> ")).toLowerCase();
    if (cmd === "b") return;
    if (cmd === "a") data.agentGallery.push(await editImage("New gallery image", undefined, "Property photo"));
    else {
      const m = cmd.match(/^(e|r)\s*(\d+)$/);
      const idx = m ? Number(m[2]) - 1 : -1;
      if (!m || !data.agentGallery[idx]) {
        console.log("  Try something like: e 2");
        continue;
      }
      if (m[1] === "e") data.agentGallery[idx] = await editImage(`Gallery image ${idx + 1}`, data.agentGallery[idx]);
      else data.agentGallery.splice(idx, 1);
    }
    writeJson(FILES.images, data);
    console.log("  Saved.");
  }
}

async function imagesMenu() {
  for (;;) {
    const data = readJson(FILES.images);
    const slots = [
      { label: "Hero image", get: () => data.hero, set: (v) => (data.hero = v) },
      { label: "Social share image (link previews)", get: () => data.ogImage, set: (v) => (data.ogImage = v.src), plain: true },
      ...data.lifestyle.map((_, i) => ({ label: `Lifestyle panel ${i + 1}`, get: () => data.lifestyle[i], set: (v) => (data.lifestyle[i] = v) })),
      { label: "Agent portrait", get: () => data.agentPortrait, set: (v) => (data.agentPortrait = v) },
      ...data.journal.map((_, i) => ({ label: `Journal article ${i + 1}`, get: () => data.journal[i], set: (v) => (data.journal[i] = v) })),
    ];
    console.log("\nImages (property and location photos are edited in their own menus)");
    slots.forEach((s, i) => console.log(`  ${i + 1}) ${s.label}: ${s.plain ? s.get() : s.get().src}`));
    console.log(`  g) Agent gallery (${data.agentGallery.length} images)`);
    console.log("  b) Back");
    const v = (await ask("> ")).toLowerCase();
    if (v === "b") return;
    if (v === "g") {
      await galleryMenu();
      continue;
    }
    const slot = slots[Number(v) - 1];
    if (!slot) {
      console.log("  Choose a number from the list.");
      continue;
    }
    if (slot.plain) {
      const src = await pickImage(slot.label, slot.get());
      slot.set({ src });
    } else {
      slot.set(await editImage(slot.label, slot.get()));
    }
    writeJson(FILES.images, data);
    console.log("  Saved.");
  }
}

// ── hero text ──────────────────────────────────────────────────────────────

async function heroTextMenu() {
  let cfg = fs.readFileSync(FILES.config, "utf8");
  const headlineRe = /headline:\s*\[([^\]]*)\]/;
  const subRe = /(subheadline:\s*)"((?:[^"\\]|\\.)*)"/;
  const capRe = /caption:\s*\{\s*title:\s*"((?:[^"\\]|\\.)*)",\s*location:\s*"((?:[^"\\]|\\.)*)"\s*\}/;

  const headline = JSON.parse(`[${cfg.match(headlineRe)[1]}]`);
  const sub = JSON.parse(`"${cfg.match(subRe)[2]}"`);
  const cap = cfg.match(capRe);

  console.log("\nHero text. Enter keeps the current value.");
  const out = [];
  for (let i = 0; i < Math.max(headline.length, 2); i++) {
    const line = await text(`Headline line ${i + 1}`, headline[i], { required: i === 0 });
    if (line) out.push(line);
  }
  const subheadline = await text("Short line under the headline", sub, { required: true });

  cfg = cfg.replace(headlineRe, `headline: [${out.map((l) => JSON.stringify(l)).join(", ")}]`);
  cfg = cfg.replace(subRe, `$1${JSON.stringify(subheadline)}`);

  if (cap) {
    console.log("\nCaption shown at the bottom right of the hero (the property in the photo).");
    const title = await text("Caption title", JSON.parse(`"${cap[1]}"`), { required: true });
    const location = await text("Caption location", JSON.parse(`"${cap[2]}"`), { required: true });
    cfg = cfg.replace(capRe, `caption: { title: ${JSON.stringify(title)}, location: ${JSON.stringify(location)} }`);
  }
  fs.writeFileSync(FILES.config, cfg);
  console.log("  Saved.");
}

// ── sections ───────────────────────────────────────────────────────────────

const SECTIONS = [
  ["hero", "Hero"],
  ["search", "Floating search panel"],
  ["featured", "Featured properties"],
  ["lifestyle", "Lifestyle panels"],
  ["positioning", "About and stats"],
  ["agent", "Featured agent"],
  ["locations", "Locations"],
  ["testimonials", "Testimonials"],
  ["journal", "Journal"],
  ["contact", "Contact and form"],
];

async function sectionsMenu() {
  for (;;) {
    let cfg = fs.readFileSync(FILES.config, "utf8");
    const state = SECTIONS.map(([key]) => cfg.match(new RegExp(`^    ${key}:\\s*(true|false),`, "m"))?.[1] === "true");
    console.log("\nSections");
    SECTIONS.forEach(([, label], i) => console.log(`  ${i + 1}) [${state[i] ? "on " : "off"}] ${label}`));
    const v = await ask("\nNumber to switch on/off, or Enter to go back: ");
    if (!v) return;
    const i = Number(v) - 1;
    if (!SECTIONS[i]) {
      console.log("  Choose a number from the list.");
      continue;
    }
    cfg = cfg.replace(new RegExp(`^(    ${SECTIONS[i][0]}:\\s*)(true|false)(,)`, "m"), `$1${!state[i]}$3`);
    fs.writeFileSync(FILES.config, cfg);
  }
}

// ── main ───────────────────────────────────────────────────────────────────

console.log("\nContent editor. Changes are saved as you go.");
for (;;) {
  const choice = await menu("What would you like to edit?", [
    { key: "1", label: "Properties" },
    { key: "2", label: "Locations" },
    { key: "3", label: "Images" },
    { key: "4", label: "Hero text" },
    { key: "5", label: "Search price filters" },
    { key: "6", label: "Sections on/off" },
    { key: "q", label: "Quit" },
  ]);
  if (choice === "q") break;
  if (choice === "1") await propertiesMenu();
  if (choice === "2") await locationsMenu();
  if (choice === "3") await imagesMenu();
  if (choice === "4") await heroTextMenu();
  if (choice === "5") await priceFiltersMenu();
  if (choice === "6") await sectionsMenu();
}

rl.close();
console.log("\nAll saved. Run `npm run dev` to preview.\n");

#!/usr/bin/env node
/**
 * Fills in site.config.ts for a new client.
 *
 *   npm run setup
 *
 * Press Enter on any question to keep the current value.
 * Non-interactive use (skips the questions you pass as flags):
 *
 *   npm run setup -- --name "Aurora Estates" --phone "+971 50 123 4567" \
 *     --email hello@aurora.ae --accent "#B08D57" --yes
 *
 * Flags: --name --tagline --phone --email --accent --background --text --dark --yes
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout, exit, argv, cwd } from "node:process";

const CONFIG_PATH = path.resolve(cwd(), "site.config.ts");
const STR = String.raw`"((?:[^"\\]|\\.)*)"`;

// ── helpers ────────────────────────────────────────────────────────────────

const flags = {};
for (let i = 2; i < argv.length; i++) {
  if (!argv[i].startsWith("--")) continue;
  const key = argv[i].slice(2);
  const next = argv[i + 1];
  if (next && !next.startsWith("--")) {
    flags[key] = next;
    i++;
  } else {
    flags[key] = "true";
  }
}

const esc = (value) => JSON.stringify(value).slice(1, -1); // safe inside a TS string literal
const unesc = (value) => JSON.parse(`"${value}"`);

function normalizeHex(input) {
  let v = String(input).trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(v)) v = v.split("").map((c) => c + c).join("");
  return /^[0-9a-f]{6}$/i.test(v) ? `#${v.toUpperCase()}` : null;
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => `#${rgb.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
const mix = (hex, target, amount) => {
  const a = toRgb(hex);
  const b = toRgb(target);
  return toHex(a.map((v, i) => v + (b[i] - v) * amount));
};
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// ── read current values ────────────────────────────────────────────────────

if (!fs.existsSync(CONFIG_PATH)) {
  console.error("Could not find site.config.ts. Run this from the project root.");
  exit(1);
}
let src = fs.readFileSync(CONFIG_PATH, "utf8");

const read = (re, label) => {
  const m = src.match(re);
  if (!m) {
    console.error(`Could not find "${label}" in site.config.ts. Has the file structure changed?`);
    exit(1);
  }
  return unesc(m[1]);
};

const current = {
  name: read(new RegExp(String.raw`^  name:\s*${STR}`, "m"), "name"),
  tagline: read(new RegExp(String.raw`^  tagline:\s*${STR}`, "m"), "tagline"),
  phone: read(new RegExp(String.raw`\bphone:\s*${STR}`), "contact.phone"),
  email: read(new RegExp(String.raw`\bemail:\s*${STR}`), "contact.email"),
  accent: read(new RegExp(String.raw`\n {4}accent:\s*${STR}`), "theme.accent"),
  background: read(new RegExp(String.raw`\n {4}background:\s*${STR}`), "theme.background"),
  foreground: read(new RegExp(String.raw`\n {4}foreground:\s*${STR}`), "theme.foreground"),
  dark: read(new RegExp(String.raw`\n {4}dark:\s*${STR}`), "theme.dark"),
};

// ── gather answers ─────────────────────────────────────────────────────────

const questions = [
  { key: "name", flag: "name", label: "Business name" },
  { key: "tagline", flag: "tagline", label: "Tagline" },
  { key: "phone", flag: "phone", label: "Phone number (with country code)", check: (v) => (v.replace(/\D/g, "").length >= 6 ? v : null), hint: "Enter a phone number with at least 6 digits." },
  { key: "email", flag: "email", label: "Email address", check: (v) => (/^\S+@\S+\.\S+$/.test(v) ? v : null), hint: "That doesn't look like an email address." },
  { key: "accent", flag: "accent", label: "Accent color (hex, e.g. #B08D57)", check: normalizeHex, hint: "Use a hex color like #B08D57." },
  { key: "background", flag: "background", label: "Page background color (hex)", check: normalizeHex, hint: "Use a hex color like #FAF8F3." },
  { key: "foreground", flag: "text", label: "Text color (hex)", check: normalizeHex, hint: "Use a hex color like #151515." },
  { key: "dark", flag: "dark", label: "Dark section color (hex)", check: normalizeHex, hint: "Use a hex color like #11110F." },
];

const answers = {};
const interactive = Object.keys(flags).filter((k) => k !== "yes").length === 0;
const rl = interactive ? readline.createInterface({ input: stdin, output: stdout }) : null;
const lines = rl ? rl[Symbol.asyncIterator]() : null;

// Reads one line (works for a terminal and for piped input). Returns null at end of input.
const ask = async (prompt) => {
  stdout.write(prompt);
  const { value, done } = await lines.next();
  return done ? null : value.trim();
};

if (interactive) {
  console.log("\nNew client setup. Press Enter to keep the value shown in [brackets].\n");
}

for (const q of questions) {
  const existing = current[q.key];
  let value = flags[q.flag];

  if (value === undefined) {
    if (!interactive) continue; // flags mode: only change what was passed
      while (true) {
      const raw = (await ask(`${q.label} [${existing}]: `)) ?? "";
      if (!raw) break;
      const ok = q.check ? q.check(raw) : raw;
      if (ok) {
        value = ok;
        break;
      }
      console.log(`  ${q.hint}`);
    }
    if (value === undefined) continue;
  } else if (q.check) {
    const ok = q.check(value);
    if (!ok) {
      console.error(`--${q.flag}: ${q.hint}`);
      exit(1);
    }
    value = ok;
  }

  if (value !== existing) answers[q.key] = value;
}

if (Object.keys(answers).length === 0) {
  console.log("\nNothing to change.");
  rl?.close();
  exit(0);
}

// Surface and border should follow the background unless chosen explicitly
const derived = {};
if (answers.background) {
  derived.surface = mix(answers.background, "#000000", 0.04);
  derived.border = mix(answers.background, "#000000", 0.1);
}

// ── preview ────────────────────────────────────────────────────────────────

console.log("\nChanges:");
for (const [k, v] of Object.entries(answers)) console.log(`  ${k.padEnd(11)} ${current[k]}  →  ${v}`);
for (const [k, v] of Object.entries(derived)) console.log(`  ${k.padEnd(11)} (follows background)  →  ${v}`);

const next = { ...current, ...answers };
const warnings = [];
if (contrast(next.accent, next.foreground) < 3) {
  warnings.push("Accent and text colors are close: button hover states may be hard to read.");
}
if (contrast(next.accent, next.dark) < 3) {
  warnings.push("Accent on the dark sections has low contrast: links in the footer may be hard to read.");
}
if (contrast(next.foreground, next.background) < 7) {
  warnings.push("Text on the page background is below a 7:1 contrast ratio. Consider a darker text color.");
}
if (warnings.length) {
  console.log("\nHeads up:");
  warnings.forEach((w) => console.log(`  ${w}`));
}

if (!flags.yes) {
  const reply = (await ask("\nApply these changes? (Y/n) "))?.toLowerCase() ?? "n";
  rl?.close();
  if (reply === "n" || reply === "no") {
    console.log("Cancelled. Nothing was changed.");
    exit(0);
  }
} else {
  rl?.close();
}

// ── apply ──────────────────────────────────────────────────────────────────

const setField = (re, replacement) => {
  src = src.replace(re, replacement);
};

if (answers.name) {
  // The name also appears in SEO text, alt text and the logo comment
  src = src.split(current.name).join(esc(answers.name));
}
if (answers.tagline) {
  setField(new RegExp(String.raw`(^  tagline:\s*)${STR}`, "m"), (_, p) => `${p}"${esc(answers.tagline)}"`);
}
if (answers.phone) {
  const hasPlus = answers.phone.trim().startsWith("+");
  const digits = answers.phone.replace(/\D/g, "");
  setField(new RegExp(String.raw`(\bphone:\s*)${STR}`), (_, p) => `${p}"${esc(answers.phone)}"`);
  setField(/(whatsapp:\s*")\d*(")/, `$1${digits}$2`);
  setField(/tel:\+?\d+/, `tel:${hasPlus ? "+" : ""}${digits}`);
}
if (answers.email) {
  src = src.split(current.email).join(esc(answers.email));
}

const colors = {
  accent: answers.accent,
  background: answers.background,
  foreground: answers.foreground,
  dark: answers.dark,
  ...derived,
};
for (const [key, value] of Object.entries(colors)) {
  if (!value) continue;
  setField(new RegExp(String.raw`(\n {4}${key}:\s*)"#[0-9A-Fa-f]{3,8}"`), `$1"${value}"`);
}

fs.writeFileSync(CONFIG_PATH, src);

console.log("\nsite.config.ts updated.");
console.log("Still to edit by hand: hero headline and image, listings, agent, locations, journal, and the SEO title's city names.");
console.log("Run `npm run dev` to preview.\n");

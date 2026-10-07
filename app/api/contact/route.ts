import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  interest: z.string().trim().max(60).optional(),
  message: z.string().trim().min(10).max(4000),
  company: z.string().optional(), // honeypot
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check your name, email and message, then try again." },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.company) return NextResponse.json({ ok: true }); // bot: pretend success

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: false, error: "Email isn't set up yet. Please call us instead." }, { status: 503 });
    }
    console.log("[contact] SMTP not configured. Enquiry received:", data);
    return NextResponse.json({ ok: true });
  }

  const port = Number(SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: CONTACT_FROM ?? SMTP_USER,
      to: CONTACT_TO,
      replyTo: data.email,
      subject: `New enquiry from ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "-"}`,
        `Interested in: ${data.interest || "-"}`,
        "",
        data.message,
      ].join("\n"),
      html: `<h2>New enquiry</h2>
<p><strong>Name:</strong> ${esc(data.name)}<br/>
<strong>Email:</strong> ${esc(data.email)}<br/>
<strong>Phone:</strong> ${esc(data.phone || "-")}<br/>
<strong>Interested in:</strong> ${esc(data.interest || "-")}</p>
<p>${esc(data.message).replace(/\n/g, "<br/>")}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ ok: false, error: "We couldn't send your message. Please try again." }, { status: 502 });
  }
}

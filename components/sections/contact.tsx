"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { site } from "@/site.config";
import type { InterestId } from "@/lib/types";
import { RevealText } from "@/components/motion/reveal-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "sending" | "success" | "error";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm text-muted">
      {children}
    </label>
  );
}

export function Contact() {
  const { contactSection: c, contact } = site;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [interest, setInterest] = useState<InterestId | "">("");
  const [message, setMessage] = useState("");

  // The search panel's "Sell" tab sends a prefill event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ interest?: InterestId; message?: string }>).detail;
      if (detail?.interest) setInterest(detail.interest);
      if (detail?.message) setMessage(detail.message);
    };
    window.addEventListener("contact:prefill", handler);
    return () => window.removeEventListener("contact:prefill", handler);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          interest: c.form.interests.find((i) => i.id === interest)?.label ?? "",
          message,
          company: String(form.get("company") ?? ""),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? c.form.error);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : c.form.error);
    }
  }

  return (
    <section id="contact" className="border-t py-28 md:py-44">
      <div className="container-x">
        <RevealText as="h2" text={c.headline} className="display-xl max-w-[16ch] text-balance" />

        <div className="mt-12 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <a href={c.primaryCta.href}>{c.primaryCta.label}</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={c.secondaryCta.href}>{c.secondaryCta.label}</a>
          </Button>
        </div>

        <div className="mt-28 grid gap-16 border-t pt-16 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-4">
            <p className="max-w-xs text-base leading-relaxed text-muted">{c.text}</p>
            <dl className="space-y-6 text-base">
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-accent">
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${contact.email}`} className="hover:text-accent">
                    {contact.email}
                  </a>
                </dd>
              </div>
              {contact.whatsapp ? (
                <div>
                  <dt className="text-sm text-muted">WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent"
                    >
                      Message us
                    </a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-sm text-muted">Office</dt>
                <dd className="mt-1 max-w-xs">{contact.address}</dd>
                {contact.hours ? <dd className="mt-1 max-w-xs text-sm text-muted">{contact.hours}</dd> : null}
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {status === "success" ? (
              <div role="status" className="py-8">
                <p className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">{c.form.success}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-x-10 gap-y-8 md:grid-cols-2" noValidate={false}>
                <div className="grid gap-1">
                  <Label htmlFor="name">{c.form.nameLabel}</Label>
                  <Input id="name" name="name" required minLength={2} autoComplete="name" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">{c.form.emailLabel}</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone">{c.form.phoneLabel}</Label>
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="interest">{c.form.interestLabel}</Label>
                  <div className="relative">
                    <select
                      id="interest"
                      name="interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value as InterestId | "")}
                      className="h-12 w-full cursor-pointer appearance-none border-0 border-b border-border bg-transparent pr-7 text-base outline-none focus-visible:border-foreground"
                    >
                      <option value="" />
                      {c.form.interests.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  </div>
                </div>
                <div className="grid gap-1 md:col-span-2">
                  <Label htmlFor="message">{c.form.messageLabel}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={c.form.messagePlaceholder}
                  />
                </div>

                {/* Honeypot: real visitors never see or fill this */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                  <Button type="submit" size="lg" disabled={status === "sending"}>
                    {status === "sending" ? c.form.sending : c.form.submit}
                  </Button>
                  {status === "error" ? (
                    <p role="alert" className="text-sm text-destructive">
                      {error || c.form.error}
                    </p>
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

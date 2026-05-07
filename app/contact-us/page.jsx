"use client";

import React, { useMemo, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactUsPage() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.email.trim() &&
      form.message.trim() &&
      status !== "submitting"
    );
  }, [form, status]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // UI-only (no backend integration change requested)
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 450));
    setStatus("sent");
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Reach out to Sree Chakra Foods — we’ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact info */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-900">Get in touch</h2>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-[#0B4B30]" aria-hidden />
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600">Peerzadiguda, Uppal</p>
                  <p className="text-gray-600">Hyderabad, Telangana</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-[#0B4B30]" aria-hidden />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a className="text-gray-600 hover:text-gray-900" href="tel:+918919105591">
                    +91 8919105591
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-[#0B4B30]" aria-hidden />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a
                    className="text-gray-600 hover:text-gray-900"
                    href="mailto:herbalandco@gmail.com"
                  >
                    herbalandco@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-900">Send a message</h2>

            {status === "sent" ? (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Thanks! Your message has been recorded.
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-gray-700">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  placeholder="Your name"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-gray-700">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  placeholder="you@example.com"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-gray-700">Phone (optional)</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  placeholder="+91"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-gray-700">Subject (optional)</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  placeholder="Order / Product / Support"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="mt-1 min-h-[120px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  placeholder="Write your message…"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  We typically reply within 1–2 business days.
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-[#0B4B30] px-5 text-sm font-semibold text-white hover:bg-[#083a25] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


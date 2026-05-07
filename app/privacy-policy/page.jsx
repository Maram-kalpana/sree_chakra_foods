"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-[900px] px-4 py-10 sm:py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Privacy Policy</h1>
            <Link href="/" className="text-sm font-medium text-[#99ca20] hover:underline">
              Back to home
            </Link>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
            <p>
              This page is a placeholder privacy policy so the footer link doesn’t show “Page not
              found”. Add your full policy content here.
            </p>
            <p>
              If you want, tell me your policy text (or a doc), and I’ll format it cleanly for this
              page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


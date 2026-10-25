"use client";

import { useState } from "react";

export function QuoteForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to submit your inquiry.");
      setMessage("Thank you. Your inquiry has been submitted.");
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your inquiry.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="field"
          name="name"
          placeholder="Your name *"
          required
          maxLength={120}
        />
        <input
          className="field"
          name="company"
          placeholder="Company name"
          maxLength={160}
        />
        <input
          className="field"
          name="email"
          type="email"
          placeholder="Email address *"
          required
          maxLength={254}
        />
        <input
          className="field"
          name="phone"
          placeholder="Phone number *"
          required
          maxLength={30}
        />
      </div>
      <select className="field" name="productType" defaultValue="">
        <option value="">Select product type</option>
        <option>Unprinted Labels</option>
        <option>Printed Labels</option>
        <option>Thermal Labels</option>
        <option>Specialty Labels</option>
        <option>Custom Labels</option>
        <option>Other</option>
      </select>
      <textarea
        className="field min-h-32"
        name="requirements"
        placeholder="Your requirements *"
        required
        minLength={5}
        maxLength={5000}
      />
      <button
        className="btn btn-primary w-full disabled:opacity-60"
        disabled={busy}
      >
        {busy ? "Submitting..." : "Send Request ↗"}
      </button>
      {message && (
        <p role="status" className="text-sm text-slate-600">
          {message}
        </p>
      )}
    </form>
  );
}

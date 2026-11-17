"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";

import { subscribeNewsletter } from "@/entities/newsletter/api/newsletter.api";
import { cn } from "@/shared/lib/utils";

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await subscribeNewsletter(email, "footer");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className={cn("text-sm text-foreground", className)}>
        Thanks for subscribing — check your inbox for your 10% off code.
      </p>
    );
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <form onSubmit={handleSubmit} className="flex w-full border border-border">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          disabled={submitting}
          className="w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={submitting}
          className="flex items-center justify-center bg-accent px-4 text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <ArrowRight size={18} />
        </button>
      </form>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";

import { cn } from "@/shared/lib/utils";

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire up to the newsletter API once integration begins.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={cn("text-sm text-foreground", className)}>
        Thanks for subscribing — check your inbox for your 10% off code.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-sm border border-border", className)}
    >
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
        className="w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex items-center justify-center bg-accent px-4 text-accent-foreground transition-opacity hover:opacity-90"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}

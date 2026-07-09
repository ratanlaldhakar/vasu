"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle } from "lucide-react";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { WobblyTextarea } from "@/components/ui/WobblyTextarea";

interface ContactFormProps {
  prefilledData?: {
    name: string;
    email: string;
    phone: string;
    message: string;
  } | null;
}

export function ContactForm({ prefilledData }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (prefilledData) {
      setName(prefilledData.name);
      setEmail(prefilledData.email);
      setPhone(prefilledData.phone);
      setMessage(prefilledData.message);
    }
  }, [prefilledData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <WobblyCard variant="paper" decoration="tape" hover={false} tilt={false} className="!p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-4 wobbly border-3 border-pencil bg-marker/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-marker" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-pencil mb-2">Message Sent!</h2>
        <p className="text-pencil-muted text-lg">
          Thanks for reaching out! I&apos;ll get back to you within 24 hours.
        </p>
      </WobblyCard>
    );
  }

  return (
    <WobblyCard variant="paper" decoration="tape" hover={false} tilt={false} className="!p-5 md:!p-8">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <WobblyInput
          id="contact-name"
          name="name"
          label="Your Name"
          placeholder="What should I call you?"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <WobblyInput
          id="contact-email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <WobblyInput
          id="contact-phone"
          name="phone"
          label="Mobile Number"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <WobblyTextarea
          id="contact-message"
          name="message"
          label="Your Message"
          placeholder="Tell me about your project, ask a question, or just say hi..."
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <WobblyButton
          type="submit"
          size="lg"
          className="w-full min-h-[52px]"
          disabled={loading}
        >
          {loading ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" strokeWidth={3} />
              Send Message
            </>
          )}
        </WobblyButton>
      </form>
    </WobblyCard>
  );
}

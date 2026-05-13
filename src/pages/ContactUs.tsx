import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import impLogo from "@/assets/brand/imp-logo.webp";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message is too short").max(2000),
});

type FormState = z.infer<typeof ContactSchema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const offices = [
  {
    country: "U.A.E.",
    address:
      "Business Center, Sharjah Publishing City Free Zone, E311, Sheikh Mohammed Bin Zayed Rd, Al Zahia, Sharjah, U.A.E.",
    phone: "+971 50 418 0021",
    phoneHref: "tel:+971504180021",
  },
  {
    country: "Egypt",
    address: "37 Amman st, Fourth Floor, Eldokki, Giza, Egypt.",
    phone: "+20 10 32244125",
    phoneHref: "tel:+201032244125",
  },
];

const EMAIL = "marketing@imanagementpro.com";

const ContactUs = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = ContactSchema.safeParse(form);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const next: FieldErrors = {};
      (Object.keys(flat) as Array<keyof FormState>).forEach((k) => {
        const arr = flat[k];
        if (arr && arr.length) next[k] = arr[0];
      });
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact-message", {
        body: parsed.data,
      });
      if (error || (data && (data as { error?: string }).error)) {
        const msg = (data as { error?: string })?.error || error?.message || "Could not send. Please try again.";
        toast.error(msg);
        return;
      }
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Thank you for your message. It has been sent.");
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-imp-paper text-imp-ink">
      {/* Header */}
      <header className="border-b border-imp-line/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="https://imanagementpro.com" className="flex items-center gap-3" aria-label="IMP — Institute of Management Professionals">
            <img src={impLogo} alt="IMP — Institute of Management Professionals" className="h-12 w-auto" />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hidden text-sm font-medium text-imp-brand hover:text-imp-brand-dark md:inline"
          >
            {EMAIL}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-imp-brand text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "44px 44px, 64px 64px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-imp-brand via-imp-brand to-imp-brand-dark/90" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Get in touch</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">Contact Our Team</h1>
            <p className="mt-5 text-lg text-white/85 md:text-xl">
              Have a question? Reach out using the details below — we're here to help and respond promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-imp-brand">Get in Touch</h2>
            <p className="mt-3 max-w-md text-imp-ink/70">
              We're here to help — feel free to reach out with any questions or inquiries.
            </p>

            <div className="mt-8 space-y-5">
              {offices.map((o) => (
                <article
                  key={o.country}
                  className="rounded-2xl border border-imp-line/70 bg-white p-6 shadow-sm transition hover:border-imp-brand/40 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-imp-brand/10 text-imp-brand">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-imp-brand">{o.country}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-imp-ink/80">{o.address}</p>
                      <a
                        href={o.phoneHref}
                        dir="ltr"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-imp-brand hover:text-imp-brand-dark"
                      >
                        <Phone className="h-4 w-4" />
                        <bdi>{o.phone}</bdi>
                      </a>
                    </div>
                  </div>
                </article>
              ))}

              <article className="rounded-2xl border border-imp-line/70 bg-white p-6 shadow-sm transition hover:border-imp-brand/40 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-imp-brand/10 text-imp-brand">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-imp-brand">Email</h3>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-1 block break-all text-sm font-medium text-imp-ink/80 hover:text-imp-brand"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-3xl border border-imp-line/70 bg-white p-7 shadow-xl shadow-imp-brand/[0.06] md:p-10"
          >
            {sent ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-imp-brand" />
                <h3 className="mt-4 text-2xl font-bold text-imp-brand">Message sent</h3>
                <p className="mt-2 max-w-sm text-imp-ink/70">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-imp-brand/30 text-imp-brand hover:bg-imp-brand/5"
                  onClick={() => setSent(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <header>
                  <h2 className="text-2xl font-bold text-imp-brand">Send us a message</h2>
                  <p className="mt-1 text-sm text-imp-ink/65">We typically reply within one business day.</p>
                </header>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Your Name" error={errors.name}>
                    <Input
                      id="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Jane Doe"
                      className="h-12 border-imp-line/80 bg-white text-imp-ink focus-visible:ring-imp-brand/30"
                      maxLength={100}
                    />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@company.com"
                      className="h-12 border-imp-line/80 bg-white text-imp-ink focus-visible:ring-imp-brand/30"
                      maxLength={255}
                    />
                  </Field>
                </div>

                <Field id="subject" label="Subject" error={errors.subject}>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="How can we help?"
                    className="h-12 border-imp-line/80 bg-white text-imp-ink focus-visible:ring-imp-brand/30"
                    maxLength={150}
                  />
                </Field>

                <Field id="message" label="Message" error={errors.message}>
                  <Textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell us a bit about your inquiry…"
                    className="min-h-[150px] resize-y border-imp-line/80 bg-white text-imp-ink focus-visible:ring-imp-brand/30"
                    maxLength={2000}
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-full bg-imp-brand text-base font-semibold text-white shadow-lg shadow-imp-brand/20 transition hover:bg-imp-brand-dark disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Submit <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-imp-line/60 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-imp-ink/60 md:flex-row">
          <div className="flex items-center gap-3">
            <img src={impLogo} alt="IMP" className="h-8 w-auto opacity-90" />
            <span>© {new Date().getFullYear()} Institute of Management Professionals. All rights reserved.</span>
          </div>
          <a href={`mailto:${EMAIL}`} className="font-medium text-imp-brand hover:text-imp-brand-dark">
            {EMAIL}
          </a>
        </div>
      </footer>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Field = ({ id, label, error, children }: FieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-semibold text-imp-ink/85">
      {label}
    </Label>
    {children}
    {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
  </div>
);

export default ContactUs;

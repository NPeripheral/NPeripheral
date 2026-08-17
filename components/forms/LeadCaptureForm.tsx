"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "error";

type FormValues = {
  name: string;
  business: string;
  email: string;
  phone: string;
  website: string;
  interests: string[];
  budget: string;
  goals: string;
  contactPreference: string;
  consent: boolean;
  /** Honeypot — hidden from people, irresistible to bots. */
  company_website: string;
};

const initialValues: FormValues = {
  name: "",
  business: "",
  email: "",
  phone: "",
  website: "",
  interests: [],
  budget: "",
  goals: "",
  contactPreference: "email",
  consent: false,
  company_website: "",
};

const budgets = [
  "Not sure yet",
  "Under $500 / month",
  "$500 – $1,000 / month",
  "$1,000 – $2,500 / month",
  "$2,500+ / month",
];

const contactPreferences = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "text", label: "Text message" },
];

type Errors = Partial<Record<keyof FormValues, string>>;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="type-small mt-2 text-ember-2">
      {message}
    </p>
  );
}

const inputClass = (invalid?: boolean) =>
  cn(
    "type-body w-full border-b bg-transparent px-0 py-3 text-bone outline-none transition-colors duration-300 placeholder:text-quieter",
    invalid
      ? "border-ember-2 focus-visible:border-ember-2"
      : "border-[var(--color-line)] focus-visible:border-ember",
  );


/**
 * The quote request.
 *
 * Validation runs on submit and again as the user corrects a field, so
 * nobody gets scolded mid-typing. Messages say what to do rather than what
 * went wrong, errors are wired to their inputs with aria-describedby, and the
 * first invalid field takes focus.
 *
 * Budget is genuinely optional and says so — asking a small business to
 * commit to a number before they know the scope is how you lose them.
 */
export function LeadCaptureForm() {
  const router = useRouter();
  const ids = useId();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function field<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear an error as soon as the field it belongs to is touched again.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function validate(v: FormValues): Errors {
    const next: Errors = {};

    if (!v.name.trim()) next.name = "Please tell us your name.";
    if (!v.email.trim()) {
      next.email = "We need an email address to reply to.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) {
      next.email = "That email address looks incomplete — please check it.";
    }
    if (v.contactPreference !== "email" && !v.phone.trim()) {
      next.phone = "Add a phone number, or switch your preference to email.";
    }
    if (v.phone.trim() && v.phone.replace(/\D/g, "").length < 10) {
      next.phone = "Please enter a full phone number including area code.";
    }
    if (!v.goals.trim()) {
      next.goals = "A sentence or two about your goals is enough to get started.";
    }
    if (v.interests.length === 0) {
      next.interests = "Pick at least one service so we know what to quote.";
    }
    if (!v.consent) {
      next.consent = "We need your permission before we can get in touch.";
    }

    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      const el = document.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "contact-page" }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error ?? "We couldn't send that just now.");
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setFormError(
        err instanceof Error
          ? `${err.message} You can also email us directly at ${siteConfig.email}.`
          : "Something went wrong. Please email us directly instead.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative border border-[var(--color-line)] p-7 sm:p-10">
      <p className="type-label-sm rule-b pb-4 text-quieter">Request a quote</p>

      {/* Honeypot. Off-screen rather than display:none so scripted fillers
          still see it, and excluded from the tab order and the a11y tree. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${ids}-company-website`}>Company website</label>
        <input
          id={`${ids}-company-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company_website}
          onChange={(e) => field("company_website", e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ids}-name`} className="type-label-sm block text-quieter">
              Your name <span className="text-ember">*</span>
            </label>
            <input
              id={`${ids}-name`}
              data-field="name"
              value={values.name}
              onChange={(e) => field("name", e.target.value)}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${ids}-name-error` : undefined}
              className={cn("mt-3", inputClass(Boolean(errors.name)))}
              placeholder="Jane Doe"
            />
            <FieldError id={`${ids}-name-error`} message={errors.name} />
          </div>

          <div>
            <label htmlFor={`${ids}-business`} className="type-label-sm block text-quieter">
              Business name
            </label>
            <input
              id={`${ids}-business`}
              data-field="business"
              value={values.business}
              onChange={(e) => field("business", e.target.value)}
              autoComplete="organization"
              className={cn("mt-3", inputClass())}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ids}-email`} className="type-label-sm block text-quieter">
              Email <span className="text-ember">*</span>
            </label>
            <input
              id={`${ids}-email`}
              data-field="email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={(e) => field("email", e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${ids}-email-error` : undefined}
              className={cn("mt-3", inputClass(Boolean(errors.email)))}
              placeholder="you@yourbusiness.com"
            />
            <FieldError id={`${ids}-email-error`} message={errors.email} />
          </div>

          <div>
            <label htmlFor={`${ids}-phone`} className="type-label-sm block text-quieter">
              Phone
            </label>
            <input
              id={`${ids}-phone`}
              data-field="phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(e) => field("phone", e.target.value)}
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${ids}-phone-error` : undefined}
              className={cn("mt-3", inputClass(Boolean(errors.phone)))}
              placeholder="(555) 555-5555"
            />
            <FieldError id={`${ids}-phone-error`} message={errors.phone} />
          </div>
        </div>

        <div>
          <label htmlFor={`${ids}-website`} className="type-label-sm block text-quieter">
            Website or social media
          </label>
          <input
            id={`${ids}-website`}
            data-field="website"
            value={values.website}
            onChange={(e) => field("website", e.target.value)}
            autoComplete="url"
            className={cn("mt-3", inputClass())}
            placeholder="A link to whatever you already have"
          />
        </div>

        <fieldset aria-describedby={errors.interests ? `${ids}-interests-error` : undefined}>
          <legend className="type-label-sm text-quieter">
            Services you&apos;re interested in <span className="text-ember">*</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {services.map((service, i) => {
              const checked = values.interests.includes(service.title);
              return (
                <label
                  key={service.slug}
                  className={cn(
                    "type-label-sm cursor-pointer rounded-full border px-4 py-2.5 transition-colors duration-300",
                    checked
                      ? "border-ember bg-ember text-[#fff6f1]"
                      : "border-[var(--color-line)] text-quiet hover:border-bone/40 hover:text-bone",
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    data-field={i === 0 ? "interests" : undefined}
                    checked={checked}
                    onChange={() =>
                      field(
                        "interests",
                        checked
                          ? values.interests.filter((t) => t !== service.title)
                          : [...values.interests, service.title],
                      )
                    }
                  />
                  {service.title}
                </label>
              );
            })}
          </div>
          <FieldError id={`${ids}-interests-error`} message={errors.interests} />
        </fieldset>

        <div>
          <label htmlFor={`${ids}-budget`} className="type-label-sm block text-quieter">
            Monthly marketing budget <span className="normal-case">(optional)</span>
          </label>
          <select
            id={`${ids}-budget`}
            data-field="budget"
            value={values.budget}
            onChange={(e) => field("budget", e.target.value)}
            className={cn(
              "mt-3 appearance-none pr-6 [&>option]:bg-ink-3 [&>option]:text-bone",
              inputClass(),
            )}
          >
            <option value="">Prefer not to say</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <p className="type-small mt-2 text-quieter">
            A range helps us scope realistically. It never changes the quality of the work.
          </p>
        </div>

        <div>
          <label htmlFor={`${ids}-goals`} className="type-label-sm block text-quieter">
            Tell us about your goals <span className="text-ember">*</span>
          </label>
          <textarea
            id={`${ids}-goals`}
            data-field="goals"
            rows={4}
            value={values.goals}
            onChange={(e) => field("goals", e.target.value)}
            aria-invalid={Boolean(errors.goals)}
            aria-describedby={errors.goals ? `${ids}-goals-error` : undefined}
            className={cn("mt-3 resize-none", inputClass(Boolean(errors.goals)))}
            placeholder="What are you hoping social media does for the business?"
          />
          <FieldError id={`${ids}-goals-error`} message={errors.goals} />
        </div>

        <fieldset>
          <legend className="type-label-sm text-quieter">Preferred contact method</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {contactPreferences.map((option) => {
              const checked = values.contactPreference === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "type-label-sm cursor-pointer rounded-full border px-4 py-2.5 transition-colors duration-300",
                    checked
                      ? "border-ember bg-ember text-[#fff6f1]"
                      : "border-[var(--color-line)] text-quiet hover:border-bone/40 hover:text-bone",
                  )}
                >
                  <input
                    type="radio"
                    name={`${ids}-contact`}
                    className="sr-only"
                    checked={checked}
                    onChange={() => field("contactPreference", option.value)}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="rule-t pt-7">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              data-field="consent"
              checked={values.consent}
              onChange={(e) => field("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${ids}-consent-error` : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-ember"
            />
            <span className="type-small text-quiet">
              I agree to be contacted by NPeripheral about this enquiry.{" "}
              <span className="text-quieter">
                We use your details to reply and scope your work. We don&apos;t sell them, and
                you can ask us to delete them at any time.
              </span>
            </span>
          </label>
          <FieldError id={`${ids}-consent-error`} message={errors.consent} />
        </div>

        {formError ? (
          <p role="alert" className="type-small text-ember-2">
            {formError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={status === "loading"}
            className="group/btn inline-flex items-center justify-center gap-2.5 rounded-full bg-ember px-9 py-4 text-[0.95rem] font-medium tracking-tight text-[#fff6f1] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Get my custom quote"}
            <ArrowRight />
          </button>
          <p className="type-label-sm leading-[1.7] text-quieter">
            {siteConfig.responsePromiseShort}
          </p>
        </div>
      </div>
    </form>
  );
}

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BRAND, CONTACT, PAGES } from "../data/site";

function ContactPage() {
  const page = PAGES.contact;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = encodeURIComponent(`Project enquiry from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `${CONTACT.mailto}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="content-page content-page--contact">
      <div className="content-page__inner">
        <p className="content-page__eyebrow">{page.eyebrow}</p>
        <h1 className="content-page__title">{page.title}</h1>
        <p className="content-page__intro">{page.intro}</p>

        <div className="contact-grid">
          <section className="content-block">
            <h2>{page.sections[0].title}</h2>
            <p>{page.sections[0].body}</p>
            <p className="contact-direct">
              Reach us directly:{" "}
              <a href={CONTACT.mailto}>{CONTACT.email}</a>
            </p>
            <ul>
              {page.sections[0].points?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="contact-grid__brand">
              <strong>{BRAND.name}</strong>
              <br />
              {BRAND.footerLine}
              <br />
              <a href={CONTACT.mailto}>{CONTACT.email}</a>
            </p>
          </section>

          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Name
              <input name="name" type="text" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
              />
            </label>
            <label>
              What are you trying to achieve?
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your idea, challenge, or project…"
              />
            </label>
            <button className="cta" type="submit">
              {sent ? "Opening your email…" : BRAND.ctaPrimary}
            </button>
            {sent ? (
              <p className="contact-form__note">
                Your email app should open to {CONTACT.email}. If it doesn’t, write
                us directly at{" "}
                <a href={CONTACT.mailto}>{CONTACT.email}</a>.
              </p>
            ) : (
              <p className="contact-form__note">
                Or email us straight away:{" "}
                <a href={CONTACT.mailto}>{CONTACT.email}</a>
              </p>
            )}
            <Link className="contact-form__back" to="/">
              Back to home
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BRAND, PAGES } from "../data/site";

function ContactPage() {
  const page = PAGES.contact;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            <ul>
              {page.sections[0].points?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="contact-grid__brand">
              <strong>{BRAND.name}</strong>
              <br />
              {BRAND.footerLine}
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
              {sent ? "Message noted — we'll be in touch" : BRAND.ctaPrimary}
            </button>
            {sent ? (
              <p className="contact-form__note">
                Thanks. No pressure from our side — just a clear next step.
              </p>
            ) : null}
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

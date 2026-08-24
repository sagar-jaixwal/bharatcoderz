import { Link } from "react-router-dom";
import { BRAND, CONTACT, type PageContent } from "../data/site";

type ContentPageProps = {
  page: PageContent;
};

function ContentPage({ page }: ContentPageProps) {
  return (
    <main className="content-page">
      <div className="content-page__inner">
        <p className="content-page__eyebrow">{page.eyebrow}</p>
        <h1 className="content-page__title">{page.title}</h1>
        <p className="content-page__intro">{page.intro}</p>

        <div className="content-page__sections">
          {page.sections.map((section) => (
            <section key={section.title} className="content-block">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.points?.length ? (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="content-page__cta-row">
          <Link className="cta" to="/contact">
            {BRAND.ctaPrimary}
          </Link>
          <a className="cta cta--ghost" href={CONTACT.mailto}>
            {CONTACT.email}
          </a>
        </div>
      </div>
    </main>
  );
}

export default ContentPage;

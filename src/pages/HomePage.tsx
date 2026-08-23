import { Link } from "react-router-dom";
import CircuitFlow from "../CircuitFlow";
import { BRAND } from "../data/site";

const ASSETS = {
  model: "/assets/ai-model.png",
  modelGlowEllipse: "/assets/model-glow-ellipse.svg",
  modelGlowMain: "/assets/model-glow-main.svg",
  textGlow: "/assets/text-glow.svg",
} as const;

function HomePage() {
  return (
    <main className="hero">
      <div className="hero__copy">
        <div className="hero__text-glow" aria-hidden>
          <img src={ASSETS.textGlow} alt="" />
        </div>

        <div className="badge">
          <span className="badge__new">NEW</span>
          <span className="badge__label">{BRAND.badgeNote}</span>
        </div>

        <p className="hero__eyebrow">{BRAND.tagline}</p>

        <h1 className="hero__title">
          <span className="hero__title-line">{BRAND.headline[0]}</span>
          <span className="hero__title-line">
            <span className="hero__title-accent">Around</span>
            {" Your Business"}
          </span>
        </h1>

        <p className="hero__subtitle">{BRAND.subtitle}</p>

        <div className="hero__ctas">
          <Link className="cta" to="/contact">
            {BRAND.ctaPrimary}
          </Link>
          <Link className="cta cta--ghost" to="/services">
            {BRAND.ctaSecondary}
          </Link>
        </div>
      </div>

      <div className="hero__visual" aria-hidden>
        <div className="hero__model-glow">
          <img
            className="hero__model-glow-ellipse"
            src={ASSETS.modelGlowEllipse}
            alt=""
          />
          <img
            className="hero__model-glow-main"
            src={ASSETS.modelGlowMain}
            alt=""
          />
        </div>

        <div className="hero__model-stack">
          <img className="hero__model" src={ASSETS.model} alt="" />
          <img className="hero__model hero__model--energy" src={ASSETS.model} alt="" />
          <CircuitFlow />
        </div>

        <div className="hero__model-fade" />
      </div>
    </main>
  );
}

export default HomePage;

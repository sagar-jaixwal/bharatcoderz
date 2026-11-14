import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import NeuralNetwork from "./NeuralNetwork";
import NavMenu from "./NavMenu";
import PageLoader from "./PageLoader";
import ChatBot from "./ChatBot";
import { BRAND, NAV_ITEMS } from "./data/site";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="page">
        <div className="page__atmosphere" aria-hidden />
        <NeuralNetwork />
        <div className="page__particles" aria-hidden />

        <header className="nav">
          <Link className="nav__brand" to="/" aria-label={`${BRAND.name} home`}>
            <img
              className="nav__logo"
              src="/assets/bharatcoderz-logo.png"
              alt={BRAND.name}
              width={280}
              height={87}
            />
          </Link>

          <NavMenu onNavigate={() => setMobileOpen(false)} />

          <div className="nav__actions">
            <Link className="nav__waitlist" to="/contact">
              {BRAND.ctaPrimary}
            </Link>
            <button
              type="button"
              className="nav__burger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {mobileOpen ? (
          <div className="nav-mobile" role="dialog" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `nav-mobile__parent${isActive ? " is-active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              className="nav-mobile__cta"
              to="/contact"
              onClick={() => setMobileOpen(false)}
            >
              {BRAND.ctaPrimary}
            </Link>
          </div>
        ) : null}

        <PageLoader>
          <Outlet />
        </PageLoader>

        <div className="page__gradient" aria-hidden>
          <img src="/assets/gradient.svg" alt="" />
        </div>
      </div>

      {/* Outside .page so overflow/clip cannot block clicks */}
      <ChatBot />
    </>
  );
}

export default Layout;

import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import NeuralNetwork from "./NeuralNetwork";
import { NAV_ITEMS, PAGES } from "./data/site";

const MIN_MS = 1400;

function labelForPath(pathname: string) {
  if (pathname === "/") return "Bootstrapping BharatCoderz systems…";
  const item = NAV_ITEMS.find((nav) => nav.path === pathname);
  const page = Object.values(PAGES).find((entry) => entry.path === pathname);
  return page?.loadingLabel ?? `Loading ${item?.label ?? "page"}…`;
}

type PageLoaderProps = {
  children: ReactNode;
};

function PageLoader({ children }: PageLoaderProps) {
  const location = useLocation();
  const navType = useNavigationType();
  const [visible, setVisible] = useState(true);
  const [label, setLabel] = useState(labelForPath(location.pathname));
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    setVisible(true);
    setLabel(labelForPath(location.pathname));
    setProgress(8);

    const started = performance.now();
    const tick = window.setInterval(() => {
      setProgress((value) => Math.min(92, value + 7 + Math.random() * 10));
    }, 120);

    const done = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => setVisible(false), 220);
    }, MIN_MS);

    // Keep first paint loader even on POP so refresh feels consistent
    void navType;
    void started;

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [location.pathname, navType]);

  return (
    <>
      {children}
      {visible ? (
        <div className="ai-loader" role="status" aria-live="polite" aria-busy="true">
          <div className="ai-loader__bg" aria-hidden>
            <NeuralNetwork />
          </div>
          <div className="ai-loader__panel">
            <p className="ai-loader__brand">BharatCoderz</p>
            <div className="ai-loader__orb" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <p className="ai-loader__label">{label}</p>
            <div className="ai-loader__bar" aria-hidden>
              <div className="ai-loader__fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="ai-loader__meta">Neural link · {Math.round(progress)}%</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PageLoader;

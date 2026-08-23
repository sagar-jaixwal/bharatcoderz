import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./data/site";

type NavMenuProps = {
  onNavigate?: () => void;
};

function NavMenu({ onNavigate }: NavMenuProps) {
  return (
    <nav className="nav__pill" aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            `nav__link${isActive ? " is-active" : ""}`
          }
          onClick={onNavigate}
        >
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default NavMenu;

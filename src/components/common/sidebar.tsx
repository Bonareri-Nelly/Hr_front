import { NavLink } from "react-router-dom";
import { moduleSections } from "../../features/moduleRoutes";

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="brand-mark">N</div>
        <div>
          <div className="brand-name">Nexus</div>
          <div className="brand-subtitle">HR &amp; Payroll</div>
        </div>
      </div>

      <div className="sidebar-sections">
        {moduleSections.map((section) => (
          <section className="nav-section" key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            <div className="nav-links">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    key={item.path}
                    to={item.path}
                  >
                    <Icon aria-hidden="true" size={17} strokeWidth={1.9} />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );
}

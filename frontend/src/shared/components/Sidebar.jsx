import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { PanelLeftClose, PanelLeftOpen, LogOut, User, Sun, Moon } from "lucide-react";
import HistoryList from "../../features/explainer/components/HistoryList";
import "../styles/Sidebar.scss";

const Sidebar = ({ history, historyLoading, historyError, onSelectHistory }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("sw_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sw_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__header">
        {!collapsed && <span className="sidebar__logo">StepWise</span>}
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="sidebar__history">
            {history.length === 0 && !historyLoading ? (
              <p className="sidebar__empty">No history yet</p>
            ) : (
              <HistoryList
                history={history}
                loading={historyLoading}
                error={historyError}
                onSelect={onSelectHistory}
              />
            )}
          </div>

          <div className="sidebar__footer">
            <button className="sidebar__theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>

            {user && (
              <>
                <div className="sidebar__user">
                  <User size={16} />
                  <span>{user.username}</span>
                </div>
                <button className="sidebar__logout" onClick={logout}>
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
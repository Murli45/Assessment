import { NavLink } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import { useContext } from 'react';
import { AppContext } from '../store/AppContext';

function MainNavigation() {
    const {searchTerm, setSearchTerm} = useContext(AppContext);

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      // Implement search functionality here
    };

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payout"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Payout
            </NavLink>
          </li>
        </ul>
        <div className={classes.search}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;

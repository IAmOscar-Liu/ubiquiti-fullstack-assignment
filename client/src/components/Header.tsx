import { NavLink } from "react-router-dom";
import { useMeQuery } from "../redux/api/accountApi";

export const Header = () => {
  const { data: meData } = useMeQuery();

  return (
    <header className="header">
      <h1>Todo App</h1>
      <nav>
        <ul>
          <li>
            <NavLink
              className={(props) => (props.isActive ? "active" : "")}
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(props) => (props.isActive ? "active" : "")}
              to="food"
            >
              Food
            </NavLink>
          </li>
          <li>
            {meData?.account ? (
              <NavLink
                className={(props) => (props.isActive ? "active" : "")}
                to="logout"
              >
                Logout
              </NavLink>
            ) : (
              <NavLink
                className={(props) => (props.isActive ? "active" : "")}
                to="login"
              >
                Login
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
      <div className="userInfo">
        {meData?.account ? (
          <p>
            <span>Welcome {meData.account.name}</span>
            <br />
            <span>{meData.account.email}</span>
          </p>
        ) : (
          <p>You are not logged in</p>
        )}
      </div>
    </header>
  );
};

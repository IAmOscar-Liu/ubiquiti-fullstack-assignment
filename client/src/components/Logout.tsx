import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "../redux/api/accountApi";

export const Logout = () => {
  const navigate = useNavigate();
  const { data: meData } = useMeQuery();
  const [logout] = useLogoutMutation();

  if (!meData) navigate("/", { replace: true });

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      window.alert("You've been logged out!");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="logout">
      <h1>You are now logging in as {meData?.account?.name}</h1>
      <h2>Do you want to log out? </h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

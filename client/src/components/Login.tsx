import { useState } from "react";
import {
  useLoginMutation,
  useMeQuery,
  useRegisterMutation,
} from "../redux/api/accountApi";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const { data: meData } = useMeQuery();
  const navigate = useNavigate();
  const [showLogginForm, toggleShowLogginForm] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (showLogginForm) {
      login({ email, password })
        .unwrap()
        .then(() => {
          window.alert("Login successfully!");
          navigate("/", { replace: true });
        })
        .catch((error) => {
          if (error.data?.errorMsg) window.alert(error.data.errorMsg);
          else window.alert("Something went wrong!");
          console.log("reject: ", error);
        });
    } else {
      register({ name: newName, email: newEmail, password: newPassword })
        .unwrap()
        .then(() => {
          window.alert("Login successfully!");
          navigate("/", { replace: true });
        })
        .catch((error) => {
          if (error.data?.errorMsg) window.alert(error.data.errorMsg);
          else window.alert("Something went wrong!");
          console.log("reject: ", error);
        });
    }
  };

  if (meData?.account) navigate("/", { replace: true });

  return (
    <div className="login">
      <h1>{showLogginForm ? "Login" : "Register"}</h1>
      <div className="login-btns">
        <button onClick={() => toggleShowLogginForm(true)}>Login</button>
        <button onClick={() => toggleShowLogginForm(false)}>Register</button>
      </div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          {showLogginForm ? (
            <>
              <p>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </p>
              <p>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </p>
            </>
          ) : (
            <>
              <p>
                <label htmlFor="new-name">Name</label>
                <input
                  id="new-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </p>
              <p>
                <label htmlFor="new-email">Email</label>
                <input
                  id="new-mail"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </p>
              <p>
                <label htmlFor="new-password">Password</label>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </p>
            </>
          )}
          <input type="submit" value="submit" />
        </form>
      </div>
    </div>
  );
};

import "./App.css";
import { Layout } from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { FoodsList } from "./components/FoodsList";
import { TasksList } from "./components/TasksList";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { FoodDetail } from "./components/FoodDetail";
import { TaskDetail } from "./components/TaskDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TasksList />} />
        <Route path="task">
          <Route path=":taskId" element={<TaskDetail />} />
        </Route>

        <Route path="food">
          <Route index element={<FoodsList />} />
          <Route path=":foodId" element={<FoodDetail />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default App;

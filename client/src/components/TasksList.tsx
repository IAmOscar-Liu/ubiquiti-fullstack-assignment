import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "../redux/api/accountApi";
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery
} from "../redux/api/taskApi";
import { Task } from "../types";
import { AddTask } from "./AddTask";

dayjs.extend(relativeTime);

export interface AddTaskInput {
  name: string;
  description: string;
  price: string;
  deadline: string;
  subTasks: {
    name: string;
    description: string;
    price: string;
  }[];
}

const initialAddTaskInput: AddTaskInput = {
  name: "",
  description: "",
  price: "",
  deadline: "",
  subTasks: [],
};

const TaskItem = ({
  task,
  OwnedByMe,
  handleDeleteTask,
}: {
  task: Task;
  OwnedByMe: boolean;
  handleDeleteTask: (task_id: number, createdBy: number) => void;
}) => {
  const navigate = useNavigate();

  return (
    <article>
      <div className="left">
        <h1>{task.name}</h1>
        <h2 className="price-and-deadline">
          <p className="price">Price: ${task.price}</p>
          <p className="deadline">
            Deadline: {new Date(task.deadline).toLocaleString()}
          </p>
        </h2>
        <h3 className="create-and-subtasks">
          {!OwnedByMe && (
            <p style={{ color: "rgb(40 196 54)" }}>
              Created by {task.createdByUsername}{" "}
              {dayjs(task.createdAt).fromNow()}
            </p>
          )}
          {OwnedByMe && (
            <p style={{ color: "red" }}>
              &#9733; You created it {dayjs(task.createdAt).fromNow()}
            </p>
          )}
          <p className="subtask-num">{task.subTasks?.length ?? 0} subtasks</p>
        </h3>
        <p className="description">Description: {task.description}</p>
      </div>
      <div className="right">
        <h1 className="total">Total: ${task.taskTotalPrice}</h1>
        {task.completed && (
          <h2>
            <small>&#10003;</small>
            {"  "}Completed
          </h2>
        )}
        {!task.completed && <h2 style={{ color: "red" }}>Not Completed</h2>}
        <div className="btns">
          <button onClick={() => navigate(`task/${task.id}`)}>Details</button>
          <button onClick={() => handleDeleteTask(task.id, task.createdBy)}>
            <small>&#10060;</small>Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export const TasksList = () => {
  const { data, isFetching, error } = useGetTasksQuery();
  const { data: meData } = useMeQuery();
  const [addTaskInput, setAddTaskInput] =
    useState<AddTaskInput>(initialAddTaskInput);
  const [showAddTask, toggleShowAddTask] = useState<boolean>(false);
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [filterState, setFilterState] = useState<"all" | "yours" | "completed">(
    "all"
  );
  const account_id = meData?.account?.id;

  const handleAddTask = () => {
    if (account_id === undefined) return window.alert("You have to login!");

    addTask({
      createdBy: account_id,
      name: addTaskInput.name,
      description: addTaskInput.description,
      price: Number(addTaskInput.price),
      deadline: +new Date(addTaskInput.deadline),
      subTasks: addTaskInput.subTasks.map((s) => ({
        ...s,
        price: Number(s.price),
      })),
    })
      .unwrap()
      .then(() => {
        window.alert("Adding successful!");
        setAddTaskInput(initialAddTaskInput);
        toggleShowAddTask(false);
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  const handleDeleteTask = (task_id: number, createdBy: number) => {
    if (account_id === undefined) return window.alert("You have to login!");
    if (account_id !== createdBy)
      return window.alert("You cannot delete the task that is not yours!");
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    deleteTask(task_id)
      .unwrap()
      .then(() => {
        window.alert("Deleting successful!");
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  const filterResult = useMemo(() => {
    if (!data) return [];

    if (filterState === "yours")
      return data.filter((t) => t.createdBy === account_id);

    if (filterState === "completed") return data.filter((t) => t.completed);

    return data;
  }, [data, filterState, account_id]);

  if (error) return <div>Something went wrong: {JSON.stringify(error)}</div>;

  let taskItem;

  if (isFetching) taskItem = <div>Loading...</div>;
  else if (!data) taskItem = <div>No data</div>;
  else
    taskItem = (
      <div className="lists">
        {filterResult.length === 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "2em",
              marginTop: "1em",
            }}
          >
            No results
          </div>
        )}
        {filterResult.length > 0 &&
          filterResult.map((task, idx) => (
            <TaskItem
              key={idx}
              task={task}
              OwnedByMe={task.createdBy === account_id}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
      </div>
    );

  return (
    <div className="task-lists">
      <h1>Task Lists</h1>

      <div className="control-btns">
        <>
          {["all", "yours", "completed"].map((phrase) => (
            <button
              key={phrase}
              className={phrase === filterState ? "active" : ""}
              onClick={() => setFilterState(phrase as typeof filterState)}
            >
              {phrase.charAt(0).toUpperCase() + phrase.slice(1)}
            </button>
          ))}
        </>

        <button onClick={() => toggleShowAddTask((prev) => !prev)}>
          {showAddTask ? "Close " : ""}Add Task
        </button>
      </div>

      {showAddTask && (
        <AddTask
          addTaskInput={addTaskInput}
          setAddTaskInput={setAddTaskInput}
          handleAddTask={handleAddTask}
          isAdding={isAdding}
        />
      )}

      {taskItem}
    </div>
  );
};

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMeQuery } from "../redux/api/accountApi";
import {
  useAddSubTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "../redux/api/taskApi";
import { Task as TaskType } from "../types";
import { SubTaskDetail } from "./SubTaskDetail";

dayjs.extend(relativeTime);

export interface AddSubTaskInput {
  name: string;
  description: string;
  price: string;
}

export const initialAddSubTaskInput: AddSubTaskInput = {
  name: "",
  description: "",
  price: "",
};

interface UpdateInput {
  name: string;
  description: string;
  price: string;
  deadline: string;
  completed: undefined | boolean;
}

const initialUpdateInput: UpdateInput = {
  name: "",
  description: "",
  price: "",
  deadline: "",
  completed: undefined,
};

export const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isEditing, toggleIsEditing] = useState<boolean>(false);
  const [isAddingSubTask, toggleIsAddingSubTask] = useState<boolean>(false);
  const [updateInput, setUpdateInput] =
    useState<UpdateInput>(initialUpdateInput);
  const [addSubTaskInput, setAddSubTaskInput] = useState<AddSubTaskInput>(
    initialAddSubTaskInput
  );
  const { data: meData } = useMeQuery();
  const { data, isLoading, error } = useGetTaskQuery(Number(taskId));
  const [addSubTask] = useAddSubTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleAddSubTask = () => {
    if (!meData?.account?.id) return window.alert("You have to login");

    addSubTask({
      rootTask: data?.id!,
      subTaskPath: `task:${data?.id}`,
      name: addSubTaskInput.name,
      description: addSubTaskInput.description,
      price: Number(addSubTaskInput.price),
    })
      .unwrap()
      .then(() => {
        window.alert("Adding successful!");
        setAddSubTaskInput(initialAddSubTaskInput);
        toggleIsAddingSubTask(false);
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  const handleUpdateTask = () => {
    if (!meData?.account?.id) return window.alert("You have to login");
    if (meData?.account?.id !== data?.createdBy)
      return window.alert("You cannot update the food that is not yours!");

    const body: Omit<TaskType, "createdBy"> = {
      id: data?.id!,
      name: updateInput.name,
      description: updateInput.description,
      price: Number(updateInput.price),
      deadline: Number(updateInput.deadline),
      completed: Boolean(updateInput.completed),
    };

    // console.log("old date: ", data?.deadline);
    // console.log("new date: ", updateInput.deadline);
    // console.log(body);

    if (
      data?.name === body.name &&
      data?.description === body.description &&
      data?.price === body.price &&
      data?.deadline === body.deadline &&
      data?.completed === body.completed
    )
      return window.alert("Noting has changed!");

    updateTask(body)
      .unwrap()
      .then(() => {
        window.alert("Updating successful!");
        toggleIsEditing(false);
        setUpdateInput(initialUpdateInput);
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  useEffect(() => {
    if (data)
      setUpdateInput({
        name: data.name,
        description: data.description,
        price: data.price + "",
        deadline: data.deadline + "",
        completed: data.completed,
      });
  }, [data]);

  if (error) return <div>Something went wrong: {JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  return (
    <div className="task-detail">
      <button onClick={() => navigate(-1)}>
        ←<span> Go back</span>
      </button>
      <h1>
        {data.name}
        <span>Total Price: {data.taskTotalPrice}</span>
      </h1>
      <div className="details">
        {meData?.account?.id === data.createdBy && (
          <p style={{ color: "red" }}>
            You created this task!
            <button onClick={() => toggleIsEditing((prev) => !prev)}>
              {!isEditing ? "Modify this" : "Cancel Modify"}
            </button>
          </p>
        )}
        {meData?.account?.id !== data.createdBy && (
          <p style={{ color: "green" }}>
            Task created by {data.createdByUsername}
          </p>
        )}
        <p>Id: {data.id}</p>
        <p>
          Name: {data.name}{" "}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="text"
                value={updateInput.name}
                onChange={(e) =>
                  setUpdateInput((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
          )}
        </p>
        <p className="description">
          Description: {data.description}{" "}
          {isEditing && (
            <>
              <label style={{ marginLeft: "auto" }}>New value: </label>{" "}
              <textarea
                rows={4}
                style={{ minWidth: 200 }}
                value={updateInput.description}
                onChange={(e) =>
                  setUpdateInput((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></textarea>
            </>
          )}
        </p>
        <p>
          Price: {data.price}{" "}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="number"
                value={updateInput.price}
                onChange={(e) =>
                  setUpdateInput((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </label>
          )}
        </p>
        <p>
          Deadline: {new Date(data.deadline).toLocaleString()}{" "}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="datetime-local"
                value={updateInput.deadline}
                onChange={(e) =>
                  setUpdateInput((prev) => ({
                    ...prev,
                    deadline: +new Date(e.target.value) + "",
                  }))
                }
              />
            </label>
          )}
        </p>
        <p>
          Completed: {data.completed + ""}{" "}
          {isEditing && (
            <>
              <label style={{ marginLeft: "auto" }}>
                Yes:{" "}
                <input
                  name="is-completed"
                  type="radio"
                  checked={updateInput.completed}
                  onChange={() =>
                    setUpdateInput((prev) => ({ ...prev, completed: true }))
                  }
                />
              </label>
              <label style={{ marginLeft: "1em" }}>
                No:{" "}
                <input
                  name="is-completed"
                  type="radio"
                  checked={!updateInput.completed}
                  onChange={() =>
                    setUpdateInput((prev) => ({ ...prev, completed: false }))
                  }
                />
              </label>
            </>
          )}
        </p>
        {isEditing && (
          <button className="submit-change" onClick={handleUpdateTask}>
            Submit Change
          </button>
        )}
        <p className="subtasks">
          {data.subTasks && data.subTasks.length > 0 ? "Subtasks:" : ""}
          {isAddingSubTask ? (
            <span onClick={() => toggleIsAddingSubTask(false)}>
              Cancel Adding
            </span>
          ) : (
            <span onClick={() => toggleIsAddingSubTask(true)}>
              ⊕ Add Subtask
            </span>
          )}
        </p>
        {isAddingSubTask && (
          <div className="add-subtask-on-task">
            <p style={{ justifyContent: "center" }}>Add a subtask</p>
            <p>
              <label>
                Name:{" "}
                <input
                  type="text"
                  value={addSubTaskInput.name}
                  onChange={(e) =>
                    setAddSubTaskInput((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </label>
            </p>
            <p>
              <label>
                Description:{" "}
                <input
                  type="text"
                  style={{ minWidth: 300 }}
                  value={addSubTaskInput.description}
                  onChange={(e) =>
                    setAddSubTaskInput((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </label>
            </p>
            <p>
              <label>
                Price:{" "}
                <input
                  type="number"
                  value={addSubTaskInput.price}
                  onChange={(e) =>
                    setAddSubTaskInput((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
              </label>
            </p>
            <p className="submit-new-subtask">
              <button onClick={handleAddSubTask}>Submit</button>
            </p>
          </div>
        )}
        {data.subTasks && data.subTasks.length > 0 && (
          <div className="subtask-lists">
            {data.subTasks.map((subTask, sIdx) => (
              <SubTaskDetail subTask={subTask} key={sIdx} />
            ))}
          </div>
        )}
        <p>&#10022; Created {dayjs(data.createdAt).fromNow()}</p>
        {/*JSON.stringify(data)*/}
      </div>
    </div>
  );
};

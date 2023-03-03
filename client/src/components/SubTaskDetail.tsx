import { useState } from "react";
import { useMeQuery } from "../redux/api/accountApi";
import {
  useAddSubTaskMutation,
  useDeleteSubTaskMutation,
  useUpdateSubTaskMutation,
} from "../redux/api/taskApi";
import { SubTask } from "../types";
import { AddSubTaskInput, initialAddSubTaskInput } from "./TaskDetail";

export const SubTaskDetail = ({ subTask }: { subTask: SubTask }) => {
  const [addSubTask, { isLoading: isLoadingAddSubTask }] =
    useAddSubTaskMutation();
  const [updateSubTask] = useUpdateSubTaskMutation();
  const [deleteSubTask] = useDeleteSubTaskMutation();
  const { data: meData } = useMeQuery();
  const [isAddingSubTask, toggleIsAddingSubTask] = useState<boolean>(false);
  const [isEditingSubTask, toggleIsEdingSubTask] = useState<boolean>(false);
  const [addSubTaskInput, setAddSubTaskInput] = useState<AddSubTaskInput>(
    initialAddSubTaskInput
  );
  const [updateSubTaskInput, setUpdateSubTaskInput] = useState<AddSubTaskInput>(
    {
      name: subTask.name,
      description: subTask.description,
      price: subTask.price + "",
    }
  );
  const account_id = meData?.account?.id;

  const handleAddSubTask = () => {
    if (account_id === undefined) return window.alert("You have to login!");

    // console.log({
    //   rootTask: subTask.rootTask,
    //   subTaskPath: subTask.subTaskPath + ` -> subTask:${subTask.id}`,
    //   name: addSubTaskInput.name,
    //   description: addSubTaskInput.description,
    //   price: Number(addSubTaskInput.price),
    // });

    addSubTask({
      rootTask: subTask.rootTask,
      subTaskPath: subTask.subTaskPath + ` -> subTask:${subTask.id}`,
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

  const handleUpdateSubTask = () => {
    if (account_id === undefined) return window.alert("You have to login!");

    const body: SubTask = {
      id: subTask.id,
      rootTask: subTask.rootTask,
      subTaskPath: subTask.subTaskPath,
      name: updateSubTaskInput.name,
      description: updateSubTaskInput.description,
      price: Number(updateSubTaskInput.price),
    };

    if (
      subTask.name === body.name &&
      subTask.description === body.description &&
      subTask.price === body.price
    )
      return window.alert("Nothing has changed!");

    updateSubTask(body)
      .unwrap()
      .then(() => {
        console.log("Updating successful!");
        setUpdateSubTaskInput(initialAddSubTaskInput);
        toggleIsEdingSubTask(false);
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  const handleDeleteSubTask = () => {
    if (account_id === undefined) return window.alert("You have to login!");

    deleteSubTask({
      id: subTask.id,
      rootTask: subTask.rootTask,
      subTaskPath: subTask.subTaskPath,
    })
      .unwrap()
      .then(() => {
        console.log("Deleting successful!");
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  const AddSubTaskBtn = (
    <button
      onClick={() => {
        toggleIsAddingSubTask((prev) => !prev);
        toggleIsEdingSubTask(false);
      }}
    >
      {isAddingSubTask ? "Cancel adding" : "⊕ Add children"}
    </button>
  );
  const EditSubTaskBtn = (
    <button
      onClick={() => {
        toggleIsEdingSubTask((prev) => !prev);
        toggleIsAddingSubTask(false);
      }}
    >
      {isEditingSubTask ? "Cancel editing" : "Edit subtask"}
    </button>
  );

  return (
    <div className="subtask-detail">
      <h4>
        <span>{subTask.name}</span>
        {AddSubTaskBtn}
        {EditSubTaskBtn}
        <button onClick={handleDeleteSubTask}>Remove</button>
      </h4>
      {isAddingSubTask && (
        <div className="add-subtask">
          <label>
            Name:{" "}
            <input
              type="text"
              required
              value={addSubTaskInput.name}
              onChange={(e) =>
                setAddSubTaskInput((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Description:{" "}
            <input
              type="text"
              required
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
          <label>
            Price:{" "}
            <input
              type="number"
              required
              value={addSubTaskInput.price}
              onChange={(e) =>
                setAddSubTaskInput((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
          </label>{" "}
          <button disabled={isLoadingAddSubTask} onClick={handleAddSubTask}>
            Submit
          </button>
        </div>
      )}
      {isEditingSubTask && (
        <p>
          Name: {subTask.name}{" "}
          <label>
            new value:{" "}
            <input
              type="text"
              value={updateSubTaskInput.name}
              onChange={(e) =>
                setUpdateSubTaskInput((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </label>
        </p>
      )}
      <p>
        Description: {subTask.description}{" "}
        {isEditingSubTask && (
          <label>
            new value:{" "}
            <input
              type="text"
              value={updateSubTaskInput.description}
              onChange={(e) =>
                setUpdateSubTaskInput((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>
        )}
      </p>
      <p>
        Price: {subTask.price}
        {isEditingSubTask && (
          <label>
            new value:{" "}
            <input
              type="number"
              value={updateSubTaskInput.price}
              onChange={(e) =>
                setUpdateSubTaskInput((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
          </label>
        )}
      </p>
      {isEditingSubTask && (
        <p>
          <button className="update-subtask-btn" onClick={handleUpdateSubTask}>
            Update it
          </button>
        </p>
      )}
      {subTask.children && subTask.children.length > 0 && (
        <>
          <p>Children: </p>
          <div className="subtask-detail-children">
            {subTask.children.map((child, cIdx) => (
              <SubTaskDetail subTask={child} key={cIdx} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

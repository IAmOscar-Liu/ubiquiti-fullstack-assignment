import { AddTaskInput } from "./TasksList";

export const AddTask = ({
  addTaskInput,
  setAddTaskInput,
  handleAddTask,
  isAdding,
}: {
  addTaskInput: AddTaskInput;
  setAddTaskInput: React.Dispatch<React.SetStateAction<AddTaskInput>>;
  handleAddTask: () => void;
  isAdding: boolean;
}) => {
  return (
    <div className="add-task">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
        }}
      >
        {isAdding && (
          <p style={{ textAlign: "center" }}>Adding..., Please wait.</p>
        )}
        <p>
          <label>Name</label>
          <input
            type="text"
            required
            value={addTaskInput.name}
            onChange={(e) =>
              setAddTaskInput((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </p>
        <p className="textarea">
          <label>Description</label>
          <textarea
            required
            rows={4}
            value={addTaskInput.description}
            onChange={(e) =>
              setAddTaskInput((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          ></textarea>
        </p>
        <p>
          <label>Price</label>
          <input
            type="number"
            required
            value={addTaskInput.price}
            onChange={(e) =>
              setAddTaskInput((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </p>
        <p>
          <label>Deadline</label>
          <input
            type="datetime-local"
            required
            value={addTaskInput.deadline}
            onChange={(e) =>
              setAddTaskInput((prev) => ({ ...prev, deadline: e.target.value }))
            }
          />
        </p>
        <p
          className="add-subtask"
          onClick={() =>
            setAddTaskInput((prev) => ({
              ...prev,
              subTasks: [
                ...prev.subTasks,
                { name: "", description: "", price: "" },
              ],
            }))
          }
        >
          &oplus; Add Subtask
        </p>
        {addTaskInput.subTasks.length > 0 && (
          <div className="new-subtask-lists">
            {addTaskInput.subTasks.map((subTask, sIdx) => (
              <div className="new-subtask" key={sIdx}>
                <p className="new-subtask-title">
                  Subtask {sIdx + 1}{" "}
                  <span
                    onClick={() =>
                      setAddTaskInput((prev) => ({
                        ...prev,
                        subTasks: prev.subTasks.filter((_, i) => sIdx !== i),
                      }))
                    }
                  >
                    <small>❌</small>Remove
                  </span>
                </p>
                <p>
                  <label>
                    Name:{" "}
                    <input
                      type="text"
                      required
                      value={subTask.name}
                      onChange={(e) =>
                        setAddTaskInput((prev) => ({
                          ...prev,
                          subTasks: prev.subTasks.map((s, i) =>
                            sIdx === i ? { ...s, name: e.target.value } : s
                          ),
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
                      required
                      value={subTask.description}
                      onChange={(e) =>
                        setAddTaskInput((prev) => ({
                          ...prev,
                          subTasks: prev.subTasks.map((s, i) =>
                            sIdx === i
                              ? { ...s, description: e.target.value }
                              : s
                          ),
                        }))
                      }
                    />
                  </label>
                </p>
                <p>
                  <label>
                    Price:{" "}
                    <input
                      type="text"
                      required
                      value={subTask.price}
                      onChange={(e) =>
                        setAddTaskInput((prev) => ({
                          ...prev,
                          subTasks: prev.subTasks.map((s, i) =>
                            sIdx === i ? { ...s, price: e.target.value } : s
                          ),
                        }))
                      }
                    />
                  </label>
                </p>
              </div>
            ))}
          </div>
        )}

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

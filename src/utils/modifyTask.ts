import { Task } from "../types";

export const modifyTask = (task: any): Task => {
  return {
    id: Number(task.id),
    name: task.name + "",
    description: task.description + "",
    price: Number(task.price),
    completed: !!task.completed,
    deadline: Number(task.deadline),
    createdBy: Number(task.createdBy),
    createdByUsername: task.createdByUsername,
    createdAt: task.createdAt,
    updateAt: task.updateAt,
  };
};

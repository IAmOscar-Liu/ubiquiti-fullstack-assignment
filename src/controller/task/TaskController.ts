import { Request, Response } from "express";
import { taskModal } from "../../model";
import TaskControllerInterface from "./TaskControllerInterface";

export default class TaskController implements TaskControllerInterface {
  private static instance: TaskController = new TaskController();

  constructor() {
    if (TaskController.instance !== undefined) return TaskController.instance;

    TaskController.instance = this;
    return TaskController.instance;
  }

  async getAllTasks(_: Request, res: Response) {
    try {
      const tasks = await taskModal.findAllTasks();

      return res.json({ tasks });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async getTask(req: Request, res: Response) {
    const { id } = req.params;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const task = await taskModal.findTaskById({
        id: Number(id),
      });

      return res.json({ task });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addTask(req: Request, res: Response) {
    const { name, description, price, deadline, createdBy, subTasks } =
      req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      deadline === undefined ||
      createdBy === undefined
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const task_id = await taskModal.addTask({
        name: name + "",
        description: description + "",
        price: Number(price),
        deadline: Number(deadline),
        createdBy: Number(createdBy),
      });

      if (subTasks && Array.isArray(subTasks) && subTasks.length > 0) {
        for (let subTask of subTasks) {
          if (
            !subTask.name ||
            !subTask.description ||
            subTask.price === undefined
          )
            continue;

          await taskModal.addSubTask({
            rootTask: task_id,
            subTaskPath: "task:" + task_id,
            name: subTask.name + "",
            description: subTask.description + "",
            price: Number(subTask.price),
          });
        }
      }

      return res.json({ ok: true, id: task_id });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addSubTask(req: Request, res: Response) {
    const { rootTask, subTaskPath, name, description, price } = req.body;
    if (
      !rootTask ||
      !subTaskPath ||
      !name ||
      !description ||
      price === undefined
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const subTask_id = await taskModal.addSubTask({
        rootTask: Number(rootTask),
        subTaskPath: subTaskPath + "",
        name: name + "",
        description: description + "",
        price: Number(price),
      });

      return res.json({ ok: true, id: subTask_id });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateTask(req: Request, res: Response) {
    const { id, name, description, price, deadline, completed } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if (
      [name, description, price, deadline, completed].every(
        (e) => e === undefined
      )
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await taskModal.updateTask({
        id: Number(id),
        name: name === undefined ? undefined : name + "",
        description: description === undefined ? undefined : description + "",
        price: price === undefined ? undefined : Number(price),
        deadline: deadline === undefined ? undefined : Number(deadline),
        completed: completed === undefined ? undefined : Boolean(completed),
      });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateSubTask(req: Request, res: Response) {
    const { id, name, description, price } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if ([name, description, price].every((e) => e === undefined))
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await taskModal.updateSubTask({
        id: Number(id),
        name: name === undefined ? undefined : name + "",
        description: description === undefined ? undefined : description + "",
        price: price === undefined ? undefined : Number(price),
      });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await taskModal.deleteTask({ id: Number(id) });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteSubTask(req: Request, res: Response) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await taskModal.deleteSubTask({ id: Number(id) });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }
}

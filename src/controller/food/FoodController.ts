import { Request, Response } from "express";
import { foodModal } from "../../model";
import FoodControllerInterface from "./FoodControllerInterface";

export default class FoodController implements FoodControllerInterface {
  private static instance: FoodController = new FoodController();

  constructor() {
    if (FoodController.instance !== undefined) return FoodController.instance;

    FoodController.instance = this;
    return FoodController.instance;
  }

  async getAllFoods(_: Request, res: Response) {
    try {
      const foods = await foodModal.findAllFoods();

      return res.json({ foods });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async getFood(req: Request, res: Response) {
    const { id } = req.params;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const food = await foodModal.findFoodById({
        id: Number(id),
      });

      return res.json({ food });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addFood(req: Request, res: Response) {
    const { name, carbs, fats, protein, img, createdBy } = req.body;

    if (
      !name ||
      carbs === undefined ||
      fats === undefined ||
      protein === undefined ||
      createdBy === undefined
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const task_id = await foodModal.addFood({
        name: name + "",
        carbs: Number(carbs),
        fats: Number(fats),
        protein: Number(protein),
        img: img ? img + "" : "/imgs/default_img.jpg",
        createdBy: Number(createdBy),
      });

      return res.json({ ok: true, id: task_id });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateFood(req: Request, res: Response) {
    const { id, name, carbs, fats, protein, img } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if ([name, name, carbs, fats, protein, img].every((e) => e === undefined))
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await foodModal.updateFood({
        id: Number(id),
        name: name === undefined ? undefined : name + "",
        carbs: carbs === undefined ? undefined : Number(carbs),
        fats: fats === undefined ? undefined : Number(fats),
        protein: protein === undefined ? undefined : Number(protein),
        img: img === undefined ? undefined : img + "",
      });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteFood(req: Request, res: Response) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await foodModal.deleteFood({ id: Number(id) });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }
}

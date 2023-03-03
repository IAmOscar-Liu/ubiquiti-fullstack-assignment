import AccountController from "./account/AccountController";
import FoodController from "./food/FoodController";
import TaskController from "./task/TaskController";

class Controller {
  private static instance: Controller;
  private _accountController: AccountController;
  private _foodController: FoodController;
  private _taskController: TaskController;

  constructor() {
    if (Controller.instance) return Controller.instance;

    this._accountController = new AccountController();
    this._foodController = new FoodController();
    this._taskController = new TaskController();

    Controller.instance = this;
    return Controller.instance;
  }

  public get accountController() {
    return this._accountController;
  }

  public get foodController() {
    return this._foodController;
  }

  public get taskController() {
    return this._taskController;
  }
}

const controller = new Controller();

export const accountController = controller.accountController;
export const foodController = controller.foodController;
export const taskController = controller.taskController;

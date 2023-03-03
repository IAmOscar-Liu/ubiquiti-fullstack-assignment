import mysql from "mysql2/promise";
import AccountModal from "./account/AccountModal";
import FoodModal from "./food/FoodModal";
import TaskModal from "./task/TaskModal";

class Modal {
  private static instance: Modal;
  private _pool: mysql.Pool;
  private _accountModal: AccountModal;
  private _foodModal: FoodModal;
  private _taskModal: TaskModal;

  constructor() {
    if (Modal.instance !== undefined) return Modal.instance;

    console.log("create mysql pool~~~~~~~~~");

    this._pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this._accountModal = new AccountModal(this._pool);
    this._foodModal = new FoodModal(this._pool);
    this._taskModal = new TaskModal(this._pool);

    Modal.instance = this;
    return Modal.instance;
  }

  public get pool() {
    return this._pool;
  }

  public get accountModal() {
    return this._accountModal;
  }

  public get foodModal() {
    return this._foodModal;
  }

  public get taskModal() {
    return this._taskModal;
  }
}

const modal = new Modal();

export const pool = modal.pool;
export const accountModal = modal.accountModal;
export const foodModal = modal.foodModal;
export const taskModal = modal.taskModal;

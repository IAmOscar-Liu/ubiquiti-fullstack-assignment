import { Task as TaskType } from "../types";

export const tasks: TaskType[] = [
  {
    id: 1,
    name: "Do the grocery",
    description: "Buy something for dinner",
    price: 0,
    completed: false,
    deadline: 1669560844403,
    createdBy: 1,
    subTasks: [
      {
        id: 1,
        rootTask: 1,
        subTaskPath: "task:1 -> subTask:1",
        name: "milk",
        description: "Buy milk",
        price: 40,
      },
      {
        id: 2,
        rootTask: 1,
        subTaskPath: "task:1 -> subTask:2",
        name: "eggs",
        description: "Buy eggs",
        price: 40,
      },
      {
        id: 3,
        rootTask: 1,
        subTaskPath: "task:1 -> subTask:3",
        name: "chocolate",
        description: "Buy chocolate",
        price: 0,
        children: [
          {
            id: 4,
            rootTask: 1,
            subTaskPath: "task:1 -> subTask:3 -> subTask:4",
            name: "vanilla",
            description: "vanilla chocolate",
            price: 20,
          },
          {
            id: 5,
            rootTask: 1,
            subTaskPath: "task:1 -> subTask:3 -> subTask:5",
            name: "strawberry",
            description: "strawberry chocolate",
            price: 20,
          },
        ],
        childrenTotal: 40,
      },
    ],
    taskTotalPrice: 120,
  },
  {
    id: 2,
    name: "Buy an album",
    description: "Buy an album of Elvis Presley",
    price: 50,
    completed: false,
    deadline: 1669560843403,
    createdBy: 1,
  },
  {
    id: 3,
    name: "Buy a book",
    description: "Buy sa book",
    price: 70,
    completed: false,
    deadline: 1669560842403,
    createdBy: 1,
  },
];

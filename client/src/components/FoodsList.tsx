import { useMeQuery } from "../redux/api/accountApi";
import {
  useAddFoodMutation,
  useDeleteFoodMutation,
  useGetFoodsQuery,
} from "../redux/api/foodApi";
import { Food } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddFood } from "./AddFood";

dayjs.extend(relativeTime);

export interface AddFoodInput {
  name: string;
  carbs: string;
  fats: string;
  protein: string;
  img?: string;
}

const initialAddFoodInput: AddFoodInput = {
  name: "",
  carbs: "",
  fats: "",
  protein: "",
  img: "",
};

const FoodItem = ({
  food,
  OwnedByMe,
  handleDeleteFood,
}: {
  food: Food;
  OwnedByMe: boolean;
  handleDeleteFood: (food_id: number, createdBy: number) => void;
}) => {
  const navigate = useNavigate();

  return (
    <article>
      <div className="img-container">
        <img src={food.img || "/imgs/default_img.jpg"} alt="" />
      </div>
      <div className="info">
        <div className="description">
          <h2>Name: {food.name}</h2>
          <p>
            &#9733; Carbs: {food.carbs}g/100g &#9733; fats: {food.fats}g/100g
            &#9733; protein: {food.protein}g/100g
          </p>
        </div>
        <div className="date">
          {!OwnedByMe && (
            <p>
              Created by {food.createdByUsername}{" "}
              {dayjs(food.createdAt).fromNow()}
            </p>
          )}
          {OwnedByMe && (
            <p style={{ color: "red" }}>
              &#9733; You created it {dayjs(food.createdAt).fromNow()}
            </p>
          )}
        </div>
        <div className="btns">
          <button onClick={() => navigate(`${food.id}`)}>Details</button>
          <button onClick={() => handleDeleteFood(food.id, food.createdBy)}>
            <small>&#10060;</small>Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export const FoodsList = () => {
  const { data, isFetching, error } = useGetFoodsQuery();
  const { data: meData } = useMeQuery();
  const [addFoodInput, setAddFoodInput] =
    useState<AddFoodInput>(initialAddFoodInput);
  const [showAddFood, toggleShowAddFood] = useState<boolean>(false);
  const [addFood, { isLoading: isAdding }] = useAddFoodMutation();
  const [deleteFood] = useDeleteFoodMutation();
  const account_id = meData?.account?.id;

  const handleAddFood = () => {
    if (account_id === undefined) return window.alert("You have to login!");

    const body: Omit<Food, "id"> = {
      name: addFoodInput.name,
      carbs: Number(addFoodInput.carbs),
      fats: Number(addFoodInput.fats),
      protein: Number(addFoodInput.protein),
      createdBy: account_id,
    };
    if (addFoodInput.img) body.img = addFoodInput.img;

    addFood(body)
      .unwrap()
      .then(() => {
        window.alert("Adding successful!");
        setAddFoodInput(initialAddFoodInput);
        toggleShowAddFood(false);
      })
      .catch((error) => {
        if (error.data?.errorMsg) window.alert(error.data.errorMsg);
        else window.alert("Something went wrong!");
        console.log("reject: ", error);
      });
  };

  const handleDeleteFood = (food_id: number, createdBy: number) => {
    if (account_id === undefined) return window.alert("You have to login!");
    if (account_id !== createdBy)
      return window.alert("You cannot delete the food that is not yours!");
    if (!window.confirm("Are you sure you want to delete this food?")) return;

    deleteFood(food_id)
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

  if (error) return <div>Something went wrong: {JSON.stringify(error)}</div>;

  let foodItem;

  if (isFetching) foodItem = <div>Loading...</div>;
  else if (!data) foodItem = <div>No data</div>;
  else
    foodItem = (
      <div className="lists">
        {data.map((food, idx) => (
          <FoodItem
            key={idx}
            food={food}
            OwnedByMe={food.createdBy === account_id}
            handleDeleteFood={handleDeleteFood}
          />
        ))}
      </div>
    );

  return (
    <div className="food-lists">
      <h1>Food Lists</h1>

      <div className="control-btns">
        <button onClick={() => toggleShowAddFood((prev) => !prev)}>
          {showAddFood ? "Close " : ""}Add Food
        </button>
      </div>

      {showAddFood && (
        <AddFood
          addFoodInput={addFoodInput}
          setAddFoodInput={setAddFoodInput}
          handleAddFood={handleAddFood}
          isAdding={isAdding}
        />
      )}

      {foodItem}
    </div>
  );
};

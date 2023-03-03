import { useNavigate, useParams } from "react-router-dom";
import { useGetFoodQuery, useUpdateFoodMutation } from "../redux/api/foodApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMeQuery } from "../redux/api/accountApi";
import { useState, useEffect } from "react";
import { Food } from "../types";

dayjs.extend(relativeTime);

interface UpdateInput {
  name: string;
  carbs: string;
  fats: string;
  protein: string;
  img: string;
}

const initialUpdateInput: UpdateInput = {
  name: "",
  carbs: "",
  fats: "",
  protein: "",
  img: "",
};

export const FoodDetail = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [isEditing, toggleIsEditing] = useState<boolean>(false);
  const [updateInput, setUpdateInput] =
    useState<UpdateInput>(initialUpdateInput);
  const { data: meData } = useMeQuery();
  const { data, isLoading, error } = useGetFoodQuery(Number(foodId));
  const [updateFood] = useUpdateFoodMutation();

  const handleUpdateFood = () => {
    if (!meData?.account?.id) return window.alert("You have to login");
    if (meData?.account?.id !== data?.createdBy)
      return window.alert("You cannot update the food that is not yours!");

    const body: Omit<Food, "createdBy"> = {
      id: data?.id!,
      name: updateInput.name,
      carbs: Number(updateInput.carbs),
      fats: Number(updateInput.fats),
      protein: Number(updateInput.protein),
      img: updateInput.img,
    };

    if (
      data?.name === body.name &&
      data?.carbs === body.carbs &&
      data?.fats === body.fats &&
      data?.protein === body.protein &&
      data?.img === body.img
    )
      return window.alert("Noting has changed!");

    updateFood(body)
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
        carbs: data.carbs + "",
        fats: data.fats + "",
        protein: data.protein + "",
        img: data.img || "",
      });
  }, [data]);

  if (error) return <div>Something went wrong: {JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  return (
    <div className="food-detail">
      <button onClick={() => navigate(-1)}>
        ←<span> Go back</span>
      </button>
      <h1>{data.name}</h1>
      <div className="img-bx">
        <img alt="" src={data.img || "/imgs/default_img.jpg"} />
      </div>
      <div className="details">
        {meData?.account?.id === data.createdBy && (
          <p style={{ color: "red" }}>
            You created this food!
            <button onClick={() => toggleIsEditing((prev) => !prev)}>
              {!isEditing ? "Modify this" : "Cancel Modify"}
            </button>
          </p>
        )}
        {meData?.account?.id !== data.createdBy && (
          <p style={{ color: "green" }}>
            Food created by {data.createdByUsername}
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
        <p>
          Carbs: {data.carbs}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="number"
                value={updateInput.carbs}
                onChange={(e) =>
                  setUpdateInput((prev) => ({ ...prev, carbs: e.target.value }))
                }
              />
            </label>
          )}
        </p>
        <p>
          Fats: {data.fats}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="number"
                value={updateInput.fats}
                onChange={(e) =>
                  setUpdateInput((prev) => ({ ...prev, fats: e.target.value }))
                }
              />
            </label>
          )}
        </p>
        <p>
          Protein: {data.protein}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="number"
                value={updateInput.protein}
                onChange={(e) =>
                  setUpdateInput((prev) => ({
                    ...prev,
                    protein: e.target.value,
                  }))
                }
              />
            </label>
          )}
        </p>
        <p>
          Image url: {data.img || ""}
          {isEditing && (
            <label>
              New value:{" "}
              <input
                type="text"
                value={updateInput.img}
                onChange={(e) =>
                  setUpdateInput((prev) => ({
                    ...prev,
                    img: e.target.value,
                  }))
                }
              />
            </label>
          )}
        </p>
        <p>&#10022; Created {dayjs(data.createdAt).fromNow()}</p>
      </div>
      {isEditing && (
        <button className="submit-change" onClick={handleUpdateFood}>
          Submit Change
        </button>
      )}
    </div>
  );
};

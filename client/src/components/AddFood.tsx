import { AddFoodInput } from "./FoodsList";

export const AddFood = ({
  addFoodInput,
  setAddFoodInput,
  handleAddFood,
  isAdding,
}: {
  addFoodInput: AddFoodInput;
  setAddFoodInput: React.Dispatch<React.SetStateAction<AddFoodInput>>;
  handleAddFood: () => void;
  isAdding: boolean;
}) => {
  return (
    <div className="add-food">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddFood();
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
            value={addFoodInput.name}
            onChange={(e) =>
              setAddFoodInput((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </p>
        <p>
          <label>Carbs</label>
          <input
            type="number"
            required
            value={addFoodInput.carbs}
            onChange={(e) =>
              setAddFoodInput((prev) => ({
                ...prev,
                carbs: e.target.value,
              }))
            }
          />
        </p>
        <p>
          <label>Fats</label>
          <input
            type="number"
            required
            value={addFoodInput.fats}
            onChange={(e) =>
              setAddFoodInput((prev) => ({
                ...prev,
                fats: e.target.value,
              }))
            }
          />
        </p>
        <p>
          <label>Protein</label>
          <input
            type="text"
            required
            value={addFoodInput.protein}
            onChange={(e) =>
              setAddFoodInput((prev) => ({
                ...prev,
                protein: e.target.value,
              }))
            }
          />
        </p>
        <p>
          <label>Image Url</label>
          <input
            type="text"
            value={addFoodInput.img}
            onChange={(e) =>
              setAddFoodInput((prev) => ({ ...prev, img: e.target.value }))
            }
          />
        </p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

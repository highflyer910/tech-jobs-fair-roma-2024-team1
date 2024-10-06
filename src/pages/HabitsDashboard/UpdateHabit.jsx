import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateHabit } from "../../redux/action/habit";

const UpdateHabit = ({ styles, setSelectedHabitId, setHabitsUpdate, setIsLoading, habit }) => {
  const [editedHabit, setEditedHabit] = useState({
    name: habit.name,
    frequency: habit.frequency,
    category: habit.category.name,
    reminder: habit.reminder,
    completed: habit.completed,
  });
  const { loading, content, success } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const handleSaveEdit = (habitId) => {
    setIsLoading(true);
    dispatch(updateHabit(habitId, editedHabit))
      .then(() => {
        setHabitsUpdate(false);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to update habit. Please try again.");
      });
  };
  return (
    <>
      <div className={`${styles.editMode} flex-column `}>
        <input
          type="text"
          value={editedHabit.name}
          onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
          className={styles.editInput}
          placeholder="Habit name"
        />

        <select
          id="habitFrequency"
          value={editedHabit.frequency}
          onChange={(e) => setEditedHabit({ ...editedHabit, frequency: e.target.value })}
          className={`${styles.inputField} my-3 `}
        >
          <option value="">Select a frequency</option>
          <option value="everyday">Every day</option>
          <option value="every3days">Every 3 Days</option>
          <option value="onceaweek">Once a Week</option>
          <option value="onceamonth">Once a Month</option>
        </select>
        <select
          id="habitCategory"
          value={editedHabit.category}
          onChange={(e) => setEditedHabit({ ...editedHabit, category: e.target.value })}
          className={`${styles.inputField} my-3 `}
        >
          <option value="">Select a category</option>
          {content &&
            content.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>

        <div className={styles.editButtons}>
          <button onClick={() => handleSaveEdit(habit.id)} className={styles.saveButton}>
            Save
          </button>
          <button
            onClick={() => {
              setHabitsUpdate(false);
              setSelectedHabitId(null);
            }}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
export default UpdateHabit;

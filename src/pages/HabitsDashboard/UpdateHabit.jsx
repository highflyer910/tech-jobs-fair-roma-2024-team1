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
      });
  };
  return (
    <>
      <div className={`${styles.editMode} flex-column `}>
        <div className="d-flex align-items-center flex-column flex-md-row">
          <div className="d-flex flex-column mx-3">
            <label htmlFor="habitCategory" className="m-0">
              Category
            </label>
            <select
              id="habitCategory"
              value={editedHabit.category}
              onChange={(e) => setEditedHabit({ ...editedHabit, category: e.target.value })}
              className={`${styles.inputField} `}
            >
              <option value="">Select a category</option>
              {content &&
                content.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="Habit name">Habit name</label>
            <input
              type="text"
              value={editedHabit.name}
              onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
              className={styles.editInput}
              placeholder="Habit name"
              id="Habit name"
            />
          </div>
        </div>
        <div className="d-flex align-items-center flex-column flex-md-row">
          <div className="d-flex flex-column mx-3">
            <label htmlFor="habitFrequency">Frequency</label>
            <select
              id="habitFrequency"
              value={editedHabit.frequency}
              onChange={(e) => setEditedHabit({ ...editedHabit, frequency: e.target.value })}
              className={`${styles.inputField} `}
            >
              <option value="">Select a frequency</option>
              <option value="everyday">Every day</option>
              <option value="every3days">Every 3 Days</option>
              <option value="onceaweek">Once a Week</option>
              <option value="onceamonth">Once a Month</option>
            </select>
          </div>
          <div className={`${styles.customCheckbox} d-flex  mx-3`}>
            <input
              id="habitReminder"
              checked={editedHabit.reminder}
              onChange={(e) => setEditedHabit({ ...editedHabit, reminder: e.target.checked })}
              type="checkbox"
            />
            <label htmlFor="habitReminder">Reminder</label>
          </div>
          <div className={`${styles.customCheckbox} d-flex  mx-3`}>
            <input
              id="habitCompleted"
              checked={editedHabit.completed}
              onChange={(e) => setEditedHabit({ ...editedHabit, completed: e.target.checked })}
              type="checkbox"
            />
            <label htmlFor="habitCompleted">Completed</label>
          </div>
        </div>

        <div className={`${styles.editButtons} my-3`}>
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

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
  const { content } = useSelector((state) => state.category);

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

  // Inline styles
  const inlineStyles = {
    container: {
      backgroundColor: "#5251B5",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "600px",
      margin: "auto",
    },
    form: {
      display: "grid",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    inputField: {
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#8E97FD",
      color: "#333",
    },
    checkboxGroup: {
      display: "flex",
      justifyContent: "space-between",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
    },
    checkboxInput: {
      marginRight: "8px",
    },
    actionButtons: {
      display: "flex",
      justifyContent: "space-between",
    },
    saveButton: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      backgroundColor: "#A0A6FF",
      color: "#fff",
    },
    cancelButton: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      backgroundColor: "#4c5085",
      color: "#fff",
    },

    responsive: {
      "@media (max-width: 768px)": {
        form: {
          gridTemplateColumns: "1fr",
        },
        checkboxGroup: {
          flexDirection: "column",
          alignItems: "flex-start",
        },
        actionButtons: {
          flexDirection: "column",
          gap: "10px",
        },
      },
    },
  };

  return (
    <div style={inlineStyles.container}>
      <div style={inlineStyles.form}>
        <div style={inlineStyles.formGroup}>
          <label htmlFor="habitCategory">Category</label>
          <select
            id="habitCategory"
            value={editedHabit.category}
            onChange={(e) => setEditedHabit({ ...editedHabit, category: e.target.value })}
            style={inlineStyles.inputField}
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

        <div style={inlineStyles.formGroup}>
          <label htmlFor="habitName">Habit name</label>
          <input
            type="text"
            value={editedHabit.name}
            onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
            style={inlineStyles.inputField}
            placeholder="Habit name"
            id="habitName"
          />
        </div>

        <div style={inlineStyles.formGroup}>
          <label htmlFor="habitFrequency">Frequency</label>
          <select
            id="habitFrequency"
            value={editedHabit.frequency}
            onChange={(e) => setEditedHabit({ ...editedHabit, frequency: e.target.value })}
            style={inlineStyles.inputField}
          >
            <option value="">Select a frequency</option>
            <option value="everyday">Every day</option>
            <option value="every3days">Every 3 Days</option>
            <option value="onceaweek">Once a Week</option>
            <option value="onceamonth">Once a Month</option>
          </select>
        </div>

        <div style={inlineStyles.checkboxGroup} className={"customCheckbox"}>
          <label style={inlineStyles.checkboxLabel}>
            <input
              type="checkbox"
              // style={inlineStyles.checkboxInput}
              checked={editedHabit.reminder}
              onChange={(e) => setEditedHabit({ ...editedHabit, reminder: e.target.checked })}
            />
            Reminder
          </label>

          <label style={inlineStyles.checkboxLabel}>
            <input
              type="checkbox"
              // style={inlineStyles.checkboxInput}
              checked={editedHabit.completed}
              className={"customCheckbox"}
              onChange={(e) => setEditedHabit({ ...editedHabit, completed: e.target.checked })}
            />
            Completed
          </label>
        </div>

        <div style={inlineStyles.actionButtons}>
          <button onClick={() => handleSaveEdit(habit.id)} style={inlineStyles.saveButton}>
            Save
          </button>
          <button
            onClick={() => {
              setHabitsUpdate(false);
              setSelectedHabitId(null);
            }}
            style={inlineStyles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateHabit;

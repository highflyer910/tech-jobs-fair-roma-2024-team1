import { useDispatch, useSelector } from "react-redux";
import { AddNewHabits } from "../../redux/action/habit";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GetCategories } from "../../redux/action/category";
import { useUser } from "@clerk/clerk-react";

const CreateHabit = ({ showModal, handleModalToggle, setShowModal, styles }) => {
  const [nameError, setNameError] = useState("");
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [reminder, setReminder] = useState(false);
  const { loading, content, success } = useSelector((state) => state.category);
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const handleSaveHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim() === "") {
      setNameError("Please enter a habit name");
      return;
    }
    setNameError("");

    const frequency = document.getElementById("habitFrequency").value;
    const newHabit = {
      name: newHabitName,
      frequency: frequency,
      category: selectedCategory,
      reminder: reminder,
      completed: false,
      users: [user.id],
    };

    dispatch(AddNewHabits(newHabit));
    setShowModal(false);
  };
  useEffect(() => {
    dispatch(GetCategories());
  }, [dispatch]);
  return (
    <>
      <Modal show={showModal} onHide={handleModalToggle} centered>
        <Modal.Header closeButton className={`${styles.modalHeader}`}>
          <Modal.Title className={`${styles.headerModal} text-white text-center`}>Create Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles.modalBody}`}>
          <Form>
            <Form.Group className="mt-3">
              <Form.Label className="text-white">Category</Form.Label>
              <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={styles.inputField} required>
                <option value="">Select a category</option>
                {content &&
                  content.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label className="text-white">Name</Form.Label>
              <Form.Control
                id="habitName"
                type="text"
                placeholder="Enter habit"
                className={`${styles.inputField} ${nameError ? "is-invalid" : ""}`}
                value={newHabitName}
                onChange={(e) => {
                  setNewHabitName(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setNameError("");
                  }
                }}
                required
              />
              {nameError && <div className="invalid-feedback">{nameError}</div>}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label className="text-white">Frequency</Form.Label>
              <Form.Select id="habitFrequency" className={styles.inputField} required>
                <option value="everyday">Every day</option>
                <option value="every3days">Every 3 Days</option>
                <option value="onceaweek">Once a Week</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                id="reminderCheckbox"
                label="Set reminder"
                checked={reminder}
                onChange={(e) => setReminder(e.target.checked)} // Aggiorna lo stato di reminder
              />
            </Form.Group>
            <Button variant="outline-light" onClick={handleSaveHabit} className={`${styles.saveButton} mt-4 w-100`}>
              Save Habit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CreateHabit;

import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AddUser } from "../../redux/action/share";

const ShareHabit = ({ shareHabitShow, handleShareHabitModalToggle, setShareHabitShow, styles, selectedHabitId }) => {
  const [shareUser, setShareUser] = useState({
    email: "",
  });
  const dispatch = useDispatch();
  const handleSaveHabit = (e) => {
    e.preventDefault();

    dispatch(AddUser(shareUser, selectedHabitId));

    setShareHabitShow(false);
  };

  return (
    <>
      <Modal show={shareHabitShow} onHide={handleShareHabitModalToggle} centered>
        <Modal.Header closeButton className={`${styles.modalHeader}`}>
          <Modal.Title className={`${styles.headerModal} text-white text-center`}>Share Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles.modalBody}`}>
          <Form onSubmit={handleSaveHabit}>
            <Form.Group>
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control
                id="emailUser"
                type="email"
                placeholder="Enter email"
                className={`${styles.inputField}`}
                value={shareUser.email}
                name="email"
                onChange={(e) => setShareUser({ ...shareUser, email: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="outline-light" type="submit" className={`${styles.saveButton} mt-4 w-100`}>
              Share Habit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShareHabit;

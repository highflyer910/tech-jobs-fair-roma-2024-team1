import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Container, Dropdown, Navbar } from "react-bootstrap";
import styles from "../component/MyNav.module.css";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyNav = () => {
  const { isSignedIn, user } = useUser();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  useEffect(() => {
    if (user) {
      const userData = {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      setUserData(userData);
    }
  }, [user]);
  useEffect(() => {
    if (userData) {
      const fetchUsers = async () => {
        try {
          const response = await fetch("https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/auth/saveUser", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          localStorage.setItem("authToken", data.token);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [userData]);
  return (
    <>
      <Navbar className={`${styles.navBar} py-0`}>
        <Container>
          <Navbar.Brand className={`${styles.brand}`}>
            <img src={logo} alt="RitmoGiornaliero Logo" className={`${styles.logo}`} />
            <span className={styles.appName}>RitmoGiornaliero</span>
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Dropdown autoClose="outside">
                <Dropdown.Toggle variant="btn" id="dropdown-autoclose-outside" className={`${styles.noCaret} ${styles.userToggle}`}>
                  {isSignedIn && (
                    <div className={styles.userInfo}>
                      <img src={user.imageUrl} alt="" className={`${styles.imgProfile} mt-3 rounded-circle`} />
                      <div className={`${styles.navText} mt-3`}>Hello, {user.firstName}</div>
                    </div>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu className={`${styles.navBar} ${styles.narrowDropdown}`}>
                  <Dropdown.Item className={`${styles.navBar}`}>
                    <SignOutButton>
                      <span className={`${styles.navText} py-3 m-0`} onClick={handleLogout}>
                        Sign out
                      </span>
                    </SignOutButton>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MyNav;

import "./navbar.css";

import { FaSignInAlt, FaSignOutAlt, FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import { orange } from "@mui/material/colors";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="navbarWrapper">
      <div className="navbarLogo">
        <Link to="/">
          <h2 className="navbarLogoText">Vlasov Password Generator</h2>
        </Link>
      </div>
      <div className="navbarMenu">
        <ul className="navbarMenuList">
          {user ? (
            <>
              <li className="navbarMenuListItem">
                <button className="btn" onClick={(e) => navigate("/passwords")} style={{backgroundColor: orange[500], borderColor: orange[500]}}>
                  <FaLock style={{ marginRight: "4px" }} /> My passwords
                </button>
              </li>
              <li className="navbarMenuListItem">
                <button className="btn" onClick={onLogout}>
                  <FaSignOutAlt style={{ marginRight: "4px" }} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbarMenuListItem">
                <Link to="login">
                  <button className="btn">
                    <FaSignInAlt style={{ marginRight: "4px" }} /> Login
                  </button>
                </Link>
              </li>
              <li className="navbarMenuListItem">
                <Link to="register">
                  <button className="btn">
                    <FaUser style={{ marginRight: "4px" }} /> Register
                  </button>
                </Link>
              </li>{" "}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
export default Navbar;

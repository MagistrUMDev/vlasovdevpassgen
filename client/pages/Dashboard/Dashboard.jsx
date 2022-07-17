import { useEffect, useState } from "react";
import "./dashboard.css";
import { generate } from "@wcj/generate-password";
import { FaClone, FaSync, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import { Tooltip, Slider, Checkbox } from "@mui/material";
import { passwordStrength } from "check-password-strength";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPassword } from "../../features/passwords/passwordSlice";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    !user && navigate("/login");
  }, []);

  const [passwordSettings, setPasswordSettings] = useState({
    length: 6,
    lowerCase: true,
    upperCase: true,
    numeric: true,
    special: true,
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const [password, setPassword] = useState(generate(passwordSettings));

  const canToggle = (props) => {
    const newNames = ["lowerCase", "upperCase", "numeric", "special"].filter(
      (elem) => elem !== props.name
    );
    return newNames.some((elem) => passwordSettings[elem] === true);
  };

  const handleClick = (name, value) => {
    setPasswordSettings((prevState) => ({ ...prevState, [name]: value }));
    setPassword(generate({ ...passwordSettings, [name]: value }));
  };

  const CheckboxItem = (props) => {
    const name = props.name;
    return (
      <div className="valueWrapper">
        <Checkbox
          id={`checkboxCheck${props.label}`}
          className="checkboxCheck"
          type={props.type}
          checked={passwordSettings[`${name}`]}
          onClick={(e) => {
            canToggle({ name }) && handleClick(name, !e.target.checked);
          }}
          sx={{
            color:
              (passwordStrength(password).value === "Too weak" &&
                "rgb(223, 102, 97)") ||
              (passwordStrength(password).value === "Weak" &&
                "rgb(239, 194, 15)") ||
              (passwordStrength(password).value === "Medium" &&
                "rgb(0, 168, 120)") ||
              (passwordStrength(password).value === "Strong" &&
                "rgb(0, 107, 77)"),
            "&.Mui-checked": {
              color:
                (passwordStrength(password).value === "Too weak" &&
                  "rgb(223, 102, 97)") ||
                (passwordStrength(password).value === "Weak" &&
                  "rgb(239, 194, 15)") ||
                (passwordStrength(password).value === "Medium" &&
                  "rgb(0, 168, 120)") ||
                (passwordStrength(password).value === "Strong" &&
                  "rgb(0, 107, 77)"),
            },
            transition: "all 0.5s ease-in-out",
          }}
        />
        <label
          htmlFor={`checkboxCheck${props.label}`}
          className="checkboxTitle"
        >
          {props.label}
        </label>
      </div>
    );
  };

  return (
    <div className="dashboardWrapper">
      <div className="dashboardIntro">
        <span className="dashboardIntroTopHeader">Password generator tool</span>
        <h1 className="dashboardIntroMiddleHeader">
          Generate a secure password
        </h1>
        <h4 className="dashboardIntroBottomHeader">
          Use our online password generator to instantly create a secure, random
          password.
        </h4>
      </div>
      <div className="dashboardGenerator">
        <div className="dashboardGeneratorDataWrapper">
          <div className="dashboardGeneratorPasswordWrapper">
            <input
              className="dashboardGeneratorPassword"
              value={password}
              onChange={(e) => {
                if (e.target.value.length >= 4 && e.target.value.length <= 14) {
                  setPassword(e.target.value);
                  setPasswordSettings((prevState) => ({
                    ...prevState,
                    length: e.target.value.length,
                    upperCase: true,
                    lowerCase: true,
                    numeric: true,
                    special: true,
                  }));
                } else {
                  Toast.fire({
                    icon: "error",
                    title:
                      e.target.value.length > 14
                        ? "Your password is too long!"
                        : "Your password is too short! ",
                  });
                }
              }}
            />
          </div>
          <div className="dashboardGeneratorIconsWrapper">
            <div className="cloneIconWrapper">
              <Tooltip
                title="Copy"
                placement="right"
                disableInteractive
                enterDelay={100}
                leaveDelay={100}
              >
                <FaClone
                  onClick={async (e) => {
                    await navigator.clipboard.writeText(password);
                    Toast.fire({
                      icon: "success",
                      title: "You have copied the password",
                    });
                  }}
                />
              </Tooltip>
            </div>
            {user && (
              <div className="saveIconWrapper">
                <Tooltip
                  title="Save"
                  placement="right"
                  disableInteractive
                  enterDelay={100}
                  leaveDelay={100}
                >
                  <FaSave
                    onClick={async (e) => {
                      const { value: formValues } = await Swal.fire({
                        title: "Password Information",
                        html:
                          `<input id="swal-input1" class="swal2-input" placeholder="Password" value = ${password} />` +
                          '<input id="swal-input2" class="swal2-input" placeholder="Description">',
                        focusConfirm: false,
                        preConfirm: () => {
                          return [
                            document.getElementById("swal-input1").value,
                            document.getElementById("swal-input2").value,
                          ];
                        },
                      });

                      if (
                        formValues &&
                        formValues[0] !== "" &&
                        formValues[1] !== ""
                      ) {
                        dispatch(
                          createPassword({
                            password: formValues[0],
                            name: formValues[1],
                          })
                        );
                        Swal.fire({
                          icon: "success",
                          title: "You have successfully saved your password!",
                          footer:
                            '<a href="/passwords">See all saved passwords</a>',
                          timer: 3000,
                          timerProgressBar: true,
                        });
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Invalid Data",
                          timer: 2000,
                          timerProgressBar: true,
                        });
                      }
                    }}
                  />
                </Tooltip>
              </div>
            )}
            <div className="updateIconWrapper">
              <Tooltip
                title="Generate"
                placement="right"
                disableInteractive
                enterDelay={100}
                leaveDelay={100}
              >
                <FaSync
                  onClick={(e) => {
                    setPassword(generate(passwordSettings));
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          className={`strengthWrapper strength${passwordStrength(password)
            .value.replace("Too weak", 1)
            .replace("Weak", 2)
            .replace("Medium", 3)
            .replace("Strong", 4)}`}
        />
      </div>
      <div className="settingsFieldWrapper">
        <div className="settingsHeaderWrapper">
          <h2>Customize your password</h2>
          <div className="settingsLabelWrapper">
            <p className="sliderTitle">Password Length</p>
          </div>
        </div>

        <div className="settingsWrapper">
          <div className="sliderWrapper">
            <input
              style={{
                borderColor:
                  (passwordStrength(password).value === "Too weak" &&
                    "rgb(223, 102, 97)") ||
                  (passwordStrength(password).value === "Weak" &&
                    "rgb(239, 194, 15)") ||
                  (passwordStrength(password).value === "Medium" &&
                    "rgb(0, 168, 120)") ||
                  (passwordStrength(password).value === "Strong" &&
                    "rgb(0, 107, 77)"),
              }}
              type="number"
              className="sliderInput"
              min={4}
              max={14}
              value={passwordSettings.length}
              onChange={(e) => {
                setPasswordSettings((prevState) => ({
                  ...prevState,
                  length: e.target.value,
                }));
                setPassword(
                  generate({ ...passwordSettings, length: e.target.value })
                );
              }}
            />
            <Slider
              className="slider"
              id="slider"
              valueLabelDisplay="auto"
              step={1}
              min={4}
              max={14}
              value={passwordSettings.length ? passwordSettings.length : 4}
              onChange={(event, newValue) => {
                setPasswordSettings((prevState) => ({
                  ...prevState,
                  length: newValue,
                }));
                newValue !== passwordSettings.length &&
                  setPassword(
                    generate({ ...passwordSettings, length: newValue })
                  );
              }}
              defaultValue={10}
              sx={{
                color:
                  (passwordStrength(password).value === "Too weak" &&
                    "rgb(223, 102, 97)") ||
                  (passwordStrength(password).value === "Weak" &&
                    "rgb(239, 194, 15)") ||
                  (passwordStrength(password).value === "Medium" &&
                    "rgb(0, 168, 120)") ||
                  (passwordStrength(password).value === "Strong" &&
                    "rgb(0, 107, 77)"),
                width: "75%",
                transition: "all 0.5s ease-in-out",
              }}
            />
          </div>
          <div className="valuesWrapper">
            <CheckboxItem name="upperCase" label="Uppercase" />
            <CheckboxItem name="lowerCase" label="Lowercase" />
            <CheckboxItem name="numeric" label="Numbers" />
            <CheckboxItem name="special" label="Symbols" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

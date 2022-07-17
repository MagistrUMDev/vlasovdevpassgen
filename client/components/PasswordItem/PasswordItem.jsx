import "./passwordItem.css";
import { useDispatch } from "react-redux";
import {
  deletePassword,
  updatePassword,
} from "../../features/passwords/passwordSlice";
import { FaEdit, FaTimes, FaClone } from "react-icons/fa";
import Swal from "sweetalert2";

const PasswordItem = ({ password }) => {
  const dispatch = useDispatch();
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

  return (
    <div className="password">
      <div>{new Date(password.createdAt).toLocaleString("en-US")}</div>
      <h2>Description: {password.name}</h2>
      <h2>Password: {password.password}</h2>
      <div className="password-buttons">
        <div className="changeBtnWrapper">
          <button className="copy">
            <FaClone
              onClick={async (e) => {
                await navigator.clipboard.writeText(password);
                Toast.fire({
                  icon: "success",
                  title: "You have copied the password",
                });
              }}
            />
          </button>
          <button
            onClick={() => dispatch(deletePassword(password._id))}
            className="close"
          >
            <FaTimes />
          </button>
          <button
            onClick={async (e) => {
              const { value: formValues } = await Swal.fire({
                title: "Password Information",
                html:
                  `<input id="swal-input1" class="swal2-input" placeholder="Password" value = ${password.password} />` +
                  `<input id="swal-input2" class="swal2-input" placeholder="Description" value=${password.name}>`,
                focusConfirm: false,
                preConfirm: () => {
                  return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
                  ];
                },
              });

              if (formValues && formValues[0] !== "" && formValues[1] !== "") {
                dispatch(
                  updatePassword({
                    _id: password._id,
                    password: formValues[0],
                    name: formValues[1],
                  })
                );
                Swal.fire({
                  icon: "success",
                  title: "You have successfully saved your password!",
                  footer: '<a href="/passwords">See all saved passwords</a>',
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
            className="edit"
          >
            <FaEdit />
          </button>
        </div>
      </div>
    </div>
  );
};
export default PasswordItem;

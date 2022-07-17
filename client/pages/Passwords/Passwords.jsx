import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPasswords, reset, createPassword } from "../../features/passwords/passwordSlice";
import GridLoader from "react-spinners/GridLoader";
import PasswordItem from "../../components/PasswordItem/PasswordItem";
import Swal from "sweetalert2";


const Passwords = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { passwords, isLoading, isError, message } = useSelector(
    (state) => state.passwords
  );

  useEffect(
    (e) => {
      if (!user) {
        navigate("/login");
      }

      return () => {
        dispatch(reset());
      };
    },
    [user, navigate, isError, message]
  );
  useEffect(() => {
    dispatch(getPasswords());

    return () => dispatch(reset());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="loadingSpinnerContainer">
        <GridLoader size={48} speedMultiplier={1.5} loading={isLoading}/>
      </div>
    );
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome, {user && user.name}</h1>
        <p>Passwords Dashboard</p>
        <button
          className="btn"
          onClick={async (e) => {
            const { value: formValues } = await Swal.fire({
              title: "Password Information",
              html:
                `<input id="swal-input1" class="swal2-input" placeholder="Password"/>` +
                '<input id="swal-input2" class="swal2-input" placeholder="Description">',
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
                createPassword({
                  password: formValues[0],
                  name: formValues[1],
                })
              );
              Swal.fire({
                icon: "success",
                title: "You have successfully saved your password!",
                footer: '<a href="/passwords">See all saved passwords</a>',
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Invalid Data",
                timer: 2000,
              });
            }
          }}
        >
          New Password
        </button>
      </section>
      {passwords && passwords.length > 0 ? (
        <div className="passwords">
          {passwords.map((password) => (
            <PasswordItem
              password={password}
              key={password._id}
              value={password._id}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};
export default Passwords;

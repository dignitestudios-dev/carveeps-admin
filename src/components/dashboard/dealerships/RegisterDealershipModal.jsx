import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../../global/Error";
import { GlobalContext } from "../../../context/GlobalContext";
import axios from "axios";
import Cookies from "js-cookie";
import { validateEmail } from "../../../utils/validators";
import BtnLoader from "../../global/BtnLoader";

const RegisterDealershipModal = ({ isOpen, setIsOpen, updateData }) => {
  const registerDealershipRef = useRef();
  const navigate = useNavigate();
  const [sendToDealer, setIsSendToDealer] = useState(false);

  const toggleModal = (e) => {
    if (!registerDealershipRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const [password, setPassword] = useState("");

  const generateRandomPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let randomPassword = "";

    const getRandomChar = (characters) => {
      return characters.charAt(Math.floor(Math.random() * characters.length));
    };

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const special = "!@#$%^&*()";

    // Ensure at least one character from each set
    randomPassword += getRandomChar(lowercase);
    randomPassword += getRandomChar(uppercase);
    randomPassword += getRandomChar(digits);
    randomPassword += getRandomChar(special);

    // Fill the remaining length with random characters from charset
    for (let i = randomPassword.length; i < length; i++) {
      randomPassword += getRandomChar(charset);
    }

    // Shuffle the password to avoid predictable patterns
    randomPassword = randomPassword
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setPassword(randomPassword);
    return randomPassword;
  };

  const { navigateToLink, baseUrl } = useContext(GlobalContext);

  const [isPassVisible, setIsPassVisible] = useState(false);
  // Error States
  const [emailError, setEmailError] = useState(false);
  const [formError, setFormError] = useState(false);
  // Loading States
  const [loading, setLoading] = useState(false);
  // States to manage the data
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const token = Cookies.get("token");

    if (token) {
      if (email == "") {
        setEmailError("Email is required.");
        setTimeout(() => {
          setEmailError(false);
        }, 3000);
      } else if (!validateEmail(email)) {
        setEmailError("Email not in correct format.");
        setTimeout(() => {
          setEmailError(false);
        }, 3000);
      } else {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        axios
          .post(
            `${baseUrl}/admin/dealership`,
            {
              email: email,
              password: generateRandomPassword(),
            },
            { headers }
          )
          .then(
            (response) => {
              if (response?.status == 201) {
                setIsOpen(false);
                updateData((prev) => !prev);
              }
              setLoading(false);
            },
            (error) => {
              setLoading(false);
              setFormError(error?.response?.data?.message);
            }
          );
      }
    } else {
      navigateToLink("/login", "Login");
    }
  }
  return (
    <div
      onClick={(e) => toggleModal(e)}
      className={`w-screen h-screen flex p-2 items-center justify-center fixed top-0 left-0 z-[1000] transition-all duration-500 ${
        isOpen ? "scale-100 blur-none" : "scale-0 blur-md"
      }`}
    >
      {/* Email Error */}
      {emailError && <Error error={emailError} setError={setEmailError} />}

      {/* Form Error */}
      {formError && <Error error={formError} setError={setFormError} />}
      <div
        ref={registerDealershipRef}
        className="w-[30rem] h-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl bg-white"
      >
        <div className="w-full border-b border-gray-200 h-12 flex items-center justify-center">
          <h1 className="text-xl font-bold">Register Dealership</h1>
        </div>
        <div className="w-full my-4 h-auto flex flex-col justify-start items-start px-4 gap-2">
          <div className="w-full h-auto flex flex-col gap-[2px] justify-start items-start ">
            <label className="text-sm font-medium mx-3 text-gray-900">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. johnarther@gmail.com"
              className="w-full h-12 rounded-full px-4 outline-none focus:border-gray-300 border border-gray-200"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-12 mt-2 rounded-full flex justify-center items-center text-white font-medium bg-[#ff204e] hover:opacity-90 transition-all duration-200"
          >
            {loading ? <BtnLoader /> : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterDealershipModal;

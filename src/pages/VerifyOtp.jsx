import React, { useState, useContext } from "react";
import { AuthMockup, VerifyOtpMockup } from "../assets/export";
import { Link } from "react-router-dom";
import BtnLoader from "../components/global/BtnLoader";
import axios from "axios";
import Cookies from "js-cookie";
import { GlobalContext } from "../context/GlobalContext";
import Error from "../components/global/Error";

const VerifyOtp = () => {
  const { navigateToLink, baseUrl } = useContext(GlobalContext);
  // Error States
  const [otpError, setOTPError] = useState(false);
  const [formError, setFormError] = useState(false);
  // Loading States
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // States to manage the data
  const [otp, setOtp] = useState("");

  function handleVerifyOtp(e) {
    e.preventDefault();
    if (otp == "") {
      setOTPError("OTP is required.");
      setTimeout(() => {
        setOTPError(false);
      }, 3000);
    } else if (otp.length < 6) {
      setOTPError("OTP must contain atleast 6 digits.");
      setTimeout(() => {
        setOTPError(false);
      }, 3000);
    } else {
      setLoading(true);
      axios
        .post(`${baseUrl}/auth/verifyOTP`, {
          email: Cookies.get("email"),
          otp: otp,
          role: "admin",
        })
        .then(
          (response) => {
            Cookies.set("verifyToken", response?.data?.data?.token);
            navigateToLink("/change-password", "Dashboard");
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            setFormError(error?.response?.data?.message);
          }
        );
    }
  }

  function resendOTP(e) {
    e.preventDefault();

    setResendLoading(true);
    axios
      .post(`${baseUrl}/auth/resendOTP`, {
        email: Cookies.get("email"),
        role: "admin",
      })
      .then(
        (response) => {
          setResendLoading(false);
        },
        (error) => {
          setResendLoading(false);
          setFormError(error?.response?.data?.message);
        }
      );
  }

  return (
    <div className="font-[sans-serif] text-[#333]">
      {otpError && <Error error={otpError} setError={setOTPError} />}
      {formError && <Error error={formError} setError={setFormError} />}
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-7xl w-full">
          <div className="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="mb-10">
                <h3 className="text-3xl font-extrabold">Verify OTP</h3>
                <p className="text-sm mt-4">
                  Input the OTP code we've provided at your registered email.
                </p>
              </div>
              <div>
                <label className="text-sm mb-2 block">OTP Code</label>
                <div className="relative flex items-center">
                  <input
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                    placeholder="OTP Code"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="w-auto  flex gap-2 justify-start items-center">
                <span className="text-sm font-medium text-[#7c7c7c]">
                  Didn’t receive the code?{" "}
                </span>
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-[#FF204E] font-bold"
                >
                  {resendLoading ? "Sending" : "Resend"}
                </button>
              </div>

              <div className="!mt-4">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-[#ff204e] hover:opacity-90 focus:outline-none"
                >
                  {loading ? <BtnLoader /> : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
          <div className="lg:h-[550px] md:h-[400px] max-md:mt-10">
            <img
              src={VerifyOtpMockup}
              className="w-full h-full object-cover"
              alt="Authentication Mockup"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

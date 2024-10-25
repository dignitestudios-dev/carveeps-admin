import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";
import BtnLoader from "../components/global/BtnLoader";
import Error from "../components/global/Error";
import { TbPercentage } from "react-icons/tb";
import { FiDollarSign } from "react-icons/fi";
import Success from "../components/global/Success";

const CommissionSettings = () => {
  const [config, setConfig] = useState({});
  const { baseUrl, navigateToLink, setError, error, success, setSuccess } =
    useContext(GlobalContext);
  const [configLoading, setConfigLoading] = useState(false);
  const [yearly, setYearly] = useState("");
  const [biAnnual, setBiAnnual] = useState("");
  const [monthly, setMonhtly] = useState("");
  const [update, setUpdate] = useState(false);

  const getConfig = () => {
    const token = Cookies.get("token");

    if (token) {
      setConfigLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios.get(`${baseUrl}/admin/config`, { headers }).then(
        (response) => {
          const data = response?.data?.data?.commissionSettings;
          setConfig(response?.data?.data?.commissionSettings);
          setYearly(data?.yearlyAmount);
          setBiAnnual(data?.biannualAmount);
          setMonhtly(data?.monthlyAmount);
          setConfigLoading(false);
        },
        (error) => {
          setConfigLoading(false);
          if (error?.response?.status == 401) {
            Cookies.remove("token");
            navigateToLink("/login");
          }
        }
      );
    } else {
      navigateToLink("/login");
    }
  };

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("percentage");

  const updateConfig = (e) => {
    e.preventDefault();

    if (yearly == "") {
      setError("Yearly commission cannot be left empty.");
      return;
    }
    if (biAnnual == "") {
      setError("Bi-Annual commission cannot be left empty.");
      return;
    }
    if (monthly == "") {
      setError("Monthly commission cannot be left empty.");
      return;
    }
    const token = Cookies.get("token");

    if (token) {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .put(
          `${baseUrl}/admin/config`,
          {
            commissionSettings: {
              commissionType: tab,
              yearlyAmount: yearly,
              biannualAmount: biAnnual,
              monthlyAmount: monthly,
            },
          },
          { headers }
        )
        .then(
          (response) => {
            setLoading(false);
            setUpdate((prev) => !prev);
            setSuccess("Commission updated successfully.");
          },
          (error) => {
            setError(error?.response?.data?.message);
            setLoading(false);
            if (error?.response?.status == 401) {
              Cookies.remove("token");
              navigateToLink("/login");
            }
          }
        );
    } else {
      navigateToLink("/login");
    }
  };

  useEffect(() => {
    getConfig();
  }, [update, tab]);

  return (
    <div className="font-[sans-serif] h-[calc(100vh-4rem)] w-full -p-6 bg-[url('/bg.png')] bg-cover bg-no-repeat text-[#333]">
      {/* Email Error */}
      {/* {passwordError && (
    <Error error={passwordError} setError={setPasswordError} />
  )} */}

      {/* Form Error */}
      {error && <Error error={error} setError={setError} />}
      {/* Form Success */}
      {success && <Success success={success} setSuccess={setSuccess} />}
      <div className=" flex flex-col items-center h-full justify-center py-6 px-4">
        <div className=" w-full h-full flex justify-center items-center gap-4 ">
          <div className="border w-full lg:w-96 border-gray-300 bg-white rounded-md p-6  max-md:mx-auto">
            <form onSubmit={updateConfig} className="space-y-6">
              <div className="">
                <h3 className="text-2xl font-extrabold">Update Commission.</h3>
                <p className="text-sm mt-4">Update commission of each plan!</p>
              </div>

              <div className="w-full mb-10 flex justify-end items-center">
                {/* <div className="w-auto flex justify-start items-start">
                  <button
                    type="button"
                    onClick={() => setTab("percentage")}
                    className={`w-24 h-8 rounded-l-full flex items-center justify-center text-sm ${
                      tab == "percentage"
                        ? "text-white bg-[#ff204e]"
                        : "text-[#262626] bg-gray-100"
                    }`}
                  >
                    Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("fixed")}
                    className={`w-24 h-8 rounded-r-full flex items-center justify-center text-sm ${
                      tab == "fixed"
                        ? "text-white bg-[#ff204e]"
                        : "text-[#262626] bg-gray-100"
                    }`}
                  >
                    Fixed
                  </button>
                </div> */}
              </div>
              <div>
                <label className="text-sm mb-2 block">Yearly</label>
                <div className="relative flex items-center">
                  <input
                    name="pass1"
                    type="tel" // Changed from 'text' to 'tel'
                    inputMode="numeric"
                    maxLength={2}
                    value={yearly}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setYearly(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                    placeholder="Yearly"
                  />
                  {tab == "percentage" ? (
                    <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700 cursor-pointer" />
                  ) : (
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700 cursor-pointer" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm mb-2 block">Bi-Annual</label>
                <div className="relative flex items-center">
                  <input
                    name="pass1"
                    value={biAnnual}
                    type="tel"
                    inputMode="numeric"
                    maxLength={2}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                      setBiAnnual(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                    placeholder="Bi-Annual"
                  />
                  {tab == "percentage" ? (
                    <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700 cursor-pointer" />
                  ) : (
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700 cursor-pointer" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm mb-2 block">Monthly</label>
                <div className="relative flex items-center">
                  <input
                    name="pass1"
                    value={monthly}
                    type="tel" // Changed from 'text' to 'tel'
                    inputMode="numeric"
                    maxLength={2}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setMonhtly(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                    placeholder="Monthly"
                  />
                  {tab == "percentage" ? (
                    <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700 cursor-pointer" />
                  ) : (
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700 cursor-pointer" />
                  )}
                </div>
              </div>

              <div className="!mt-4">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-[#ff204e] hover:opacity-90 focus:outline-none"
                >
                  {loading ? <BtnLoader /> : "Update Commission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettings;

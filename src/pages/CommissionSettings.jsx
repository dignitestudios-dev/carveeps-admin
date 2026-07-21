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

  const [freeYearly, setFreeYearly] = useState("");
  const [freeBiAnnual, setFreeBiAnnual] = useState("");
  const [freeMonthly, setFreeMonthly] = useState("");

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

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
          const freeData = response?.data?.data?.freeCommissionSettings;
          setConfig(response?.data?.data?.commissionSettings);
          setYearly(data?.yearlyAmount !== undefined ? data.yearlyAmount : "");
          setBiAnnual(data?.biannualAmount !== undefined ? data.biannualAmount : "");
          setMonhtly(data?.monthlyAmount !== undefined ? data.monthlyAmount : "");

          setFreeYearly(freeData?.yearlyAmount !== undefined ? freeData.yearlyAmount : "");
          setFreeBiAnnual(freeData?.biannualAmount !== undefined ? freeData.biannualAmount : "");
          setFreeMonthly(freeData?.monthlyAmount !== undefined ? freeData.monthlyAmount : "");

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

  const updateConfig = (e) => {
    e.preventDefault();

    if (yearly === "") {
      setError("Yearly commission cannot be left empty.");
      return;
    }
    if (biAnnual === "") {
      setError("Bi-Annual commission cannot be left empty.");
      return;
    }
    if (monthly === "") {
      setError("Monthly commission cannot be left empty.");
      return;
    }
    if (freeYearly === "") {
      setError("Free plan yearly commission cannot be left empty.");
      return;
    }
    if (freeBiAnnual === "") {
      setError("Free plan bi-annual commission cannot be left empty.");
      return;
    }
    if (freeMonthly === "") {
      setError("Free plan monthly commission cannot be left empty.");
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
              commissionType: "percentage",
              yearlyAmount: Number(yearly),
              biannualAmount: Number(biAnnual),
              monthlyAmount: Number(monthly),
            },
            freeCommissionSettings: {
              yearlyAmount: Number(freeYearly),
              biannualAmount: Number(freeBiAnnual),
              monthlyAmount: Number(freeMonthly),
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
  }, [update]);

  return (
    <div className="font-[sans-serif] h-[calc(100vh-4rem)] w-full -p-6 bg-[url('/bg.png')] bg-cover bg-no-repeat text-[#333] overflow-y-auto">
      {/* Form Error */}
      {error && <Error error={error} setError={setError} />}
      {/* Form Success */}
      {success && <Success success={success} setSuccess={setSuccess} />}

      <div className="flex flex-col items-center min-h-full justify-center py-6 px-4">
        <div className="w-full h-auto flex justify-center items-center gap-4 my-6">
          <div className="border w-full lg:w-[450px] border-gray-300 bg-white rounded-md p-6 max-md:mx-auto shadow-md">
            <form onSubmit={updateConfig} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-extrabold">Update Commission</h3>
                  <p className="text-sm mt-1 text-gray-500">Update commission of each plan!</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-[#ff204e]">
                  Percentage Based
                </span>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Yearly</label>
                <div className="relative flex items-center">
                  <input
                    name="yearly"
                    type="tel"
                    inputMode="numeric"
                    maxLength={2}
                    value={yearly}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setYearly(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333]"
                    placeholder="Yearly"
                  />
                  <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Bi-Annual</label>
                <div className="relative flex items-center">
                  <input
                    name="biAnnual"
                    value={biAnnual}
                    type="tel"
                    inputMode="numeric"
                    maxLength={2}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setBiAnnual(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333]"
                    placeholder="Bi-Annual"
                  />
                  <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Monthly</label>
                <div className="relative flex items-center">
                  <input
                    name="monthly"
                    value={monthly}
                    type="tel"
                    inputMode="numeric"
                    maxLength={2}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setMonhtly(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333]"
                    placeholder="Monthly"
                  />
                  <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <div>
                  <h4 className="text-md font-bold text-gray-800">Global Free Plan Commissions</h4>
                  <p className="text-xs text-gray-500 mt-1">Set the fixed commission rates for the free subscription plan.</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full text-nowrap bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  Fixed Amount
                </span>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Free Plan Yearly</label>
                <div className="relative flex items-center">
                  <input
                    name="freeYearly"
                    type="tel"
                    inputMode="numeric"
                    maxLength={5}
                    value={freeYearly}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFreeYearly(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333]"
                    placeholder="Yearly Amount"
                  />
                  <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Free Plan Bi-Annual</label>
                <div className="relative flex items-center">
                  <input
                    name="freeBiAnnual"
                    type="tel"
                    inputMode="numeric"
                    maxLength={5}
                    value={freeBiAnnual}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFreeBiAnnual(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333]"
                    placeholder="Bi-Annual Amount"
                  />
                  <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Free Plan Monthly</label>
                <div className="relative flex items-center">
                  <input
                    name="freeMonthly"
                    type="tel"
                    inputMode="numeric"
                    maxLength={5}
                    value={freeMonthly}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFreeMonthly(value);
                    }}
                    className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333]"
                    placeholder="Monthly Amount"
                  />
                  <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-[#ff204e] hover:opacity-90 transition-all focus:outline-none"
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

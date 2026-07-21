import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AmericaIcon } from "../assets/export";
import { CiGlobe } from "react-icons/ci";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import Cookies from "js-cookie";
import { TbPercentage } from "react-icons/tb";
import { FiDollarSign } from "react-icons/fi";
import BtnLoader from "../components/global/BtnLoader";
import Error from "../components/global/Error";
import Success from "../components/global/Success";

const DealersProfile = () => {
  const { navigateToLink, baseUrl, error, setError, success, setSuccess } = useContext(GlobalContext);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { id } = useParams();

  // Tab Control
  const [activeTab, setActiveTab] = useState("profile");

  // Commission override states
  const [overrideGlobal, setOverrideGlobal] = useState(false);
  const [yearly, setYearly] = useState("");
  const [biAnnual, setBiAnnual] = useState("");
  const [monthly, setMonthly] = useState("");
  const [freeYearly, setFreeYearly] = useState("");
  const [freeBiAnnual, setFreeBiAnnual] = useState("");
  const [freeMonthly, setFreeMonthly] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const getProfile = () => {
    const token = Cookies.get("token");
    if (token) {
      setProfileLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`${baseUrl}/dealership?dealershipId=${id}`, { headers })
        .then((response) => {
          setProfile(response?.data?.data);
          setProfileLoading(false);
        })
        .catch((error) => {
          setProfileLoading(false);
          setError(error?.response?.data?.message || "Failed to load profile.");
        });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      const isCustom = profile.commissionSettings !== null || profile.freeCommissionSettings !== null;
      setOverrideGlobal(isCustom);

      const comm = profile.commissionSettings;
      const freeComm = profile.freeCommissionSettings;

      setYearly(comm?.yearlyAmount !== undefined && comm?.yearlyAmount !== null ? String(comm.yearlyAmount) : "");
      setBiAnnual(comm?.biannualAmount !== undefined && comm?.biannualAmount !== null ? String(comm.biannualAmount) : "");
      setMonthly(comm?.monthlyAmount !== undefined && comm?.monthlyAmount !== null ? String(comm.monthlyAmount) : "");

      setFreeYearly(freeComm?.yearlyAmount !== undefined && freeComm?.yearlyAmount !== null ? String(freeComm.yearlyAmount) : "");
      setFreeBiAnnual(freeComm?.biannualAmount !== undefined && freeComm?.biannualAmount !== null ? String(freeComm.biannualAmount) : "");
      setFreeMonthly(freeComm?.monthlyAmount !== undefined && freeComm?.monthlyAmount !== null ? String(freeComm.monthlyAmount) : "");
    }
  }, [profile]);

  const saveCommission = (e) => {
    e.preventDefault();

    let payload = {
      commissionSettings: null,
      freeCommissionSettings: null,
    };

    if (overrideGlobal) {
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

      payload = {
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
      };
    }

    const token = Cookies.get("token");
    if (token) {
      setSaveLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .put(`${baseUrl}/admin/dealership/${id}/commission`, payload, { headers })
        .then((response) => {
          setSaveLoading(false);
          setSuccess("Dealership commission updated successfully.");
          getProfile();
        })
        .catch((error) => {
          setSaveLoading(false);
          setError(error?.response?.data?.message || "Failed to update commission settings.");
        });
    } else {
      navigateToLink("/login");
    }
  };

  return profileLoading ? (
    <div className="w-full flex flex-col p-6 justify-start items-start gap-3 animate-pulse">
      <div className="w-full h-auto rounded-3xl flex flex-col justify-start items-start bg-white">
        <div className="w-full h-auto min-h-36 p-4 flex flex-col relative justify-start items-start gap-3 px-4">
          <div className="w-48 h-8 bg-gray-300 rounded mb-4"></div>
          <div className="w-full gap-3 lg:gap-8 flex justify-start items-center">
            <div className="lg:w-32 w-20 h-20 bg-gray-200 lg:h-32 rounded-full"></div>
            <div className="w-auto flex flex-col justify-start items-start">
              <div className="w-32 h-6 bg-gray-300 rounded mb-2"></div>
              <div className="w-48 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="w-48 h-10 bg-gray-300 rounded absolute bottom-4 right-4"></div>
        </div>
        <div className="w-full flex flex-col p-4 lg:p-12 justify-start items-start gap-8 border-t-2 border-[#D2D2D2]">
          <div className="w-48 h-8 bg-gray-300 rounded mb-4"></div>
          <div className="w-full h-auto gap-4 lg:gap-16 grid grid-cols-1 relative md:grid-cols-2 lg:grid-cols-3">
            <div className="w-full flex flex-col gap-4 lg:gap-12 justify-start items-start">
              <div className="w-auto flex flex-col justify-start items-start">
                <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="w-auto flex flex-col justify-start items-start">
                <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex justify-end">
        <div className="w-48 h-14 mt-10 rounded-lg flex items-center justify-center bg-gray-200"></div>
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      {error && <Error error={error} setError={setError} />}
      {success && <Success success={success} setSuccess={setSuccess} />}

      <div className="w-full h-auto rounded-3xl flex flex-col justify-start items-start border bg-white shadow-sm">
        <div className="w-full h-auto min-h-36 p-6 flex flex-col relative justify-start items-start gap-3 px-6">
          <h1 className="text-2xl font-bold text-black ml-2 animate-fade-in">
            Dealership's Profile
          </h1>
          <div className="w-full gap-3 lg:gap-8 flex justify-start items-center">
            <div className="lg:w-32 w-20 h-20 lg:h-32 rounded-full">
              <img
                src={
                  profile?.logo
                    ? profile?.logo
                    : "https://dummyimage.com/600x400/000/fff"
                }
                className="w-20 h-20 bg-gray-200 lg:h-32 lg:w-32 rounded-full border-4 border-[#D2D2D2] object-cover"
                alt="Dealer Logo"
              />
            </div>
            <div className="w-auto flex flex-col justify-start items-start">
              <h1 className="text-lg lg:text-2xl font-bold text-black">
                {profile?.name ? profile?.name : "N/A"}
              </h1>
              <span className="flex gap-2 justify-start items-center">
                <img src={AmericaIcon} alt="Country Icon" />
                <p className="text-sm lg:text-lg font-medium text-[#7c7c7c]">
                  {profile?.city ? profile?.city : "N/A"},{" "}
                  {profile?.country ? profile?.country : "N/A"}
                </p>
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex border-t-2 border-[#D2D2D2] px-6 lg:px-12 pt-4 bg-gray-50/50">
          <button
            onClick={() => {
              setActiveTab("profile");
              setError(false);
              setSuccess(false);
            }}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-[#ff204e] text-[#ff204e]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => {
              setActiveTab("commission");
              setError(false);
              setSuccess(false);
            }}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "commission"
                ? "border-[#ff204e] text-[#ff204e]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Commission Settings
          </button>
        </div>

        {activeTab === "profile" ? (
          <>
            {/* Business Details */}
            <div className="w-full flex flex-col p-4 lg:p-12 justify-start items-start gap-8 border-t-2 border-[#D2D2D2]">
              <h1 className="text-2xl font-bold text-black">Business Details</h1>

              <div className="w-full h-auto gap-4 lg:gap-16 grid grid-cols-1 relative md:grid-cols-2 lg:grid-cols-3">
                <div className="w-full flex flex-col gap-4 lg:gap-12 justify-start items-start">
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Full Name
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.name ? profile?.name : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Phone Number
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.phoneNumber ? profile?.phoneNumber : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Country
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.country ? profile?.country : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      State
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.state ? profile?.state : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-4 lg:gap-12 justify-start items-start">
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Email
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.email ? profile?.email : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Street Address
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.address ? profile?.address : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      City
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.city ? profile?.city : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Zip Code
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.zipCode ? profile?.zipCode : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="w-full flex flex-col p-4 lg:p-12 justify-start items-start gap-8 border-t-2 border-[#D2D2D2]">
              <h1 className="text-2xl font-bold text-black">Contact Information</h1>

              <div className="w-full h-auto gap-4 lg:gap-16 grid grid-cols-1 relative md:grid-cols-2 lg:grid-cols-3">
                <div className="w-full flex flex-col gap-4 lg:gap-12 justify-start items-start">
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Email
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.email ? profile?.email : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-4 lg:gap-12 justify-start items-start">
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Phone Number
                    </label>
                    <span className="text-sm font-medium text-black">
                      {profile?.phoneNumber ? profile?.phoneNumber : "N/A"}
                    </span>
                  </div>
                  <div className="w-auto h-auto flex flex-col gap-2 justify-start items-start">
                    {profile?.website && (
                      <a
                        href={profile?.website}
                        target="_blank"
                        rel="noreferrer"
                        className="w-auto flex justify-start items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#ff204e] text-white text-sm">
                          <CiGlobe />
                        </span>
                        <span className="text-sm font-medium text-black hover:text-[#ff204e]">
                          Website
                        </span>
                      </a>
                    )}
                    {profile?.facebook && (
                      <a
                        href={profile?.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="w-auto flex justify-start items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#ff204e] text-white text-sm">
                          <FaFacebook />
                        </span>
                        <span className="text-sm font-medium text-black hover:text-[#ff204e]">
                          Facebook
                        </span>
                      </a>
                    )}
                    {profile?.instagram && (
                      <a
                        href={profile?.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="w-auto flex justify-start items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#ff204e] text-white text-sm">
                          <FaInstagram />
                        </span>
                        <span className="text-sm font-medium text-black hover:text-[#ff204e]">
                          Instagram
                        </span>
                      </a>
                    )}
                    {profile?.twitter && (
                      <a
                        href={profile?.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="w-auto flex justify-start items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#ff204e] text-white text-sm">
                          <FaTwitter />
                        </span>
                        <span className="text-sm font-medium text-black hover:text-[#ff204e]">
                          Twitter
                        </span>
                      </a>
                    )}
                    {profile?.linkedin && (
                      <a
                        href={profile?.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-auto flex justify-start items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#ff204e] text-white text-sm">
                          <FaLinkedin />
                        </span>
                        <span className="text-sm font-medium text-black hover:text-[#ff204e]">
                          Linkedin
                        </span>
                      </a>
                    )}
                    {profile?.tiktok && (
                      <a
                        href={profile?.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="w-auto flex justify-start items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#ff204e] text-white text-sm">
                          <FaTiktok />
                        </span>
                        <span className="text-sm font-medium text-black hover:text-[#ff204e]">
                          Tiktok
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col p-4 lg:p-12 justify-start items-start gap-8 border-t-2 border-[#D2D2D2] bg-white animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Commission Overrides</h2>
              <p className="text-sm text-gray-500 mt-1">Set custom commission percentages or fixed amounts for this dealer.</p>
            </div>

            <form onSubmit={saveCommission} className="w-full max-w-xl space-y-6">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideGlobal}
                    onChange={(e) => setOverrideGlobal(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff204e]"></div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 select-none">
                    Override Global Settings
                  </span>
                </label>
              </div>

              {/* Standard Commissions */}
              <div className={`space-y-4 transition-all duration-200 ${!overrideGlobal ? "opacity-40 pointer-events-none" : ""}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-gray-800">Standard Commission Settings</h3>
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
                      disabled={!overrideGlobal}
                      value={yearly}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setYearly(value);
                      }}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                      disabled={!overrideGlobal}
                      value={biAnnual}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setBiAnnual(value);
                      }}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                      disabled={!overrideGlobal}
                      value={monthly}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setMonthly(value);
                      }}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Monthly"
                    />
                    <TbPercentage className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Free Plan Commissions */}
              <div className={`space-y-4 border-t border-gray-155 pt-6 transition-all duration-200 ${!overrideGlobal ? "opacity-40 pointer-events-none" : ""}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-bold text-gray-800">Free Plan Commission Settings</h3>
                    <p className="text-xs text-gray-500 mt-1">Set the fixed commission rates for the free subscription plan.</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    Fixed Amount
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Free Plan Yearly</label>
                  <div className="relative flex items-center">
                    <input
                      name="freeYearly"
                      disabled={!overrideGlobal}
                      type="tel"
                      inputMode="numeric"
                      maxLength={5}
                      value={freeYearly}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setFreeYearly(value);
                      }}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                      disabled={!overrideGlobal}
                      type="tel"
                      inputMode="numeric"
                      maxLength={5}
                      value={freeBiAnnual}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setFreeBiAnnual(value);
                      }}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                      disabled={!overrideGlobal}
                      type="tel"
                      inputMode="numeric"
                      maxLength={5}
                      value={freeMonthly}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setFreeMonthly(value);
                      }}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Monthly Amount"
                    />
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-md text-white bg-[#ff204e] hover:opacity-90 transition-all focus:outline-none flex justify-center items-center"
                >
                  {saveLoading ? <BtnLoader /> : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="w-full h-auto flex justify-end">
        <button
          onClick={() => navigateToLink(-1, "Dealerships")}
          className="w-48 h-14 mt-10 rounded-full flex items-center justify-center bg-[#FF204E]/[0.05] text-[#FF204E] text-md font-medium hover:bg-[#FF204E]/[0.10] transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default DealersProfile;

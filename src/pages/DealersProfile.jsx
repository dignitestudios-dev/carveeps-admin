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
import DealershipSubscriptionPlans from "../components/dashboard/dealerships/DealershipSubscriptionPlans";

const DealersProfile = () => {
  const { navigateToLink, baseUrl, error, setError, success, setSuccess, clearAuth } =
    useContext(GlobalContext);
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
          if (error?.response?.status === 401) {
            clearAuth();
            navigateToLink("/login");
          } else {
            setError(error?.response?.data?.message || "Failed to load profile.");
          }
        });
    } else {
      clearAuth();
      navigateToLink("/login");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      const isCustom =
        profile.commissionSettings !== null ||
        profile.freeCommissionSettings !== null;
      setOverrideGlobal(isCustom);

      const comm = profile.commissionSettings;
      const freeComm = profile.freeCommissionSettings;

      setYearly(
        comm?.yearlyAmount !== undefined && comm?.yearlyAmount !== null
          ? String(comm.yearlyAmount)
          : ""
      );
      setBiAnnual(
        comm?.biannualAmount !== undefined && comm?.biannualAmount !== null
          ? String(comm.biannualAmount)
          : ""
      );
      setMonthly(
        comm?.monthlyAmount !== undefined && comm?.monthlyAmount !== null
          ? String(comm.monthlyAmount)
          : ""
      );

      setFreeYearly(
        freeComm?.yearlyAmount !== undefined && freeComm?.yearlyAmount !== null
          ? String(freeComm.yearlyAmount)
          : ""
      );
      setFreeBiAnnual(
        freeComm?.biannualAmount !== undefined &&
          freeComm?.biannualAmount !== null
          ? String(freeComm.biannualAmount)
          : ""
      );
      setFreeMonthly(
        freeComm?.monthlyAmount !== undefined && freeComm?.monthlyAmount !== null
          ? String(freeComm.monthlyAmount)
          : ""
      );
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

      payload = {
        commissionSettings: {
          yearlyAmount: Number(yearly),
          biannualAmount: Number(biAnnual),
          monthlyAmount: Number(monthly),
        },
        freeCommissionSettings: {
          yearlyAmount: freeYearly !== "" ? Number(freeYearly) : 0,
          biannualAmount: freeBiAnnual !== "" ? Number(freeBiAnnual) : 0,
          monthlyAmount: freeMonthly !== "" ? Number(freeMonthly) : 0,
        },
      };
    }

    const token = Cookies.get("token");
    if (!token) {
      clearAuth();
      navigateToLink("/login");
      return;
    }

    setSaveLoading(true);
    axios
      .put(
        `${baseUrl}/admin/dealership/${id}/commission`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setSaveLoading(false);
        setSuccess("Commission settings updated successfully.");
        getProfile();
      })
      .catch((err) => {
        setSaveLoading(false);
        setError(
          err?.response?.data?.message || "Failed to update commission settings."
        );
      });
  };

  return (
    <div className="w-full p-4 lg:p-8 flex flex-col justify-start items-start gap-4">
      {error && <Error error={error} setError={setError} />}
      {success && <Success success={success} setSuccess={setSuccess} />}

      <div className="w-full h-auto flex flex-col justify-start items-start gap-4 bg-white border-2 border-[#D2D2D2] rounded-3xl overflow-hidden">
        {/* Dealership Banner / Header */}
        <div className="w-full flex flex-col p-4 lg:p-12 justify-start items-start gap-6">
          <h1 className="text-xl lg:text-3xl font-bold text-black">
            Dealership's Profile
          </h1>
          <div className="w-auto flex gap-4 lg:gap-8 justify-start items-center">
            <div className="w-auto relative flex justify-start items-center">
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

        {/* Tab Controls */}
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
          <button
            onClick={() => {
              setActiveTab("subscriptions");
              setError(false);
              setSuccess(false);
            }}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "subscriptions"
                ? "border-[#ff204e] text-[#ff204e]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Subscriptions
          </button>
        </div>

        {/* Tab Content */}
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
                    <p className="text-base font-semibold text-black">
                      {profile?.name ? profile?.name : "N/A"}
                    </p>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Phone Number
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.phoneNumber ? profile?.phoneNumber : "N/A"}
                    </p>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Country
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.country ? profile?.country : "N/A"}
                    </p>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      State
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.state ? profile?.state : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4 lg:gap-12 justify-start items-start">
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Email
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.email ? profile?.email : "N/A"}
                    </p>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Street Address
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.address ? profile?.address : "N/A"}
                    </p>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      City
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.city ? profile?.city : "N/A"}
                    </p>
                  </div>
                  <div className="w-auto flex flex-col justify-start items-start">
                    <label className="text-sm font-medium text-[#7c7c7c]">
                      Zip Code
                    </label>
                    <p className="text-base font-semibold text-black">
                      {profile?.zipCode ? profile?.zipCode : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4 lg:gap-6 justify-start items-start">
                  <label className="text-sm font-medium text-[#7c7c7c]">
                    Social Links
                  </label>
                  <div className="w-full flex flex-col gap-3">
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
        ) : activeTab === "commission" ? (
          <div className="w-full flex flex-col p-4 lg:p-12 justify-start items-start gap-8 border-t-2 border-[#D2D2D2] bg-white animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Commission Overrides</h2>
              <p className="text-sm text-gray-500 mt-1">
                Set custom commission percentages or fixed amounts for this dealer.
              </p>
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
                </label>
                <div>
                  <span className="text-sm font-semibold text-gray-800 block">
                    Override Global Commission
                  </span>
                  <span className="text-xs text-gray-400">
                    Enable to define specific commission amounts for this dealership.
                  </span>
                </div>
              </div>

              {/* Paid Plans Commission */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                  Paid Plans Commission
                </h3>
                <div>
                  <label className="text-sm font-medium mb-1 block">Yearly</label>
                  <div className="relative flex items-center">
                    <input
                      name="yearly"
                      disabled={!overrideGlobal}
                      value={yearly}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
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

              {/* Free Plans Commission */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                  Free Plans Commission
                </h3>
                <div>
                  <label className="text-sm font-medium mb-1 block">Yearly</label>
                  <div className="relative flex items-center">
                    <input
                      name="freeYearly"
                      disabled={!overrideGlobal}
                      value={freeYearly}
                      type="number"
                      onChange={(e) => setFreeYearly(e.target.value)}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Yearly"
                    />
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Bi-Annual</label>
                  <div className="relative flex items-center">
                    <input
                      name="freeBiAnnual"
                      disabled={!overrideGlobal}
                      value={freeBiAnnual}
                      type="number"
                      onChange={(e) => setFreeBiAnnual(e.target.value)}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Bi-Annual"
                    />
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Monthly</label>
                  <div className="relative flex items-center">
                    <input
                      name="freeMonthly"
                      disabled={!overrideGlobal}
                      value={freeMonthly}
                      type="number"
                      onChange={(e) => setFreeMonthly(e.target.value)}
                      className="w-full text-sm border border-gray-300 px-4 py-2.5 rounded-md outline-[#333] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Monthly"
                    />
                    <FiDollarSign className="w-[18px] h-[18px] absolute right-4 text-gray-700" />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full py-3 px-4 text-sm font-semibold rounded-full text-white bg-[#ff204e] hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saveLoading ? <BtnLoader /> : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full flex flex-col border-t-2 border-[#D2D2D2] bg-white">
            <DealershipSubscriptionPlans
              dealershipId={id}
              hideDealershipFilter={true}
            />
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

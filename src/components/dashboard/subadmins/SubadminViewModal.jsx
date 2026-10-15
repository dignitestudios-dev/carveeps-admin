import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GlobalContext } from "../../../context/GlobalContext";
import { ADMIN_MODULES } from "../../../constants/modules";
import Loader from "../../global/Loader";
import {
  LuMail,
  LuPhone,
  LuBriefcase,
  LuShield,
  LuCalendar,
  LuCheckCircle2,
  LuXCircle,
  LuPencil,
} from "react-icons/lu";

const SubadminViewModal = ({
  isOpen,
  setIsOpen,
  subAdminId,
  initialData,
  onEditClick,
}) => {
  const modalRef = useRef();
  const { baseUrl, clearAuth, navigateToLink } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData || null);

  useEffect(() => {
    if (!subAdminId && !initialData) return;

    if (subAdminId) {
      const token = Cookies.get("token");
      if (!token) {
        clearAuth();
        navigateToLink("/login");
        return;
      }

      setLoading(true);
      axios
        .get(`${baseUrl}/admin/subadmin/${subAdminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setLoading(false);
          setData(res?.data?.data || initialData);
        })
        .catch(() => {
          setLoading(false);
          if (!data && initialData) setData(initialData);
        });
    } else {
      setData(initialData);
    }
  }, [subAdminId, initialData, isOpen]);

  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const permissions = data?.permissions || [];
  const roleName =
    typeof data?.role === "object"
      ? data?.role?.name
      : data?.role || "Custom Access";

  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen flex p-4 items-center justify-center fixed top-0 left-0 z-[1000] bg-black/50 backdrop-blur-xs transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        className="w-[38rem] max-w-full shadow-2xl rounded-3xl bg-white flex flex-col overflow-hidden transition-all duration-300 max-h-[90vh]"
      >
        <div className="w-full border-b border-gray-100 py-4 px-6 flex items-center justify-between bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-50 text-[#ff204e] flex items-center justify-center text-lg">
              <LuShield />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Subadmin Profile</h2>
              <p className="text-xs text-gray-500">
                Detailed staff profile and granted access permissions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200/60 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-xl font-light cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="w-full p-6 flex flex-col gap-5 overflow-y-auto">
          {loading ? (
            <div className="py-12">
              <Loader />
            </div>
          ) : !data ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No subadmin data found.
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-50/50 via-white to-gray-50 border border-red-100/60 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#ff204e] text-white flex items-center justify-center text-xl font-bold uppercase shadow-sm">
                    {data?.name ? data.name.charAt(0) : "S"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {data?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-gray-600">
                        {data?.jobTitle || "Subadmin"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff204e]/10 text-[#ff204e]">
                        {roleName}
                      </span>
                    </div>
                  </div>
                </div>

                {onEditClick && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onEditClick(data);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-[#ff204e] hover:text-[#ff204e] text-gray-700 text-xs font-semibold transition-all shadow-2xs bg-white cursor-pointer"
                  >
                    <LuPencil className="text-xs" /> Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <LuMail className="text-base text-gray-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                      Email
                    </span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {data?.email || "—"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <LuPhone className="text-base text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                      Phone Number
                    </span>
                    <span className="font-semibold text-gray-800 block">
                      {data?.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <LuBriefcase className="text-base text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                      Role Template
                    </span>
                    <span className="font-semibold text-gray-800 block">
                      {roleName}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <LuCalendar className="text-base text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                      Member Since
                    </span>
                    <span className="font-semibold text-gray-800 block">
                      {data?.createdAt
                        ? new Date(data.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Granted Module Permissions
                  </span>
                  <span className="text-xs font-semibold text-[#ff204e] bg-red-50 px-2.5 py-0.5 rounded-full">
                    {permissions.length} of {ADMIN_MODULES.length} Granted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {ADMIN_MODULES.map((mod) => {
                    const isAllowed = permissions.includes(mod.key);
                    return (
                      <div
                        key={mod.key}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isAllowed
                            ? "border-green-200 bg-green-50/40"
                            : "border-gray-150 bg-gray-50/50 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-xs font-bold ${
                              isAllowed ? "text-green-800" : "text-gray-600"
                            }`}
                          >
                            {mod.label}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {mod.description}
                          </span>
                        </div>
                        {isAllowed ? (
                          <LuCheckCircle2 className="text-green-600 text-base shrink-0" />
                        ) : (
                          <LuXCircle className="text-gray-300 text-base shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubadminViewModal;

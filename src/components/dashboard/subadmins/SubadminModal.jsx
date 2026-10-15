import React, { useContext, useRef, useState, useEffect } from "react";
import Error from "../../global/Error";
import { GlobalContext } from "../../../context/GlobalContext";
import axios from "axios";
import Cookies from "js-cookie";
import BtnLoader from "../../global/BtnLoader";
import { ADMIN_MODULES } from "../../../constants/modules";
import { validateEmail } from "../../../utils/validators";
import {
  LuUser,
  LuMail,
  LuBriefcase,
  LuPhone,
  LuLock,
  LuEye,
  LuEyeOff,
  LuSparkles,
  LuCheck,
  LuShield,
  LuX,
} from "react-icons/lu";

const SubadminModal = ({
  isOpen,
  setIsOpen,
  subadmin,
  rolesList,
  updateData,
}) => {
  const modalRef = useRef();
  const { navigateToLink, baseUrl, setSuccess, clearAuth } =
    useContext(GlobalContext);

  const isEdit = Boolean(subadmin);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize data on mount or subadmin change
  useEffect(() => {
    if (subadmin) {
      setName(subadmin.name || "");
      setEmail(subadmin.email || "");
      setJobTitle(subadmin.jobTitle || "");
      setPhoneNumber(subadmin.phoneNumber || "");
      setPassword("");
      // Role can be an object { _id, name } or a string id
      const roleId =
        typeof subadmin.role === "object"
          ? subadmin.role?._id || ""
          : subadmin.role || "";
      setSelectedRole(roleId);
      setSelectedPermissions(subadmin.permissions || []);
    } else {
      setName("");
      setEmail("");
      setJobTitle("");
      setPhoneNumber("");
      setPassword("");
      setSelectedRole("");
      setSelectedPermissions([]);
    }
    setFormError(false);
  }, [subadmin, isOpen]);

  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // When a role is picked:
  // Pre-fill from selected role's permissions, but let admin still check/uncheck
  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    if (!roleId) return;

    const matchedRole = rolesList.find((r) => r._id === roleId);
    if (matchedRole && Array.isArray(matchedRole.permissions)) {
      setSelectedPermissions([...matchedRole.permissions]);
    }
  };

  const handlePermissionToggle = (moduleKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(moduleKey)
        ? prev.filter((p) => p !== moduleKey)
        : [...prev, moduleKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions(ADMIN_MODULES.map((m) => m.key));
  };

  const handleClearPermissions = () => {
    setSelectedPermissions([]);
  };

  const generateRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) {
      setFormError("Full name is required.");
      return;
    }

    if (!email.trim()) {
      setFormError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!isEdit) {
      if (!password) {
        setFormError("Password is required for new subadmin accounts.");
        return;
      }
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters long.");
        return;
      }
    }

    const token = Cookies.get("token");
    if (!token) {
      clearAuth();
      navigateToLink("/login");
      return;
    }

    setLoading(true);
    setFormError(false);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (isEdit) {
      // Edit payload: subAdminId goes in the body
      const payload = {
        subAdminId: subadmin._id,
        name: name.trim(),
        email: email.trim(),
        jobTitle: jobTitle.trim(),
        phoneNumber: phoneNumber.trim(),
        role: selectedRole || null,
        permissions: selectedPermissions,
      };

      axios
        .put(`${baseUrl}/admin/subadmin`, payload, { headers })
        .then(() => {
          setLoading(false);
          setIsOpen(false);
          setSuccess("Subadmin updated successfully.");
          updateData((prev) => !prev);
        })
        .catch((error) => {
          setLoading(false);
          const msg =
            error?.response?.data?.message || "Failed to update subadmin.";
          setFormError(msg);
        });
    } else {
      // Create payload: POST /admin/subadmin
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        jobTitle: jobTitle.trim(),
        password: password,
        role: selectedRole || null,
        permissions: selectedPermissions,
      };

      axios
        .post(`${baseUrl}/admin/subadmin`, payload, { headers })
        .then(() => {
          setLoading(false);
          setIsOpen(false);
          setSuccess("Subadmin created successfully.");
          updateData((prev) => !prev);
        })
        .catch((error) => {
          setLoading(false);
          const msg =
            error?.response?.data?.message || "Failed to create subadmin.";
          setFormError(msg);
        });
    }
  };

  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen flex p-4 items-center justify-center fixed top-0 left-0 z-[1000] bg-black/50 backdrop-blur-xs transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {formError && <Error error={formError} setError={setFormError} />}

      <div
        ref={modalRef}
        className="w-[42rem] max-w-full shadow-2xl rounded-3xl bg-white flex flex-col overflow-hidden transition-all duration-300 max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="w-full border-b border-gray-100 py-4 px-6 flex items-center justify-between bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-50 text-[#ff204e] flex items-center justify-center text-lg">
              <LuShield />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {isEdit ? "Edit Subadmin Account" : "Create New Subadmin"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEdit
                  ? "Update staff details, assigned role, or custom permissions"
                  : "Invite a new team member with custom permission access"}
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

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 flex flex-col gap-5 overflow-y-auto"
        >
          {/* Inline Validation Banner if error */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600 flex items-center justify-between">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(false)}
                className="text-red-400 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                Full Name <span className="text-[#ff204e]">*</span>
              </label>
              <div className="relative flex items-center">
                <LuUser className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-11 rounded-xl pl-10 pr-4 outline-none border border-gray-200 focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                Email Address <span className="text-[#ff204e]">*</span>
              </label>
              <div className="relative flex items-center">
                <LuMail className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full h-11 rounded-xl pl-10 pr-4 outline-none border border-gray-200 focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Job Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                Job Title <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <LuBriefcase className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Operations Specialist"
                  className="w-full h-11 rounded-xl pl-10 pr-4 outline-none border border-gray-200 focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <LuPhone className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full h-11 rounded-xl pl-10 pr-4 outline-none border border-gray-200 focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Password (Only during Create) */}
          {!isEdit && (
            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-gray-50/70 border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Password <span className="text-[#ff204e]">* (Min 8 characters)</span>
                </label>
                {/* <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff204e] hover:underline cursor-pointer"
                >
                  <LuSparkles className="text-xs" /> Generate Strong Password
                </button> */}
              </div>

              <div className="relative flex items-center mt-1">
                <LuLock className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full h-11 rounded-xl pl-10 pr-11 outline-none border border-gray-200 bg-white focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Subadmin can log in using this password and recover via forgot password if needed.
              </p>
            </div>
          )}

          {/* Role Template Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
              Role Template <span className="text-gray-400 font-normal">(Select a preset to auto-fill permissions)</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full h-11 rounded-xl px-4 outline-none border border-gray-200 bg-white focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium text-gray-800 cursor-pointer"
            >
              <option value="">-- Custom (No Role Template) --</option>
              {rolesList?.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name} {r.isDefault ? "(Default)" : ""} ({r.permissions?.length || 0} permissions)
                </option>
              ))}
            </select>
          </div>

          {/* Permissions Selection Checklist */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                  Subadmin Permissions
                </label>
                <p className="text-xs text-gray-400 ml-1">
                  Pre-filled by role template, but customized per user ({selectedPermissions.length}/{ADMIN_MODULES.length} active)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-[#ff204e] hover:underline font-semibold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={handleClearPermissions}
                  className="text-xs text-gray-500 hover:underline font-medium cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADMIN_MODULES.map((mod) => {
                const isChecked = selectedPermissions.includes(mod.key);
                return (
                  <div
                    key={mod.key}
                    onClick={() => handlePermissionToggle(mod.key)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? "border-[#ff204e]/30 bg-[#ff204e]/[0.02]"
                        : "border-gray-150 bg-gray-50 hover:bg-gray-100/70"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        isChecked ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {mod.label}
                    </span>
                    <div className="relative inline-flex items-center pointer-events-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff204e]"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full flex justify-center items-center text-white text-sm font-semibold bg-[#ff204e] hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <BtnLoader />
              ) : isEdit ? (
                "Save Subadmin Changes"
              ) : (
                "Create Subadmin Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubadminModal;

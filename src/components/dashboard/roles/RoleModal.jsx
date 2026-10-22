import React, { useContext, useRef, useState, useEffect } from "react";
import Error from "../../global/Error";
import { GlobalContext } from "../../../context/GlobalContext";
import axios from "axios";
import Cookies from "js-cookie";
import BtnLoader from "../../global/BtnLoader";

const MODULES = [
  "dashboard",
  "users",
  "dealerships",
  "tickets",
  "notifications",
  "roles",
  "subadmins",
  "config",
];

const MODULE_LABELS = {
  dashboard: "Dashboard",
  users: "Users",
  dealerships: "Dealerships",
  tickets: "Support Tickets",
  notifications: "Notifications",
  roles: "Roles",
  subadmins: "Subadmins",
  config: "Config",
  reports: "Reports",
  payment_gateway: "Payment Gateway",
  subscriptions: "Subscriptions",
};

const RoleModal = ({ isOpen, setIsOpen, role, updateData }) => {
  const roleModalRef = useRef();
  const { navigateToLink, baseUrl, setSuccess, clearAuth } =
    useContext(GlobalContext);

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("admin");

  useEffect(() => {
    if (role) {
      setRoleName(role.name || "");
      setSelectedPermissions(role.permissions || []);
      setIsDefault(Boolean(role.isDefault));
      setType(role.type || "admin");
    } else {
      setRoleName("");
      setSelectedPermissions([]);
      setIsDefault(false);
      setType("admin");
    }
  }, [role, isOpen]);

  const toggleModal = (e) => {
    if (roleModalRef.current && !roleModalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handlePermissionChange = (module) => {
    setSelectedPermissions((prev) =>
      prev.includes(module)
        ? prev.filter((p) => p !== module)
        : [...prev, module]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setFormError("Role name is required.");
      setTimeout(() => setFormError(false), 3000);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      clearAuth();
      navigateToLink("/login", "Login");
      return;
    }

    setLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const payload = {
      name: roleName.trim(),
      permissions: selectedPermissions,
      // isDefault: isDefault,
      scope: type,

    };

    const request = role
      ? axios.put(`${baseUrl}/admin/roles/${role._id}`, payload, { headers })
      : axios.post(`${baseUrl}/admin/roles`, payload, { headers });

    request
      .then((response) => {
        setLoading(false);
        setIsOpen(false);
        setSuccess(role ? "Role updated successfully." : "Role created successfully.");
        updateData((prev) => !prev);
      })
      .catch((error) => {
        setLoading(false);
        setFormError(error?.response?.data?.message || "Something went wrong.");
        setTimeout(() => setFormError(false), 4000);
      });
  };

  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen flex p-2 items-center justify-center fixed top-0 left-0 z-[1000] bg-black/40 backdrop-blur-xs transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
    >
      {formError && <Error error={formError} setError={setFormError} />}

      <div
        ref={roleModalRef}
        className="w-[32rem] max-w-full shadow-2xl rounded-3xl bg-white flex flex-col overflow-hidden transition-all duration-300"
      >
        <div className="w-full border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {role ? "Edit Role" : "Create New Role"}
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full p-6 flex flex-col gap-6 overflow-y-auto max-h-[80vh]"
        >
          {/* Role Name Input */}
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Sales Manager"
              className="w-full h-12 rounded-full px-5 outline-none border border-gray-200 focus:border-[#ff204e] transition-colors text-sm"
            />
          </div>
          {/* Type Dropdown */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Type
            </label>

            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={Boolean(role)}
                className={`w-full h-12 appearance-none rounded-2xl border px-4 pr-12 text-sm font-medium outline-none transition-all duration-200 ${role
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                  : "cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-gray-300 focus:border-[#ff204e] focus:ring-4 focus:ring-[#ff204e]/10"
                  }`}
              >
                <option value="admin">Sub-admin</option>
                <option value="dealership">Dealership</option>
              </select>

              <div
                className={`pointer-events-none absolute inset-y-0 right-4 flex items-center ${role ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <p className="ml-1 text-xs text-gray-400">
              {role
                ? "Role type cannot be changed after creation."
                : "Choose whether this role belongs to a sub-admin or dealership."}
            </p>
          </div>
          {/* Module Permissions Grid */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1 mb-1">
              Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODULES.map((module) => {
                const isChecked = selectedPermissions.includes(module);
                return (
                  <div
                    key={module}
                    onClick={() => handlePermissionChange(module)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${isChecked
                      ? "border-[#ff204e]/30 bg-[#ff204e]/[0.02]"
                      : "border-gray-150 bg-gray-50 hover:bg-gray-100/70"
                      }`}
                  >
                    <span
                      className={`text-xs font-semibold ${isChecked ? "text-gray-800" : "text-gray-500"
                        }`}
                    >
                      {MODULE_LABELS[module] || module}
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

          {/* Default Role Toggle */}


          {/* Save Button */}
          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-full flex justify-center items-center text-white font-medium bg-[#ff204e] hover:opacity-95 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
          >
            {loading ? <BtnLoader /> : role ? "Save Changes" : "Create Role"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;

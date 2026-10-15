import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { LuShieldAlert } from "react-icons/lu";

const PermissionGuard = ({ module, children }) => {
  const { canAccess, navigateToLink } = useContext(GlobalContext);

  if (!canAccess(module)) {
    return (
      <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#ff204e] text-4xl mb-4 shadow-sm animate-pulse">
          <LuShieldAlert />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
        <p className="text-gray-500 max-w-md text-sm mb-6">
          Your subadmin account does not have permission to access the{" "}
          <span className="font-semibold text-gray-700 capitalize">"{module}"</span> module.
          Please contact an administrator if you require access.
        </p>
        <button
          onClick={() => navigateToLink("/dashboard", "Dashboard")}
          className="rounded-full bg-[#ff204e] px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return children;
};

export default PermissionGuard;

import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import Loader from "../components/global/Loader";
import { NoData } from "../assets/export";
import RoleModal from "../components/dashboard/roles/RoleModal";
import Error from "../components/global/Error";
import Success from "../components/global/Success";

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
  sales_team: "Sales Team",
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { baseUrl, navigateToLink, error, setError, success, setSuccess, clearAuth } =
    useContext(GlobalContext);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const getRoles = () => {
    const token = Cookies.get("token");

    if (token) {
      setRolesLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`${baseUrl}/admin/roles`, { headers })
        .then((response) => {
          setRoles(response?.data?.data || []);
          setRolesLoading(false);
        })
        .catch((err) => {
          setRolesLoading(false);
          if (err?.response?.status === 401) {
            clearAuth();
            navigateToLink("/login");
          } else {
            setError(err?.response?.data?.message || "Failed to fetch roles.");
          }
        });
    } else {
      navigateToLink("/login");
    }
  };

  useEffect(() => {
    getRoles();
  }, [update]);

  const handleCreateClick = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (role) => {
    if (role?.isDefault) {
      setError("Cannot delete the default role.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the role "${role?.name}"?`)) {
      return;
    }

    const token = Cookies.get("token");
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .delete(`${baseUrl}/admin/roles/${role?._id}`, { headers })
        .then(() => {
          setSuccess("Role deleted successfully.");
          setUpdate((prev) => !prev);
        })
        .catch((err) => {
          setError(err?.response?.data?.message || "Failed to delete role.");
        });
    } else {
      clearAuth();
      navigateToLink("/login");
    }
  };

  const filteredData = roles?.filter((role) =>
    role?.name?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="w-full p-6 flex flex-col justify-start items-start gap-3">
      {error && <Error error={error} setError={setError} />}
      {success && <Success success={success} setSuccess={setSuccess} />}

      <div className="w-full h-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
        <button
          onClick={handleCreateClick}
          className="active:scale-95 rounded-full bg-[#ff204e] px-5 py-2.5 font-semibold text-white outline-none shadow-md hover:opacity-90 transition-all duration-200 text-sm cursor-pointer"
        >
          Create New Role
        </button>
      </div>

      <div className="w-full mt-2 h-auto flex justify-start items-center">
        <input
          type="text"
          id="roleSearch"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search roles by name..."
          className="block w-full rounded-l-full border border-gray-200 px-4 py-2.5 shadow-sm outline-none focus:border-[#ff204e] focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
        />
        <button className="active:scale-95 rounded-r-full border border-[#ff204e] bg-[#ff204e] px-8 py-2.5 font-medium text-white outline-none focus:ring focus:ring-red-200 hover:opacity-90 text-sm cursor-pointer">
          Search
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        {rolesLoading ? (
          <Loader />
        ) : filteredData?.length < 1 ? (
          <div className="w-full flex justify-center items-center py-8">
            <img src={NoData} className="w-40" alt="No data available" />
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead>
              <tr className="border-b border-gray-100">
                <th scope="col" className="px-6 py-4 font-bold text-[#ff204e]">
                  Role Name
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-[#ff204e]">
                  Permissions
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-[#ff204e]">
                  Default
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-[#ff204e] text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData?.map((role) => (
                <tr
                  key={role?._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {role?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xl">
                      {role?.permissions?.map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-[#ff204e] border border-red-100/40"
                        >
                          {MODULE_LABELS[perm] || perm}
                        </span>
                      ))}
                      {(!role?.permissions || role.permissions.length === 0) && (
                        <span className="text-gray-400 italic text-xs">
                          No permissions assigned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {role?.isDefault ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600 border border-green-100">
                        Default
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 border border-gray-100">
                        Custom
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(role)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#ff204e] hover:text-[#ff204e] text-gray-600 font-semibold transition-all text-xs cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(role)}
                        disabled={role?.isDefault}
                        title={
                          role?.isDefault
                            ? "Cannot delete the default role"
                            : "Delete Role"
                        }
                        className={`px-3 py-1.5 rounded-lg border border-gray-200 font-semibold transition-all text-xs ${
                          role?.isDefault
                            ? "opacity-40 cursor-not-allowed text-gray-400"
                            : "hover:border-red-600 hover:bg-red-50 hover:text-red-600 text-gray-600 cursor-pointer"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <RoleModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          role={editingRole}
          updateData={setUpdate}
        />
      )}
    </div>
  );
};

export default Roles;

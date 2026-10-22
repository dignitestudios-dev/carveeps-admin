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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

    setRoleToDelete(role);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete || deleteLoading) return;

    const token = Cookies.get("token");

    if (!token) {
      clearAuth();
      navigateToLink("/login");
      return;
    }

    setDeleteLoading(true);

    try {
      await axios.delete(`${baseUrl}/admin/roles/${roleToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteModalOpen(false);
      setRoleToDelete(null);
      setSuccess("Role deleted successfully.");
      setUpdate((prev) => !prev);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete role.");
    } finally {
      setDeleteLoading(false);
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
                  Type
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

                  <td className="px-6 py-4 font-semibold text-gray-800 capitalize">
                    {role?.scope === "admin" ? "Sub-Admin" : "Dealership"}
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
                        className={`px-3 py-1.5 rounded-lg border border-gray-200 font-semibold transition-all text-xs ${role?.isDefault
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
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteLoading) {
              setDeleteModalOpen(false);
              setRoleToDelete(null);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col items-center px-7 pt-8 pb-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#ff204e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M10 7V4h4v3"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Delete Role?
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  "{roleToDelete?.name}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-5">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setRoleToDelete(null);
                }}
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff204e] text-sm font-semibold text-white shadow-md shadow-red-200/50 transition-all hover:bg-[#e61943] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;

import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import Loader from "../components/global/Loader";
import { NoData } from "../assets/export";
import Error from "../components/global/Error";
import Success from "../components/global/Success";
import SubadminModal from "../components/dashboard/subadmins/SubadminModal";
import SubadminViewModal from "../components/dashboard/subadmins/SubadminViewModal";
import { MODULE_LABELS } from "../constants/modules";
import {
  LuUsers,
  LuPlus,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuEye,
  LuShieldAlert,
  LuShieldCheck,
  LuMail,
  LuPhone,
} from "react-icons/lu";

const Subadmins = () => {
  const [subadmins, setSubadmins] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const { baseUrl, navigateToLink, error, setError, success, setSuccess, clearAuth } =
    useContext(GlobalContext);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubadmin, setEditingSubadmin] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSubadmin, setViewingSubadmin] = useState(null);

  const [deleteConfirmSubadmin, setDeleteConfirmSubadmin] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch subadmins list
  const getSubadmins = () => {
    const token = Cookies.get("token");
    if (!token) {
      clearAuth();
      navigateToLink("/login");
      return;
    }

    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`${baseUrl}/admin/subadmin?from=0&threshold=100000`, { headers })
      .then((res) => {
        setSubadmins(res?.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status === 401) {
          clearAuth();
          navigateToLink("/login");
        } else {
          setError(err?.response?.data?.message || "Failed to fetch subadmins.");
        }
      });
  };

  // Fetch roles list for template dropdown
  const getRoles = () => {
    const token = Cookies.get("token");
    if (!token) return;

    axios
      .get(`${baseUrl}/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRolesList(res?.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch roles template list", err);
      });
  };

  useEffect(() => {
    getSubadmins();
    getRoles();
  }, [update]);

  // Actions
  const handleCreate = () => {
    setEditingSubadmin(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sub) => {
    setEditingSubadmin(sub);
    setIsModalOpen(true);
  };

  const handleView = (sub) => {
    setViewingSubadmin(sub);
    setIsViewModalOpen(true);
  };

  const handleDeletePrompt = (sub) => {
    setDeleteConfirmSubadmin(sub);
  };

  const confirmDelete = () => {
    if (!deleteConfirmSubadmin) return;

    const token = Cookies.get("token");
    if (!token) {
      clearAuth();
      navigateToLink("/login");
      return;
    }

    setDeleteLoading(true);
    axios
      .delete(`${baseUrl}/admin/subadmin/${deleteConfirmSubadmin._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setDeleteLoading(false);
        setDeleteConfirmSubadmin(null);
        setSuccess("Subadmin removed successfully.");
        setUpdate((prev) => !prev);
      })
      .catch((err) => {
        setDeleteLoading(false);
        setDeleteConfirmSubadmin(null);
        setError(err?.response?.data?.message || "Failed to delete subadmin.");
      });
  };

  // Search filtering
  const filteredData = subadmins?.filter((item) => {
    const term = searchInput.toLowerCase();
    const roleName =
      typeof item?.role === "object" ? item?.role?.name : item?.role || "";
    return (
      item?.name?.toLowerCase().includes(term) ||
      item?.email?.toLowerCase().includes(term) ||
      item?.jobTitle?.toLowerCase().includes(term) ||
      roleName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full p-6 flex flex-col justify-start items-start gap-4">
      {error && <Error error={error} setError={setError} />}
      {success && <Success success={success} setSuccess={setSuccess} />}

      {/* Top Banner */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-[#ff204e] rounded-xl text-lg">
              <LuUsers />
            </span>
            <h1 className="text-xl font-bold text-gray-800">
              Subadmin Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Create, manage, and assign granular permissions to platform sub-administrators.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 active:scale-95 rounded-full bg-[#ff204e] px-5 py-2.5 font-semibold text-white shadow-md hover:opacity-90 transition-all duration-200 text-sm cursor-pointer"
        >
          <LuPlus className="text-base" />
          <span>Add New Subadmin</span>
        </button>
      </div>

      {/* Search Bar & Summary */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="w-full md:w-96 relative flex items-center">
          <LuSearch className="absolute left-4 text-gray-400 text-base pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full rounded-full border border-gray-200 pl-11 pr-4 py-2.5 shadow-xs outline-none focus:border-[#ff204e] focus:ring-2 focus:ring-red-100 transition-all text-sm bg-white"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-4 text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing{" "}
          <span className="font-bold text-gray-700">
            {filteredData?.length || 0}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-700">
            {subadmins?.length || 0}
          </span>{" "}
          subadmins
        </div>
      </div>

      {/* Subadmins Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="py-16">
            <Loader />
          </div>
        ) : filteredData?.length < 1 ? (
          <div className="w-full flex flex-col justify-center items-center py-16 gap-3">
            <img
              src={NoData}
              className="w-40 opacity-80"
              alt="No data available"
            />
            <p className="text-sm font-medium text-gray-500">
              {searchInput
                ? "No subadmins match your search criteria."
                : "No subadmins registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-xs uppercase tracking-wider font-bold text-gray-500">
                  <th scope="col" className="px-6 py-4">
                    Subadmin
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Role Template
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Permissions
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData?.map((sub) => {
                  const roleName =
                    typeof sub?.role === "object"
                      ? sub?.role?.name
                      : sub?.role || "Custom";
                  const perms = sub?.permissions || [];

                  return (
                    <tr
                      key={sub?._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Name & Email with Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-50 text-[#ff204e] flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-red-100">
                            {sub?.name ? sub.name.charAt(0) : "S"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">
                              {sub?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {sub?.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-700">
                          {sub?.jobTitle || "—"}
                        </span>
                      </td>

                      {/* Role Template */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50/80 px-2.5 py-1 text-xs font-semibold text-[#ff204e] border border-red-100">
                          <LuShieldCheck className="text-xs" />
                          {roleName}
                        </span>
                      </td>

                      {/* Permissions Chips / Count */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
                            {perms.length} modules
                          </span>
                          {perms.slice(0, 3).map((p) => (
                            <span
                              key={p}
                              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200"
                            >
                              {MODULE_LABELS[p] || p}
                            </span>
                          ))}
                          {perms.length > 3 && (
                            <span
                              onClick={() => handleView(sub)}
                              className="text-[11px] font-semibold text-[#ff204e] hover:underline cursor-pointer"
                            >
                              +{perms.length - 3} more
                            </span>
                          )}
                          {perms.length === 0 && (
                            <span className="text-gray-400 italic text-xs">
                              No permissions
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleView(sub)}
                            title="View Details"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-400 hover:text-gray-800 text-gray-600 font-semibold transition-all text-xs cursor-pointer bg-white"
                          >
                            <LuEye className="text-xs" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => handleEdit(sub)}
                            title="Edit Subadmin"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#ff204e] hover:text-[#ff204e] text-gray-600 font-semibold transition-all text-xs cursor-pointer bg-white"
                          >
                            <LuPencil className="text-xs" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeletePrompt(sub)}
                            title="Delete Subadmin"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-red-600 hover:bg-red-50 hover:text-red-600 text-gray-600 font-semibold transition-all text-xs cursor-pointer bg-white"
                          >
                            <LuTrash2 className="text-xs" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subadmin Create/Edit Modal */}
      {isModalOpen && (
        <SubadminModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          subadmin={editingSubadmin}
          rolesList={rolesList}
          updateData={setUpdate}
        />
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingSubadmin && (
        <SubadminViewModal
          isOpen={isViewModalOpen}
          setIsOpen={setIsViewModalOpen}
          subAdminId={viewingSubadmin._id}
          initialData={viewingSubadmin}
          onEditClick={(sub) => {
            setEditingSubadmin(sub);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmSubadmin && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto">
              <LuShieldAlert />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">
                Delete Subadmin Account?
              </h3>
              <p className="text-xs text-red-500 font-semibold mt-1">
                "This subadmin will lose access immediately"
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-800">
                  {deleteConfirmSubadmin.name} ({deleteConfirmSubadmin.email})
                </span>
                ? This action will disable their sign-in credentials immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSubadmin(null)}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Confirm & Revoke Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subadmins;

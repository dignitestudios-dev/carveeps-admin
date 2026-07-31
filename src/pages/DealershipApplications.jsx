import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GlobalContext } from "../context/GlobalContext";
import Loader from "../components/global/Loader";
import Error from "../components/global/Error";
import Success from "../components/global/Success";
import { NoData } from "../assets/export";
import ApplicationStatusModal from "../components/dashboard/dealerships/ApplicationStatusModal";
import ApplicationDetailsModal from "../components/dashboard/dealerships/ApplicationDetailsModal";
import {
  IoSearchOutline,
  IoFilterOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoEyeOutline,
  IoCreateOutline,
} from "react-icons/io5";

const DealershipApplications = () => {
  const { baseUrl, navigateToLink, error, setError, success, setSuccess } =
    useContext(GlobalContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Pagination state
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal Control state
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const fetchApplications = () => {
    const token = Cookies.get("token");

    if (!token) {
      navigateToLink("/login");
      return;
    }

    setLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = {
      page,
      limit,
    };

    if (activeSearch.trim()) {
      params.search = activeSearch.trim();
    }

    if (statusFilter && statusFilter !== "All") {
      params.status = statusFilter;
    }

    axios
      .get(`${baseUrl}/admin/dealership-registrations`, { headers, params })
      .then((response) => {
        setLoading(false);
        const resData = response?.data;
        let list = [];
        let total = 0;

        if (Array.isArray(resData)) {
          list = resData;
          total = resData.length;
        } else if (Array.isArray(resData?.data)) {
          list = resData.data;
          total = resData?.total || resData?.totalRecords || resData?.count || list.length;
        } else if (Array.isArray(resData?.registrations)) {
          list = resData.registrations;
          total = resData?.total || list.length;
        } else if (Array.isArray(resData?.data?.registrations)) {
          list = resData.data.registrations;
          total = resData?.data?.total || list.length;
        }

        setApplications(list);
        setTotalRecords(total);
        const computedTotalPages =
          resData?.totalPages || resData?.data?.totalPages || Math.ceil(total / limit) || 1;
        setTotalPages(computedTotalPages);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status === 401) {
          Cookies.remove("token");
          navigateToLink("/login");
        } else {
          setError(
            err?.response?.data?.message || "Failed to fetch dealership applications."
          );
        }
      });
  };

  useEffect(() => {
    fetchApplications();
  }, [page, limit, statusFilter, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setIsDetailsOpen(true);
  };

  const handleOpenStatusUpdate = (app) => {
    setSelectedApp(app);
    setIsStatusOpen(true);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Pending
      </span>
    );
  };

  return (
    <div className="w-full p-6 flex flex-col justify-start items-start gap-5">
      {error && <Error error={error} setError={setError} />}
      {success && <Success success={success} setSuccess={setSuccess} />}

      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dealership Applications
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review dealership form submissions and update application status.
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-3">
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full lg:w-2/3 flex items-center"
        >
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <IoSearchOutline className="text-lg" />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, company, email, city, country..."
              className="w-full rounded-l-full border border-gray-200 pl-11 pr-4 py-2.5 shadow-xs outline-none focus:border-[#ff204e] focus:ring focus:ring-red-100 text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="active:scale-95 rounded-r-full border border-[#ff204e] bg-[#ff204e] px-7 py-2.5 font-medium text-white text-sm outline-none hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Status Filter */}
        <div className="w-full lg:w-1/3 flex items-center justify-end gap-2">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 whitespace-nowrap">
            <IoFilterOutline className="text-gray-400" />
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full sm:w-48 rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-[#ff204e] focus:ring focus:ring-red-100 cursor-pointer shadow-xs transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-xs">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader />
          </div>
        ) : applications?.length < 1 ? (
          <div className="w-full flex flex-col justify-center items-center py-12 gap-3">
            <img src={NoData} className="w-44 opacity-80" alt="No registrations found" />
            <p className="text-sm font-medium text-gray-500">
              No dealership applications match your criteria.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  Applicant Name
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  Company Name
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  Email
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  Location
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  VIN Count
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  Submitted On
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e]">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold text-[#ff204e] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr
                  key={app?._id || app?.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    {app?.name || "N/A"}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-700">
                    {app?.companyName || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    <a
                      href={`mailto:${app?.email}`}
                      className="hover:text-[#ff204e] transition-colors"
                    >
                      {app?.email || "N/A"}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {[app?.city, app?.country].filter(Boolean).join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-700">
                    {app?.vinCount ?? 0}
                  </td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                    {formatDate(app?.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    {renderStatusBadge(app?.status)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <IoEyeOutline className="text-gray-500" />
                        Details
                      </button>
                      {String(app?.status).toLowerCase() === "approved" ||
                      String(app?.status).toLowerCase() === "rejected" ? (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 border border-gray-200 text-xs font-semibold flex items-center gap-1 cursor-not-allowed opacity-70"
                          title={`Status finalized as ${app?.status}. Cannot be modified.`}
                        >
                          <IoCreateOutline />
                          Update Status
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenStatusUpdate(app)}
                          className="px-3 py-1.5 rounded-lg bg-[#ff204e]/10 text-[#ff204e] border border-[#ff204e]/20 hover:bg-[#ff204e] hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Update Status"
                        >
                          <IoCreateOutline />
                          Update Status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {!loading && applications?.length > 0 && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-gray-200 px-2 py-1 bg-white text-xs text-gray-700 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              {totalRecords > 0 && (
                <span className="ml-2 font-medium text-gray-600">
                  Total: {totalRecords} applications
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 mr-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IoChevronBackOutline className="text-base" />
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IoChevronForwardOutline className="text-base" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsOpen && (
        <ApplicationDetailsModal
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
          application={selectedApp}
          onOpenStatusModal={(app) => {
            setSelectedApp(app);
            setIsStatusOpen(true);
          }}
        />
      )}

      {/* Status Update Modal */}
      {isStatusOpen && (
        <ApplicationStatusModal
          isOpen={isStatusOpen}
          setIsOpen={setIsStatusOpen}
          application={selectedApp}
          onSuccess={fetchApplications}
        />
      )}
    </div>
  );
};

export default DealershipApplications;

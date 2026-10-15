import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GlobalContext } from "../../../context/GlobalContext";
import Loader from "../../global/Loader";
import { NoData } from "../../../assets/export";
import { LuArrowUpDown, LuArrowUp, LuArrowDown, LuSearch } from "react-icons/lu";

const DealershipSubscriptionPlans = ({
  dealershipId = null,
  hideDealershipFilter = false,
}) => {
  const { baseUrl, clearAuth, navigateToLink, setError } =
    useContext(GlobalContext);

  const [plans, setPlans] = useState([]);
  const [dealerships, setDealerships] = useState([]);
  const [selectedDealershipId, setSelectedDealershipId] = useState(
    dealershipId || ""
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting: key = "totalSold" | "totalRevenue" | null, direction = "asc" | "desc"
  const [sortKey, setSortKey] = useState("totalRevenue");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch dealerships for dropdown if not hidden
  useEffect(() => {
    if (!hideDealershipFilter) {
      const token = Cookies.get("token");
      if (token) {
        axios
          .get(`${baseUrl}/admin/dealership`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setDealerships(res?.data?.data || []);
          })
          .catch((err) => {
            console.error("Failed to load dealerships list", err);
          });
      }
    }
  }, [hideDealershipFilter, baseUrl]);

  // Sync if prop changes
  useEffect(() => {
    if (dealershipId) {
      setSelectedDealershipId(dealershipId);
    }
  }, [dealershipId]);

  // Fetch subscription plans
  const fetchSubscriptionPlans = () => {
    const token = Cookies.get("token");
    if (!token) {
      clearAuth();
      navigateToLink("/login");
      return;
    }

    setLoading(true);
    let url = `${baseUrl}/admin/subscription-plans?from=0&threshold=100000`;
    const targetDealership = dealershipId || selectedDealershipId;
    if (targetDealership) {
      url += `&dealershipId=${targetDealership}`;
    }

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlans(res?.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status === 401) {
          clearAuth();
          navigateToLink("/login");
        } else {
          setError(
            err?.response?.data?.message ||
              "Failed to fetch subscription plans."
          );
        }
      });
  };

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [selectedDealershipId, dealershipId]);

  // Handle Sort Toggle
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // Filter & Sort
  const filteredAndSortedPlans = plans
    ?.filter((p) => {
      const term = searchTerm.toLowerCase();
      const planName = p?.name?.toLowerCase() || "";
      const dealerName = p?.dealership?.name?.toLowerCase() || "";
      return planName.includes(term) || dealerName.includes(term);
    })
    ?.sort((a, b) => {
      if (!sortKey) return 0;
      let valA = 0;
      let valB = 0;

      if (sortKey === "totalSold") {
        valA = Number(a?.totalSold) || 0;
        valB = Number(b?.totalSold) || 0;
      } else if (sortKey === "totalRevenue") {
        valA = parseFloat(a?.totalRevenue) || 0;
        valB = parseFloat(b?.totalRevenue) || 0;
      }

      if (sortOrder === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

  const formatPrice = (plan) => {
    if (plan?.planType === "free") return "Free";
    const priceStr = `$${Number(plan?.price || 0).toFixed(2)}`;
    if (plan?.isOneTime) {
      return `${priceStr} / one-time`;
    }
    const intervalStr =
      plan?.intervalCount && plan.intervalCount > 1
        ? `${plan.intervalCount} ${plan.interval}s`
        : plan?.interval || "month";
    return `${priceStr} / ${intervalStr}`;
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 lg:p-8">
      {/* Search & Dealership Filter Bar */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="w-full md:w-80 relative flex items-center">
          <LuSearch className="absolute left-3.5 text-gray-400 text-sm pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plans by name..."
            className="w-full rounded-full border border-gray-200 pl-10 pr-4 py-2 text-xs shadow-xs outline-none focus:border-[#ff204e] focus:ring-1 focus:ring-red-200 transition-all bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 text-xs text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>

        {!hideDealershipFilter && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">
              Dealership:
            </label>
            <select
              value={selectedDealershipId}
              onChange={(e) => setSelectedDealershipId(e.target.value)}
              className="h-9 px-3 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white outline-none focus:border-[#ff204e] cursor-pointer"
            >
              <option value="">All Dealerships</option>
              {dealerships.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="py-16">
            <Loader />
          </div>
        ) : filteredAndSortedPlans?.length < 1 ? (
          <div className="w-full flex flex-col justify-center items-center py-16 gap-2">
            <img src={NoData} className="w-36 opacity-80" alt="No data" />
            <p className="text-sm font-medium text-gray-500">
              No subscription plans found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold text-[#ff204e]">
                  <th scope="col" className="px-6 py-4">
                    Plan Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Dealership
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("totalSold")}
                    className="px-6 py-4 cursor-pointer select-none hover:text-[#e0143f] transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Total Sold</span>
                      {sortKey === "totalSold" ? (
                        sortOrder === "asc" ? (
                          <LuArrowUp className="text-xs" />
                        ) : (
                          <LuArrowDown className="text-xs" />
                        )
                      ) : (
                        <LuArrowUpDown className="text-xs text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("totalRevenue")}
                    className="px-6 py-4 cursor-pointer select-none hover:text-[#e0143f] transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Total Revenue</span>
                      {sortKey === "totalRevenue" ? (
                        sortOrder === "asc" ? (
                          <LuArrowUp className="text-xs" />
                        ) : (
                          <LuArrowDown className="text-xs" />
                        )
                      ) : (
                        <LuArrowUpDown className="text-xs text-gray-400" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedPlans.map((plan) => {
                  return (
                    <tr
                      key={plan?._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Plan Name */}
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        <div className="flex items-center gap-2">
                          <span>{plan?.name}</span>
                          {plan?.planType === "free" ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                              Free
                            </span>
                          ) : plan?.isOneTime ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                              One-time
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Dealership */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {plan?.dealership?.logo && (
                            <img
                              src={plan.dealership.logo}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          )}
                          <span className="text-xs font-medium text-gray-700">
                            {plan?.dealership?.name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                        {formatPrice(plan)}
                      </td>

                      {/* Times Sold */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                          {plan?.totalSold ?? 0}
                        </span>
                      </td>

                      {/* Total Revenue */}
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        ${plan?.totalRevenue ?? "0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealershipSubscriptionPlans;

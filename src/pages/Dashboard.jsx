import React, { useState, useEffect, useContext } from "react";
import Summary from "../components/dashboard/Summary";
import RecentUsers from "../components/dashboard/RecentUsers";
import RecentDealers from "../components/dashboard/RecentDealers";
import Cookies from "js-cookie";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState([]);
  const { baseUrl, navigateToLink } = useContext(GlobalContext);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const getDashboardData = () => {
    const token = Cookies.get("token");

    if (token) {
      setDashboardLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios.get(`${baseUrl}/admin/dashboard`, { headers }).then(
        (response) => {
          setDashboard(response?.data?.data);
          setDashboardLoading(false);
        },
        (error) => {
          setDashboardLoading(false);
          if (error?.response?.status == 401) {
            Cookies.remove("token");
            navigateToLink("/login");
          }
        }
      );
    } else {
      navigateToLink("/login");
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);
  return (
    <div className="w-full flex flex-col gap-6">
      <Summary
        dealers={dashboard?.dealershipMonthsData}
        users={dashboard?.usersMonthsData}
      />
      <div className="w-full py-2 grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <RecentDealers dealerships={dashboard?.dealerships} />
        </div>
        <div className="lg:col-span-3">
          <RecentUsers users={dashboard?.users} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

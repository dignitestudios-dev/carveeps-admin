import React, { useRef, useContext } from "react";
import { Logo } from "../assets/export";
import SidebarLink from "./SidebarLink";
import { IoNotificationsOutline, IoDocumentTextOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuShield, LuUser, LuUsers } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { MdOutlineChat } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbPercentage } from "react-icons/tb";
import { GlobalContext } from "../context/GlobalContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { canAccess, clearAuth, subadmin, isSubadmin } = useContext(GlobalContext);

  const toggleModal = (e) => {
    if (!sidebarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const navigateToLogin = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen fixed top-0 left-0 transition-all duration-500 ${
        isOpen ? " lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
      } lg:static z-[2000] lg:z-auto px-3 lg:w-60 xl:w-72 flex flex-col gap-3 items-center justify-start py-0 lg:h-full`}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 transition-all duration-200 ${
          isOpen ? " lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:static w-[60%] z-[2000] lg:z-auto px-3 lg:w-60 xl:w-72 flex flex-col gap-3 items-center justify-start py-0 h-full bg-white border-r border-gray-200 overflow-y-auto`}
      >
        <div className="w-full flex flex-col items-center pt-3 pb-2 border-b border-gray-100">
          <img src={Logo} alt="logo" className="w-[154px]" />
          {isSubadmin && (
            <div className="mt-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full flex flex-col items-center">
              <span className="text-[10px] font-bold text-[#ff204e] uppercase tracking-wider">
                Subadmin Portal
              </span>
              <span className="text-xs font-medium text-gray-700 truncate max-w-[180px]">
                {subadmin?.name || subadmin?.role || "Staff Member"}
              </span>
            </div>
          )}
        </div>

        {/* Permission-gated Navigation Links */}
        {canAccess("dashboard") && (
          <SidebarLink
            title={"Dashboard"}
            link={"/dashboard"}
            icon={<LuLayoutDashboard />}
          />
        )}

        {canAccess("users") && (
          <SidebarLink title={"Users"} link={"/users"} icon={<LuUser />} />
        )}

        {canAccess("roles") && (
          <SidebarLink title={"Roles"} link={"/roles"} icon={<LuShield />} />
        )}

        {canAccess("subadmins") && (
          <SidebarLink
            title={"Subadmins"}
            link={"/subadmins"}
            icon={<LuUsers />}
          />
        )}

        {canAccess("dealerships") && (
          <>
            <SidebarLink
              title={"Dealerships"}
              link={"/dealerships"}
              icon={<IoAnalyticsOutline />}
            />
            <SidebarLink
              title={"Dealership Applications"}
              link={"/dealership-applications"}
              icon={<IoDocumentTextOutline />}
            />
          </>
        )}

        {canAccess("notifications") && (
          <SidebarLink
            title={"Notifications"}
            link={"/notifications"}
            icon={<IoNotificationsOutline />}
          />
        )}

        {canAccess("tickets") && (
          <SidebarLink
            title={"Tickets"}
            link={"/tickets"}
            icon={<MdOutlineChat />}
          />
        )}

        {canAccess("config") && (
          <SidebarLink
            title={"Commission"}
            link={"/commission-settings"}
            icon={<TbPercentage />}
          />
        )}

        <SidebarLink
          title={"Update Password"}
          link={"/update-password"}
          icon={<IoSettingsOutline />}
        />

        <div className="w-full mt-auto pt-4 pb-4">
          <button
            onClick={navigateToLogin}
            className="group w-full h-12 border border-gray-200 hover:border-[#ff204e] focus:border-[#ff204e] rounded-full flex justify-start items-center transition-all cursor-pointer"
          >
            <span className="flex w-1/6 h-full rounded-l-full border-r border-gray-200 group-hover:border-[#f16e88] group-hover:text-[#ff204e] group-focus:border-[#ff204e] group-focus:text-[#ff204e] justify-center items-center text-xl text-gray-700">
              <HiOutlineLogout />
            </span>
            <span className="px-3 group-hover:text-[#ff204e] group-focus:text-[#ff204e] text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

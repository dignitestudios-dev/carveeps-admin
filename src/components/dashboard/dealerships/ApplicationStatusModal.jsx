import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GlobalContext } from "../../../context/GlobalContext";
import BtnLoader from "../../global/BtnLoader";
import Error from "../../global/Error";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";

const ApplicationStatusModal = ({
  isOpen,
  setIsOpen,
  application,
  onSuccess,
}) => {
  const modalRef = useRef();
  const { baseUrl, navigateToLink, setError, setSuccess } =
    useContext(GlobalContext);

  const currentStatus = String(application?.status || "pending").toLowerCase();
  const isLocked = currentStatus === "approved" || currentStatus === "rejected";

  const [status, setStatus] = useState("approved");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (application) {
      // If pending, default selection to 'approved', otherwise match current status
      setStatus(
        currentStatus === "pending" ? "approved" : currentStatus
      );
      setAdminNotes(application?.adminNotes || "");
    }
  }, [application, currentStatus]);

  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    const token = Cookies.get("token");

    if (!token) {
      navigateToLink("/login");
      return;
    }

    setLoading(true);
    setFormError(false);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      status,
      adminNotes,
    };

    axios
      .patch(
        `${baseUrl}/admin/dealership-registrations/${application?._id}/status`,
        payload,
        { headers }
      )
      .then((response) => {
        setLoading(false);
        setSuccess("Application status updated successfully.");
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        setLoading(false);
        const errMsg =
          err?.response?.data?.message || "Failed to update application status.";
        setFormError(errMsg);
      });
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen flex p-4 items-center justify-center fixed top-0 left-0 z-[1000] bg-black/40 backdrop-blur-xs transition-all duration-300 ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {formError && <Error error={formError} setError={setFormError} />}

      <div
        ref={modalRef}
        className="w-full max-w-lg shadow-xl rounded-2xl bg-white border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="w-full border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Update Application Status
            </h2>
            <p className="text-xs text-gray-500">
              {application?.companyName || application?.name}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Status Lock Warning Banner */}
          {isLocked && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <IoInformationCircleOutline className="text-lg text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                This application status is finalized as{" "}
                <span className="font-bold capitalize">{currentStatus}</span>. Once approved or rejected, the status cannot be modified.
              </div>
            </div>
          )}

          {/* Status Options */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* <button
                type="button"
                disabled={true}
                className="py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                title="Cannot select Pending once an application is being updated"
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Pending
              </button> */}

              <button
                type="button"
                disabled={isLocked}
                onClick={() => setStatus("approved")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isLocked
                    ? currentStatus === "approved"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm opacity-90 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 border-gray-200 opacity-50 cursor-not-allowed"
                    : status === "approved"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Approve
              </button>

              <button
                type="button"
                disabled={isLocked}
                onClick={() => setStatus("rejected")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isLocked
                    ? currentStatus === "rejected"
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm opacity-90 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 border-gray-200 opacity-50 cursor-not-allowed"
                    : status === "rejected"
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50 cursor-pointer"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Reject
              </button>
            </div>
          </div>

          {/* Admin Review Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Admin Notes <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={4}
              disabled={isLocked}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={
                isLocked
                  ? "Admin notes locked."
                  : "Enter review notes or reasons for approval/rejection..."
              }
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#ff204e] focus:ring focus:ring-red-100 transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {!isLocked && (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-[#ff204e] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center min-w-28 cursor-pointer"
              >
                {loading ? <BtnLoader /> : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationStatusModal;

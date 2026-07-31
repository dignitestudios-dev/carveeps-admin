import { useRef } from "react";
import {
  IoClose,
  IoBusinessOutline,
  IoMailOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoCarSportOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCallOutline,
} from "react-icons/io5";

const ApplicationDetailsModal = ({
  isOpen,
  setIsOpen,
  application,
  onOpenStatusModal,
}) => {
  const modalRef = useRef();

  if (!isOpen || !application) return null;

  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Pending
      </span>
    );
  };

  return (
    <div
      onClick={toggleModal}
      className={`w-screen h-screen flex p-4 items-center justify-center fixed top-0 left-0 z-[1000] bg-black/40 backdrop-blur-xs transition-all duration-300 ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl shadow-2xl rounded-2xl bg-white border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="w-full border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Application Details
            </h2>
            {/* <p className="text-xs text-gray-500">ID: {application?._id}</p> */}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Main Summary & Badge */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff204e]/10 text-[#ff204e] flex items-center justify-center text-2xl font-bold">
                <IoBusinessOutline />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">
                  {application?.companyName || application?.name || "N/A"}
                </h3>
                <p className="text-xs text-gray-500">
                  Submitted by {application?.name || "Applicant"}
                </p>
              </div>
            </div>
            {renderStatusBadge(application?.status)}
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <IoPersonOutline className="text-gray-400 text-lg mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Applicant Name
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {application?.name || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <IoBusinessOutline className="text-gray-400 text-lg mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Company Name
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {application?.companyName || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <IoMailOutline className="text-gray-400 text-lg mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Email Address
                </span>
                <a
                  href={`mailto:${application?.email}`}
                  className="text-sm font-medium text-[#ff204e] hover:underline break-all"
                >
                  {application?.email || "N/A"}
                </a>
              </div>
            </div>

            {application?.phone && (
              <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                <IoCallOutline className="text-gray-400 text-lg mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {application?.phone}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <IoLocationOutline className="text-gray-400 text-lg mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Location
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {[application?.city, application?.country]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <IoCarSportOutline className="text-gray-400 text-lg mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  VIN Count
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {application?.vinCount ?? 0}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white sm:col-span-2">
              <IoCalendarOutline className="text-gray-400 text-lg mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Submitted On
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {formatDate(application?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Notes Section */}
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <IoDocumentTextOutline className="text-gray-500" />
              Admin Notes
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {application?.adminNotes || (
                <span className="text-gray-400 italic text-xs">
                  No review notes attached to this application yet.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            Close
          </button>
          {String(application?.status).toLowerCase() === "approved" ||
          String(application?.status).toLowerCase() === "rejected" ? (
            <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200 cursor-not-allowed">
              Status Finalized ({application?.status})
            </span>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenStatusModal) {
                  onOpenStatusModal(application);
                }
              }}
              className="px-5 py-2 rounded-full bg-[#ff204e] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;

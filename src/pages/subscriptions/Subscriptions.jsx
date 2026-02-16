import { ConfigProvider, Modal, Table, Select } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEye } from "react-icons/fi";
import Swal from 'sweetalert2';
import { useGetAllAppointmentsQuery } from "../../redux/api/appointmentsApi";

function Subscriptions() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [statusFilter, setStatusFilter] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch appointments data from API
  const { data: appointmentsData, isLoading, error } = useGetAllAppointmentsQuery();
  
  // Transform API data to match table structure
  const transformedData = useMemo(() => {
    if (!appointmentsData?.data) return [];
    
    return appointmentsData.data.map((appointment, index) => ({
      key: appointment._id,
      name: `${appointment.planName} ${appointment.fullName}`,
      user: appointment.fullName,
      email: appointment.email,
      phone: appointment.phone || 'N/A',
      purpose: appointment.purpose,
      meetingPreference: appointment.meetingPreference,
      status: 'Active', // Default status since API doesn't provide one
      price: 'N/A',
      startDate: new Date(appointment.appointmentDate).toLocaleDateString(),
      endDate: new Date(appointment.appointmentDate).toLocaleDateString(),
      appointmentTime: appointment.appointmentTime,
      paymentMethod: 'N/A',
      createdAt: new Date(appointment.createdAt).toLocaleDateString(),
    }));
  }, [appointmentsData]);

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Plan Name",
      dataIndex: "name",
      key: "name",
      render: (value) => (
        <span className="font-medium">{value}</span>
      ),
    },
    { 
      title: "User", 
      dataIndex: "user", 
      key: "user" 
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email" 
    },
    { 
      title: "Phone", 
      dataIndex: "phone", 
      key: "phone" 
    },
    { 
      title: "Purpose", 
      dataIndex: "purpose", 
      key: "purpose" 
    },
    { 
      title: "Meeting Preference", 
      dataIndex: "meetingPreference", 
      key: "meetingPreference" 
    },
    { 
      title: "Time", 
      dataIndex: "appointmentTime", 
      key: "appointmentTime" 
    },
    { 
      title: "Start Date", 
      dataIndex: "startDate", 
      key: "startDate" 
    },
    { 
      title: "End Date", 
      dataIndex: "endDate", 
      key: "endDate" 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => showViewModal(record)}>
            <FiEye className="text-blue-600 w-5 h-5 cursor-pointer rounded-md" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (!transformedData.length) return [];
    
    const q = (searchQuery || "").toLowerCase().trim();
    return transformedData.filter((r) => {
      const matchStatus = statusFilter ? r.status === statusFilter : true;
      const matchQuery = q
        ? [r.name, r.user, r.email, r.phone, r.purpose, r.meetingPreference]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchStatus && matchQuery;
    });
  }, [transformedData, statusFilter, searchQuery]);

  const showViewModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedSubscription(null);
  };

  const openCancel = (row) => {
    Swal.fire({
      title: 'Cancel Subscription?',
      html: `Are you sure you want to cancel the subscription for <strong>${row.user}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C9A961',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep It',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // setDataSource(dataSource.filter(item => item.key !== row.key));
        Swal.fire({
          title: 'Cancelled!',
          text: `Subscription for ${row.user} has been cancelled.`,
          icon: 'success',
          confirmButtonColor: '#C9A961',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  return (
    <div>
      <div className="bg-[#C9A961] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">Appointments</h1>
        
        {/* Mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appointments..."
            className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
          />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appointments..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
          
          <Select
            placeholder="Filter by status"
            allowClear
            onChange={setStatusFilter}
            className="w-full md:w-40"
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Expired', label: 'Expired' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
          
          {/* <button
            onClick={() => navigate('/add-subscription')}
            className="bg-white text-[#C9A961] hover:bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2 whitespace-nowrap"
          >
            <IoAddOutline className="w-5 h-5" />
            <span>Add Subscription</span>
          </button> */}
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
            Table: {
              headerBg: "#f9fafb",
              headerColor: "#000000",
              cellFontSize: 14,
              headerSplitColor: "#f9fafb",
              colorTextHeading: "#000000",
            },
          },
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          rowClassName="hover:bg-gray-50 cursor-pointer"
          loading={isLoading}
        />
        
        
        {/* View Appointment Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
        >
          {selectedSubscription && (
            <div className="relative">
              {/* Header with gradient */}
              <div className="bg-[#C9A961] p-6 -m-6 mb-6 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedSubscription.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSubscription.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    selectedSubscription.status === 'Expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSubscription.status}
                  </span>
                  <span className="text-white/90">
                    {selectedSubscription.user}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Full Name</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.user}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Email</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.email}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Phone</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.phone}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Purpose</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.purpose}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Meeting Preference</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.meetingPreference}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Appointment Date</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.startDate}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Appointment Time</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.appointmentTime}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Created On</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.createdAt}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200 gap-3">
                <button
                  onClick={handleViewCancel}
                  className="px-6 py-2 bg-[#C9A961] text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default Subscriptions;
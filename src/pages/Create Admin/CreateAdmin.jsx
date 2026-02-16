import { ConfigProvider, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  IoChevronBack,
  IoAddOutline,
} from "react-icons/io5";
import { FiEye, FiEdit2, FiTrash } from "react-icons/fi";
import Swal from 'sweetalert2';
import { useGetAdminQuery } from "../../redux/api/adminApi";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Fetch admin data from API
  const { data: adminData, isLoading, error } = useGetAdminQuery();
  
  // Transform API data to match table structure
  const transformedData = adminData?.data?.map((admin, index) => ({
    key: admin._id,
    id: admin._id,
    no: String(index + 1),
    name: admin.fullname,
    email: admin.email,
    designation: admin.role === 'admin' ? 'Admin' : 'Super Admin',
    mobile: admin.mobile || 'N/A',
    avatar: admin.avatar || '',
    createdAt: new Date(admin.createdAt).toLocaleDateString(),
  })) || [];

  const showViewModal = (admin) => {
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedAdmin(null);
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no", width: 70 },
    {
      title: "Icon",
      dataIndex: "avatar",
      key: "avatar",
      width: 90,
      render: (avatar, record) => {
        const initial = (record?.name || "A").trim().charAt(0).toUpperCase();
        return avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            {initial}
          </div>
        );
      },
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    {
      title: "Action",
      key: "action",
      width: 90,
      render: (_, record) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => showViewModal(record)}>
            <FiEye className="text-blue-600 w-5 h-5 cursor-pointer rounded-md" />
          </button>
          <button type="button" onClick={() => navigate(`/edit-admin/${record.id}`)}>
            <FiEdit2 className="text-[#C9A961] w-5 h-5 cursor-pointer rounded-md" />
          </button>
          <button type="button" onClick={() => navigate(`/edit-admin/${record.id}`)}>
            <FiTrash className="text-[#C9A961] w-5 h-5 cursor-pointer rounded-md" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <div className="bg-[#C9A961] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Create Admin</h1>
        <button
          type="button"
          onClick={() => navigate("/add-admin")}
          className="ml-auto bg-white text-[#C9A961] px-3 py-1 rounded-md font-semibold flex items-center gap-2 hover:opacity-95 transition"
        >
          <IoAddOutline className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "[#C9A961]",
              headerColor: "[#C9A961]",
              cellFontSize: 16,
              headerSplitColor: "[#C9A961]",
            },
            Pagination: {
              colorPrimaryBorder: "[#C9A961]",
              colorBorder: "[#C9A961]",
              colorPrimaryHover: "[#C9A961]",
              colorTextPlaceholder: "[#C9A961]",
              itemActiveBgDisabled: "[#C9A961]",
              colorPrimary: "[#C9A961]",
            },
          },
        }}
      >
        <Table
          dataSource={transformedData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />

        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={700}
        >
          {selectedAdmin && (
            <div className="relative">
              <div className="bg-[#C9A961] p-6 -m-6 mb-6 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white mb-2">Admin Details</h2>
                <div className="flex items-center gap-3">
                  <span className="text-white/90">{selectedAdmin.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm md:col-span-2">
                  <div className="text-gray-500 text-sm mb-2">Icon</div>
                  {selectedAdmin.avatar ? (
                    <img
                      src={selectedAdmin.avatar}
                      alt="avatar"
                      className="h-16 w-16 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      {(selectedAdmin?.name || "A").trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Name</div>
                  <div className="text-lg font-semibold">{selectedAdmin.name}</div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Email</div>
                  <div className="text-lg font-semibold">{selectedAdmin.email}</div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Mobile</div>
                  <div className="text-lg font-semibold">{selectedAdmin.mobile}</div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Designation</div>
                  <div className="text-lg font-semibold">{selectedAdmin.designation}</div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm md:col-span-2">
                  <div className="text-gray-500 text-sm">Created At</div>
                  <div className="text-lg font-semibold">{selectedAdmin.createdAt}</div>
                </div>
              </div>

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

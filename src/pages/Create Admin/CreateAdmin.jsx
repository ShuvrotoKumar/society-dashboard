import { ConfigProvider, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IoChevronBack,
  IoAddOutline,
} from "react-icons/io5";
import { FiEye, FiEdit2, FiTrash } from "react-icons/fi";
import Swal from 'sweetalert2';
import { useGetAdminQuery, useUpdateAdminMutation, useDeleteAdminMutation } from "../../redux/api/adminApi";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch admin data from API
  const { data: adminData, isLoading, error, refetch } = useGetAdminQuery();
  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  
  // Transform API data to match table structure
  const transformedData = adminData?.data?.map((admin, index) => {
    // Debug: Log the raw admin data
    console.log('Raw admin data:', admin);
    
    return {
      key: admin._id,
      id: admin._id,
      no: String(index + 1),
      name: admin.fullname,
      email: admin.email,
      designation: admin.role === 'admin' ? 'Admin' : 'Super Admin',
      mobile: admin.mobile || 'N/A',
      avatar: admin.avatar || admin.profileImage || admin.image || admin.photo || '',
      createdAt: new Date(admin.createdAt).toLocaleDateString(),
    };
  }) || [];

  const showViewModal = (admin) => {
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
  };

  const showEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      fullname: admin.name,
      email: admin.email,
      mobile: admin.mobile === 'N/A' ? '' : admin.mobile,
      role: admin.designation === 'Admin' ? 'admin' : 'super_admin'
    });
    setIsEditModalOpen(true);
  };

  const showDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
    setEditForm({});
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleEditSubmit = async () => {
    try {
      const requestData = {
        id: selectedAdmin.id,
        fullname: editForm.fullname,
        email: editForm.email,
        mobile: editForm.mobile,
        role: editForm.role
      };
      
      await updateAdmin({ requestData }).unwrap();
      Swal.fire('Success!', 'Admin updated successfully', 'success');
      refetch(); // Refresh the data
      handleEditCancel();
    } catch (error) {
      Swal.fire('Error!', 'Failed to update admin', 'error');
      console.error('Update error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const requestData = {
        id: selectedAdmin.id
      };
      
      await deleteAdmin({ requestData }).unwrap();
      Swal.fire('Success!', 'Admin deleted successfully', 'success');
      refetch(); // Refresh the data
      handleDeleteCancel();
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete admin', 'error');
      console.error('Delete error:', error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
        
        // Debug: Log avatar data
        console.log('Avatar data for', record.name, ':', avatar);
        
        // Check if avatar exists and is a valid URL
        const hasValidAvatar = avatar && 
          typeof avatar === 'string' && 
          avatar.trim() !== '' && 
          (avatar.startsWith('http') || avatar.startsWith('data:image'));
        
        return (
          <div className="relative">
            {hasValidAvatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  console.log('Image failed to load:', avatar);
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', avatar);
                }}
              />
            ) : null}
            <div 
              className={`h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold ${hasValidAvatar ? 'hidden' : ''}`}
              style={{ display: hasValidAvatar ? 'none' : 'flex' }}
            >
              {initial}
            </div>
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
          <button type="button" onClick={() => showEditModal(record)}>
            <FiEdit2 className="text-[#C9A961] w-5 h-5 cursor-pointer rounded-md" />
          </button>
          <button type="button" onClick={() => showDeleteModal(record)}>
            <FiTrash className="text-red-600 w-5 h-5 cursor-pointer rounded-md" />
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

        <Modal
          open={isEditModalOpen}
          centered
          onCancel={handleEditCancel}
          footer={null}
          width={600}
        >
          {selectedAdmin && (
            <div className="relative">
              <div className="bg-[#C9A961] p-6 -m-6 mb-6 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white mb-2">Edit Admin</h2>
                <div className="flex items-center gap-3">
                  <span className="text-white/90">{selectedAdmin.name}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullname || ''}
                    onChange={(e) => handleEditChange('fullname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                  <input
                    type="text"
                    value={editForm.mobile || ''}
                    onChange={(e) => handleEditChange('mobile', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={editForm.role || 'admin'}
                    onChange={(e) => handleEditChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200 gap-3">
                <button
                  onClick={handleEditCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-6 py-2 bg-[#C9A961] text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          open={isDeleteModalOpen}
          centered
          onCancel={handleDeleteCancel}
          footer={null}
          width={500}
            
        >
          {selectedAdmin && (
            <div className="relative">
              <div className="bg-red-600 p-6 -m-6 mb-6 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white mb-2">Delete Admin</h2>
                <div className="flex items-center gap-3">
                  <span className="text-white/90">Confirm Deletion</span>
                </div>
              </div>

              <div className="text-center py-6">
                <div className="mb-6">
                  {selectedAdmin.avatar ? (
                    <img
                      src={selectedAdmin.avatar}
                      alt="avatar"
                      className="h-20 w-20 rounded-full object-cover border border-gray-200 mx-auto"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold mx-auto">
                      {(selectedAdmin?.name || "A").trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedAdmin.name}</h3>
                <p className="text-gray-600 mb-1">{selectedAdmin.email}</p>
                <p className="text-sm text-gray-500 mb-6">{selectedAdmin.designation}</p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">Are you sure you want to delete this admin?</p>
                  <p className="text-red-600 text-sm mt-1">This action cannot be undone.</p>
                </div>
              </div>

              <div className="flex justify-end items-center pt-6 border-t border-gray-200 gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Admin
                </button>
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
}

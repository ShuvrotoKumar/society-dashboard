import { ConfigProvider, Modal, Table, Button, Input, Select } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { FiEdit2, FiEye, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useGetTeamUserQuery } from "../../redux/api/userApi";

function UserDetails() {
  const navigate = useNavigate();
  const { data: teamData, isLoading, error } = useGetTeamUserQuery();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'User',
    clinic: '',
    email: '',
    phone: '',
    joined: new Date().toISOString().split('T')[0]
  });

  // Transform API data to match table structure
  const dataSource = useMemo(() => {
    if (!teamData?.data) return [];
    return teamData.data.map((user, index) => ({
      key: user._id,
      fullName: user.name,
      role: user.designation || 'N/A',
      email: user.email,
      phone: user.phone || 'N/A',
      joined: new Date(user.createdAt).toLocaleDateString(),
      profilePicture: user.profilePicture,
      bio: user.bio,
      keyword: user.keyword,
    }));
  }, [teamData]);

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const showViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const showAddModal = () => {
    setFormData({
      fullName: '',
      role: 'User',
      clinic: '',
      email: '',
      phone: '',
      joined: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      role: user.role,
      clinic: user.clinic,
      email: user.email,
      phone: user.phone,
      joined: user.joined
    });
    setIsEditModalOpen(true);
  };

  const handleAddMember = () => {
    const newMember = {
      key: String(dataSource.length + 1),
      ...formData
    };
    dataSource.push(newMember);
    setIsAddModalOpen(false);
    Swal.fire({
      title: 'Added!',
      text: 'New member has been added successfully.',
      icon: 'success',
      confirmButtonColor: '#C9A961',
      timer: 2000,
      timerProgressBar: true
    });
  };

  const handleEditMember = () => {
    const index = dataSource.findIndex(user => user.key === selectedUser.key);
    if (index !== -1) {
      dataSource[index] = { ...dataSource[index], ...formData };
      setIsEditModalOpen(false);
      setSelectedUser(null);
      Swal.fire({
        title: 'Updated!',
        text: 'Member has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#C9A961',
        timer: 2000,
        timerProgressBar: true
      });
    }
  };

  const handleDeleteMember = (user) => {
    Swal.fire({
      title: 'Delete Member?',
      html: `Are you sure you want to delete <strong>${user.fullName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C9A961',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const index = dataSource.findIndex(u => u.key === user.key);
        if (index !== -1) {
          dataSource.splice(index, 1);
        }
        Swal.fire({
          title: 'Deleted!',
          text: `${user.fullName} has been deleted.`,
          icon: 'success',
          confirmButtonColor: '#C9A961',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.profilePicture || `https://avatar.iran.liara.run/public/${record.key}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span className="leading-none">{value}</span>
        </div>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phone", key: "phone" },
    { title: "Joined Date", dataIndex: "joined", key: "joined" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => showViewModal(record)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View member"
          >
            <FiEye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => showEditModal(record)}
            className="text-[#C9A961] hover:text-blue-800 p-1"
            title="Edit member"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteMember(record)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete member"
          >
            <FiTrash className="h-4 w-4" />
          </button>
         
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return dataSource.filter((r) => {
      const matchRole = roleFilter ? r.role === roleFilter : true;
      const matchQuery = q
        ? [r.fullName, r.email, r.phone, r.clinic, r.role]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchRole && matchQuery;
    });
  }, [dataSource, roleFilter, searchQuery]);

  const openBlock = (row) => {
    Swal.fire({
      title: 'Block User?',
      html: `Are you sure you want to block <strong>${row.fullName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C9A961',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Block',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Blocked!',
          text: `${row.fullName} has been blocked.`,
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
        <h1 className="text-white text-xl sm:text-2xl font-bold">Team Management</h1>
        {/* Mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
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
              placeholder="Search members..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
          <button
            onClick={showAddModal}
            className="bg-white text-[#C9A961] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <IoAddOutline className="w-5 h-5" />
            <span>Add Member</span>
          </button>
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
              headerBg: "[#C9A961]",
              headerColor: "#000000", // Changed to black
              cellFontSize: 16,
              headerSplitColor: "[#C9A961]",
              colorTextHeading: "#000000", // Ensure header text is black
            },
          },
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />
        
        {/* View Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
          className="user-view-modal"
        >
          {selectedUser && (
            <div className="relative">
              {/* Header with green gradient */}
              <div className="bg-[#C9A961] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={selectedUser.profilePicture || `https://avatar.iran.liara.run/public/${selectedUser.key}`}
                      alt={selectedUser.fullName}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedUser.fullName}
                    </h2>
                    <div className="flex items-center gap-3 mb-1">
                      {/* <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {selectedUser.clinic}
                      </span> */}
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Joined: {selectedUser.joined}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Email</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.email}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Phone No</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.phone}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Joined Date</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.joined}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleViewCancel}
                  className="bg-[#C9A961] text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add Member Modal */}
        <Modal
          title="Add New Member"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={handleAddMember}
              style={{ backgroundColor: "#C9A961", borderColor: "#C9A961" }}
            >
              Add Member
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Select
                value={formData.role}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                className="w-full"
              >
                <Select.Option value="User">User</Select.Option>
                <Select.Option value="Vendor">Vendor</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
              <Input
                value={formData.clinic}
                onChange={(e) => setFormData(prev => ({ ...prev, clinic: e.target.value }))}
                placeholder="Enter clinic name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
              <Input
                type="date"
                value={formData.joined}
                onChange={(e) => setFormData(prev => ({ ...prev, joined: e.target.value }))}
              />
            </div>
          </div>
        </Modal>

        {/* Edit Member Modal */}
        <Modal
          title="Edit Member"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={handleEditMember}
              style={{ backgroundColor: "#C9A961", borderColor: "#C9A961" }}
            >
              Save Changes
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Select
                value={formData.role}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                className="w-full"
              >
                <Select.Option value="User">User</Select.Option>
                <Select.Option value="Vendor">Vendor</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
              <Input
                value={formData.clinic}
                onChange={(e) => setFormData(prev => ({ ...prev, clinic: e.target.value }))}
                placeholder="Enter clinic name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
              <Input
                type="date"
                value={formData.joined}
                onChange={(e) => setFormData(prev => ({ ...prev, joined: e.target.value }))}
              />
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default UserDetails;

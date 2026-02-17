import { useState, useMemo } from 'react';
import { ConfigProvider, Modal, Table, Select, Input, Button } from "antd";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useGet_all_blogsQuery, useAdd_blogMutation, useUpdate_blogMutation, useDelete_blogMutation } from "../../redux/api/blogApi";
import { getImageUrl } from "../../config/envConfig";

const Blogs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    coverImage: null
  });

  // API hooks
  const { data: blogsData, isLoading, error, refetch } = useGet_all_blogsQuery();
  const [addBlog] = useAdd_blogMutation();
  const [updateBlog] = useUpdate_blogMutation();
  const [deleteBlog] = useDelete_blogMutation();
  
  const blogs = blogsData?.data || [];
  
  // Debug: Log the blogs data
  console.log('Blogs data:', blogsData);
  console.log('Blogs array:', blogs);
  
  // Test getImageUrl function
  if (blogs.length > 0) {
    const testBlog = blogs[0];
    console.log('Test blog coverImage:', testBlog.coverImage);
    console.log('getImageUrl result:', getImageUrl(testBlog.coverImage));
  }

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Blog Title",
      dataIndex: "title",
      key: "title",
      render: (value, record) => {
        const imageUrl = getImageUrl(record.coverImage);
        console.log('Blog record:', record);
        console.log('Cover image path:', record.coverImage);
        console.log('Final image URL:', imageUrl);
        
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                className="w-full h-full object-cover"
                alt="Blog thumbnail"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl);
                }}
              />
            </div>
            <div>
              <span className="font-medium leading-none">{value}</span>
              <div className="text-xs text-gray-500 mt-1">{record.body?.substring(0, 50)}...</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {category || 'General'}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          Published: "bg-green-100 text-green-800",
          Draft: "bg-gray-100 text-gray-800",
          Scheduled: "bg-yellow-100 text-yellow-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Engagement",
      key: "engagement",
      render: (_, record) => (
        <div className="text-sm">
          <div className="text-gray-600">ID: {record._id}</div>
          <div className="text-gray-600">{record.status || 'Draft'}</div>
        </div>
      ),
    },
    {
      title: "Published Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleView(record)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View blog"
          >
            <FiEye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEdit(record)}
            className="text-[#C9A961] hover:text-blue-800 p-1"
            title="Edit blog"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete blog"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return blogs.filter((blog) => {
      const matchStatus = statusFilter === "all" ? true : blog.status === statusFilter;
      const matchQuery = q
        ? [blog.title, blog.body, blog.category, blog.status]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchStatus && matchQuery;
    });
  }, [blogs, statusFilter, searchQuery]);

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      body: blog.body,
      coverImage: blog.coverImage
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (blog) => {
    Swal.fire({
      title: 'Delete Blog?',
      html: `Are you sure you want to delete blog <strong>${blog.title}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C9A961',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBlog(blog._id).unwrap();
          Swal.fire({
            title: 'Deleted!',
            text: 'Blog has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#C9A961',
            timer: 2000,
            timerProgressBar: true
          });
          refetch();
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete blog', 'error');
        }
      }
    });
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      body: '',
      coverImage: null
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('body', formData.body);
      if (formData.coverImage && typeof formData.coverImage !== 'string') {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      
      await updateBlog({ id: selectedBlog._id, data: formDataToSend }).unwrap();
      Swal.fire({
        title: 'Updated!',
        text: 'Blog has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#C9A961',
        timer: 2000,
        timerProgressBar: true
      });
      refetch();
      setIsEditModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      Swal.fire('Error!', 'Failed to update blog', 'error');
    }
  };

  const handleSaveNew = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('body', formData.body);
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      
      await addBlog(formDataToSend).unwrap();
      Swal.fire({
        title: 'Added!',
        text: 'New blog has been added successfully.',
        icon: 'success',
        confirmButtonColor: '#C9A961',
        timer: 2000,
        timerProgressBar: true
      });
      refetch();
      setIsAddModalOpen(false);
    } catch (error) {
      Swal.fire('Error!', 'Failed to add blog', 'error');
    }
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
        <h1 className="text-white text-xl sm:text-2xl font-bold">Blog Management</h1>
        
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-32"
            placeholder="Status"
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="Published">Published</Select.Option>
            <Select.Option value="Draft">Draft</Select.Option>
            <Select.Option value="Scheduled">Scheduled</Select.Option>
          </Select>
          <button
            onClick={handleAddNew}
            className="bg-white text-[#C9A961] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <IoAddOutline className="w-5 h-5" />
            <span>Add Blog</span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="relative w-full md:hidden mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blogs..."
          className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
        />
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F2F2F2",
              headerColor: "#000000",
              cellFontSize: 14,
              headerSplitColor: "#E5E7EB",
              colorTextHeading: "#000000",
            },
            Pagination: {
              colorPrimaryBorder: "#C9A961",
              colorBorder: "#C9A961",
              colorPrimaryHover: "#C9A961",
              colorTextPlaceholder: "#6B7280",
              colorPrimary: "#C9A961",
            },
          },
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />

        {/* View Blog Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={() => setIsViewModalOpen(false)}
          footer={null}
          width={800}
        >
          {selectedBlog && (
            <div className="relative">
              <div className="bg-[#C9A961] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const modalImageUrl = getImageUrl(selectedBlog.coverImage);
                    console.log('Modal selected blog:', selectedBlog);
                    console.log('Modal cover image path:', selectedBlog.coverImage);
                    console.log('Modal final image URL:', modalImageUrl);
                    
                    return (
                      <img
                        src={modalImageUrl}
                        alt={selectedBlog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Modal image failed to load:', modalImageUrl);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        }}
                        onLoad={() => {
                          console.log('Modal image loaded successfully:', modalImageUrl);
                        }}
                      />
                    );
                  })()}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center gap-4 text-white">
                  <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                    {selectedBlog.status || 'Draft'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700">{selectedBlog.body}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="font-semibold px-8 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: "#C9A961", color: "white" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Blog Modal */}
        <Modal
          title="Edit Blog"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={handleSaveEdit}
              style={{ backgroundColor: "#C9A961", borderColor: "#C9A961" }}
            >
              Save Changes
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <Input.TextArea
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Enter blog content"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.files[0] }))}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#C9A961] file:text-white hover:file:bg-[#b89851]"
              />
              {formData.coverImage && (
                <p className="mt-1 text-sm text-gray-600">Selected: {formData.coverImage.name}</p>
              )}
            </div>
          </div>
        </Modal>

        {/* Add New Blog Modal */}
        <Modal
          title="Add New Blog"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={handleSaveNew}
              style={{ backgroundColor: "#C9A961", borderColor: "#C9A961" }}
            >
              Add Blog
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <Input.TextArea
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Enter blog content"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.files[0] }))}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#C9A961] file:text-white hover:file:bg-[#b89851]"
              />
              {formData.coverImage && (
                <p className="mt-1 text-sm text-gray-600">Selected: {formData.coverImage.name}</p>
              )}
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Blogs;

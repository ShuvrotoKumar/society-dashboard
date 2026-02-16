import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoEyeOutline, IoEyeOffOutline, IoCloudUploadOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import { useCreateAdminMutation } from "../../redux/api/adminApi";

export default function AddAdmin() {
  const navigate = useNavigate();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const [form, setForm] = useState({ 
    fullname: "", 
    email: "", 
    mobile: "", 
    password: "", 
    confirmPassword: "",
    avatar: null
  });
  const [showPass, setShowPass] = useState({ new: false, confirm: false });
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setForm(prev => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname || !form.email || !form.mobile || !form.password || !form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields',
        confirmButtonColor: '#C9A961'
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match',
        confirmButtonColor: '#C9A961'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullname', form.fullname);
      formData.append('email', form.email);
      formData.append('mobile', form.mobile);
      formData.append('password', form.password);
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }

      await createAdmin({ requestData: formData }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Admin Created Successfully',
        text: `${form.fullname} has been added to the admin list.`,
        confirmButtonColor: '#C9A961',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.data?.message || 'Failed to create admin',
        confirmButtonColor: '#C9A961'
      });
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="bg-[#C9A961] text-[white] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Add Admin</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-md shadow border border-gray-200 p-5 mb-5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#C9A961] mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#C9A961] mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="abc@gmail.com"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#C9A961] mb-1">Mobile</label>
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              placeholder="+1234567890"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#C9A961] mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPass.new ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => ({ ...s, new: !s.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPass.new ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#C9A961] mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPass.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPass.confirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#C9A961] mb-1">Profile Image</label>
            <div
              className="w-full border border-gray-300 rounded-md px-4 py-8 flex flex-col items-center justify-center text-gray-500 bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
              role="button"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <>
                  <IoCloudUploadOutline className="w-8 h-8 mb-2" />
                  <span>Upload Image</span>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#C9A961] text-white font-semibold py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Admin...' : 'Create Admin'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

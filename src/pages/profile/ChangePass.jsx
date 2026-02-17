import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useChangeAdminPasswordMutation } from "../../redux/api/adminApi";
import Swal from 'sweetalert2';

function ChangePass() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [changeAdminPassword] = useChangeAdminPasswordMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire('Error!', 'New password and confirm password do not match', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      Swal.fire('Error!', 'Password should be at least 6 characters long', 'error');
      return;
    }

    try {
      await changeAdminPassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      }).unwrap();
      
      Swal.fire({
        title: 'Success!',
        text: 'Password changed successfully',
        icon: 'success',
        confirmButtonColor: '#C9A961',
        timer: 2000,
        timerProgressBar: true
      });
      
      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      Swal.fire('Error!', 'Failed to change password', 'error');
    }
  };

  return (
    <div className="bg-white w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8 pt-8 py-5 rounded-md border border-gray-200 shadow-sm">
      <p className="text-[#111827] text-center font-bold text-xl sm:text-2xl mb-5">
        Change Password
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full">
          <label
            htmlFor="oldPassword"
            className="text-sm md:text-base text-[#111827] mb-2 font-semibold"
          >
            Current Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="**********"
              className="w-full border border-gray-300 rounded-md outline-none px-4 py-3 placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6A6D76]"
            >
              {showPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="newPassword"
            className="text-sm md:text-base text-[#111827] mb-2 font-semibold"
          >
            New Password
          </label>
          <div className="w-full relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="**********"
              className="w-full border border-gray-300 rounded-md outline-none px-4 py-3 placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6A6D76]"
            >
              {showNewPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="confirmPassword"
            className="text-sm md:text-base text-[#111827] mb-2 font-semibold"
          >
            Confirm New Password
          </label>
          <div className="w-full relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="**********"
              className={`w-full border rounded-md outline-none px-4 py-3 placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E] ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6A6D76]"
            >
              {showConfirmPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>
        <div className="text-center pt-2">
          <button
            type="submit"
            className="bg-[#C9A961] text-white font-semibold w-full py-3 rounded-md hover:opacity-95 transition"
          >
            Save & Change
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePass;

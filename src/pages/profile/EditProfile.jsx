import { useEffect, useState } from "react";
import { useGetSingleAdminQuery, useUpdateAdminProfileMutation } from "../../redux/api/adminApi";
import Swal from 'sweetalert2';

function EditProfile() {
  const { data: adminData } = useGetSingleAdminQuery();
  const [updateAdminProfile] = useUpdateAdminProfileMutation();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (adminData?.data?.admin) {
      setFormData({
        fullname: adminData.data.admin.fullname || "",
        email: adminData.data.admin.email || "",
        mobile: adminData.data.admin.mobile || "",
      });
    }
  }, [adminData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminProfile({ requestData: formData }).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully',
        icon: 'success',
        confirmButtonColor: '#C9A961',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile', 'error');
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl px-4 sm:px-6 md:px-8 py-5 rounded-md border border-gray-200 shadow-sm">
        <p className="text-[#111827] text-center font-bold text-xl sm:text-2xl mb-5">
          Edit Your Profile
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm md:text-base text-[#111827] mb-2 font-semibold block">
              User Name
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#111827] mb-2 font-semibold block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E] bg-gray-100 cursor-not-allowed"
              placeholder="Enter email"
              disabled
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#0D0D0D] mb-2 font-semibold block">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-[#C9A961] text-white font-semibold w-full py-3 rounded-lg hover:opacity-95 transition"
            >
              Save & Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;

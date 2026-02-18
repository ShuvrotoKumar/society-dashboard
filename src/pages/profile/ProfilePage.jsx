import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import { IoChevronBack } from "react-icons/io5";
import { useGetSingleAdminQuery, useUpdateAdminAvatarMutation } from "../../redux/api/adminApi";
import { getImageUrl } from "../../config/envConfig";
import Swal from 'sweetalert2';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const navigate = useNavigate();
  const { data: adminData, isLoading, error, refetch } = useGetSingleAdminQuery();
  const [updateAdminAvatar] = useUpdateAdminAvatarMutation();

  if (isLoading) return <div>Loading Profile...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;

  const admin = adminData?.data?.admin;
  const avatarSrc = admin?.avatar
    ? `${getImageUrl(admin.avatar)}?v=${encodeURIComponent(admin?.updatedAt || admin?._id || "")}`
    : "https://avatar.iran.liara.run/public/44";

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error!', 'Please select an image file', 'error');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error!', 'Image size should be less than 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await updateAdminAvatar({ requestData: formData }).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Profile picture updated successfully',
        icon: 'success',
        confirmButtonColor: '#C9A961',
        timer: 2000,
        timerProgressBar: true
      });
      refetch(); // Refresh admin data to show new avatar
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile picture', 'error');
    }

    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="overflow-y-auto">
      <div className="px-5 pb-5 h-full">
        <div className="bg-[#C9A961] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Profile</h1>
        </div>
        <div className="mx-auto flex flex-col justify-center items-center">
          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row justify-center items-center bg-[#C9A961] mt-5 text-white w-full max-w-3xl mx-auto p-4 md:p-5 gap-4 md:gap-5 rounded-lg">
            <div className="relative">
              <div className="w-[122px] h-[122px] bg-[#C9A961] rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://avatar.iran.liara.run/public/44";
                  }}
                />
                {/* Upload Icon */}
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    <FaCamera className="text-[#575757]" />
                  </label>
                  <input 
                    type="file" 
                    id="profilePicUpload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg sm:text-xl md:text-3xl font-bold">{admin?.fullname || "Admin Name"}</p>
              <p className="text-base sm:text-lg font-semibold">{admin?.role || ""}</p>
            </div>
          </div>

          {/* Tab Navigation Section */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 text-sm sm:text-base md:text-xl font-semibold my-4 md:my-5">
            <p
              onClick={() => setActiveTab("editProfile")}
              className={`cursor-pointer px-3 py-1 rounded-md pb-1 ${activeTab === "editProfile"
                  ? "text-[#111827] border-b-2 border-[#111827]"
                  : "text-[#6A6D76]"
                }`}
            >
              Edit Profile
            </p>
            <p
              onClick={() => setActiveTab("changePassword")}
              className={`cursor-pointer px-3 py-1 rounded-md pb-1 ${activeTab === "changePassword"
                  ? "text-[#111827] border-b-2 border-[#111827]"
                  : "text-[#6A6D76]"
                }`}
            >
              Change Password
            </p>
          </div>

          {/* Tab Content Section */}
          <div className="flex justify-center items-center p-4 md:p-5 rounded-md w-full">
            <div className="w-full max-w-3xl">
              {activeTab === "editProfile" && <EditProfile />}
              {activeTab === "changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

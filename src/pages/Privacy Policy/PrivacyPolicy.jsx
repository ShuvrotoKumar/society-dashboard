import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoChevronBack } from "react-icons/io5";
import { useGetPrivacyQuery, useCreatePrivacyMutation, useUpdatePrivacyMutation } from "../../redux/api/privacyApi";

export default function PrivacyPolicy() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  
  const { data: privacyData, isLoading, error, isError } = useGetPrivacyQuery();
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();
  const [createPrivacy, { isLoading: isCreating }] = useCreatePrivacyMutation();

  useEffect(() => {
    if (privacyData?.data?.content) {
      setContent(privacyData.data.content);
    }
  }, [privacyData]);

  const handleSave = async () => {
    try {
      if (isError && error?.status === 404) {
        // Create new privacy policy if it doesn't exist
        await createPrivacy({
          requestData: { content }
        }).unwrap();
        console.log("Privacy policy created successfully");
      } else {
        // Update existing privacy policy
        await updatePrivacy({
          requestData: { content }
        }).unwrap();
        console.log("Privacy policy updated successfully");
      }
    } catch (error) {
      console.error("Failed to save privacy policy:", error);
    }
  };

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
        <h1 className="text-white text-2xl font-bold">Privacy Policy</h1>
      </div>

      <div className=" bg-white rounded shadow p-5 h-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading privacy policy...</div>
          </div>
        ) : isError && error?.status === 404 ? (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            No privacy policy found. Create a new one below.
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Failed to load privacy policy</div>
          </div>
        ) : null}
        
        <ReactQuill
          style={{ padding: "10px" }}
          theme="snow"
          value={content}
          onChange={setContent}
        />
      </div>
      <div className="text-center py-5 w-full">
        <button
          onClick={handleSave}
          disabled={isUpdating || isCreating || isLoading}
          className="bg-[#C9A961] text-white font-semibold w-full py-2 rounded transition duration-200 disabled:opacity-50"
        >
          {isUpdating || isCreating ? "Saving..." : 
           isError && error?.status === 404 ? "Create Privacy Policy" : 
           "Save changes"}
        </button>
      </div>
    </div>
  );
}



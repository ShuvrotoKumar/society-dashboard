import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoChevronBack } from "react-icons/io5";
import { 
  useGetTermsAndConditionsQuery, 
  useCreateTermsAndConditionsMutation, 
  useUpdateTermsAndConditionsMutation 
} from "../../redux/api/termsApi";

function TermsCondition() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  
  const { data: termsData, isLoading, error, isError } = useGetTermsAndConditionsQuery();
  const [updateTermsAndConditions, { isLoading: isUpdating }] = useUpdateTermsAndConditionsMutation();
  const [createTermsAndConditions, { isLoading: isCreating }] = useCreateTermsAndConditionsMutation();

  useEffect(() => {
    if (termsData?.data?.content) {
      setContent(termsData.data.content);
    }
  }, [termsData]);

  const handleSave = async () => {
    try {
      if (isError && error?.status === 404) {
        // Create new terms and conditions if they don't exist
        await createTermsAndConditions({
          requestData: { content }
        }).unwrap();
        console.log("Terms and conditions created successfully");
      } else {
        // Update existing terms and conditions
        await updateTermsAndConditions({
          requestData: { content }
        }).unwrap();
        console.log("Terms and conditions updated successfully");
      }
    } catch (error) {
      console.error("Failed to save terms and conditions:", error);
    }
  };

  return (
    <div className="px-5 md:px-0 py-5 md:py-10">
      <div className="bg-[#C9A961] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Terms & Condition</h1>
      </div>

      <div className=" bg-white rounded shadow p-5 h-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading terms and conditions...</div>
          </div>
        ) : isError && error?.status === 404 ? (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            No terms and conditions found. Create new ones below.
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Failed to load terms and conditions</div>
          </div>
        ) : null}
        
        <ReactQuill
          style={{ padding: "10px" }}
          theme="snow"
          value={content}
          onChange={setContent}
        />
      </div>
      <div className="text-center py-5">
        <button
          onClick={handleSave}
          disabled={isUpdating || isCreating || isLoading}
          className="bg-[#C9A961] text-white font-semibold w-full py-2 rounded transition duration-200 disabled:opacity-50"
        >
          {isUpdating || isCreating ? "Saving..." : 
           isError && error?.status === 404 ? "Create Terms & Conditions" : 
           "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default TermsCondition;

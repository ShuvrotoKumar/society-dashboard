import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForgotPasswordMutation } from "../../redux/api/authApi";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword({ email }).unwrap();
      localStorage.setItem("resetEmail", email);
      Swal.fire({
        title: "Success!",
        text: "OTP sent to your email",
        icon: "success",
        confirmButtonColor: "#C9A961",
        timer: 2000,
        timerProgressBar: true,
      });
      navigate("/verification-code");
    } catch (error) {
      Swal.fire("Error!", "Failed to send code", "error");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center ">
          <div className="w-full md:w-1/2 lg:w-1/2 p-5 md:px-[100px] md:py-[200px] bg-white  shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="flex justify-center items-center mb-10">
              <img src="/logo.png" alt="" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xl text-[#C9A961] mb-2 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nahidhossain@gmail.com"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/3 bg-[#C9A961] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5"
                >
                  {isLoading ? "Sending..." : "Send Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;

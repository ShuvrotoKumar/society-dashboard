import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useVerifyEmailMutation } from "../../redux/api/authApi";

function VerificationCode() {
  const [code, setCode] = useState(new Array(6).fill(""));

  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < newCode.length - 1) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const otp = code.join("");
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      Swal.fire("Error!", "Email not found. Please request OTP again.", "error");
      navigate("/forget-password");
      return;
    }

    if (code.some((d) => d === "") || otp.length !== 6) {
      Swal.fire("Error!", "Please enter the 6-digit code.", "error");
      return;
    }

    try {
      const res = await verifyEmail({ email, otp }).unwrap();
      console.log("Verify OTP Response:", res);

      const token = res?.data?.token || res?.data?.resetToken || res?.token || res?.resetToken;
      console.log("Extracted token:", token);

      if (token) {
        localStorage.setItem("resetToken", token);
        console.log("Token stored in localStorage");
      } else {
        console.error("No token found in response", res);
        Swal.fire("Error!", "Failed to get reset token. Please try again.", "error");
        return;
      }

      Swal.fire({
        title: "Success!",
        text: res?.message || "OTP verified successfully",
        icon: "success",
        confirmButtonColor: "#C9A961",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/new-password");
    } catch (error) {
      Swal.fire("Error!", error?.data?.message || "Invalid OTP", "error");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="flex justify-center items-center mb-10">
              <img src="/logo.png" alt="" />
            </div>

            <form className="space-y-5">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="shadow-xs w-12 h-12 text-2xl text-center border border-[#6A6D76] text-[#0d0d0d] rounded-lg focus:outline-none"
                  />
                ))}
              </div>
            </form>
            <div className="flex justify-center items-center my-5">
              <button
                onClick={handleVerifyCode}
                type="button"
                disabled={isLoading}
                className="w-1/3 bg-[#C9A961] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
            <p className="text-[#C9A961] text-center mb-10">
              You have not received the email?{" "}
              <span className="text-[#C9A961]"> Resend</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationCode;

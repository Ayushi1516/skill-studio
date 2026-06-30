import { API_URL } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const loadingToast = toast.loading("Logging in...");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      toast.dismiss(loadingToast);
      const userData = await res.json();

      if (res.ok && userData.token) {
        authLogin(userData);
        toast.success(`Welcome back, ${userData.displayName}!`);
        navigate("/");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-blue-100 flex justify-center items-center h-lvh">
        <div className="bg-mauve-50 rounded-2xl shadow-xl w-full p-8 max-w-sm">
          <h3 className=" text-blue-500 text-center">Login</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="m-4 text-center">
              <div className="mb-4 w-full ">
                <input
                  className="focus:outline-none p-2 w-full border-2 rounded-md overflow-hidden border-blue-100"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is Required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Email is invalid",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-600">{String(errors.email.message)}</span>
                )}
              </div>
              <div className="mb-4 w-full">
                <input
                  type="password"
                  className="focus:outline-none p-2 w-full border-2 rounded-md overflow-hidden border-blue-100"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is Required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-600 pt-5">
                    {String(errors.password.message)}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-400 hover:bg-blue-600 shadow-md text-white py-2 w-full rounded-md transition-all duration-200 active:scale-[0.98]"
              >
                Login
              </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

import { Link, useNavigate } from "react-router-dom";
// @ts-ignore: CSS module declarations not available in this project
import './login.css';
import { useAuth } from '../../context/AuthContext';
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { API_URL } from "../../constants";


export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    const loadingToast = toast.loading("Logging in...");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      toast.dismiss(loadingToast);
      const userData = await res.json();
      
      if (res.ok && userData.token) {
        authLogin(userData);
        toast.success(`Welcome back, ${userData.displayName}!`);
        navigate('/');
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <span className="font-bold text-center text-3xl">Skill Studio</span>
        <span className="title">Login to your account</span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group rounded-3xl">
            <span className="input-icon">📧</span>
            <input type="email" placeholder="Email" {...register("email", {
              required: 'Email is Required', pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email is invalid'
              }
            })} />
          </div>
          {errors.email && <span className="error">{String(errors.email.message)}</span>}
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input type="password" placeholder="Password" {...register("password", {
              required: 'Password is Required',
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })} />
          </div>
          {errors.password && <span className="error">{String(errors.password.message)}</span>}
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register Now</Link>
        </p>
      </div>
    </div>
  );
}
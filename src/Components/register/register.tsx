import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import skilllogo from "../../assets/logo.png";
import "./Register.css";
import toast from "react-hot-toast";
import { API_URL } from "../../constants";

export default function Register() {
  const navigate = useNavigate();
  const { handleSubmit, register, watch, formState: { errors } } = useForm();

  // Watch the instructor checkbox to conditionally show the qualification field
  const isInstructor = watch("isInstructor", false);

  const onSubmit = async (e: any) => {
    const loadingToast = toast.loading("Creating your account...");
    const role = e.isInstructor ? 'instructor' : 'user';

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          displayName: e.displayName, 
          email: e.email, 
          contact: e.contact, 
          password: e.password, 
          role,
          ...(role === 'instructor' && { qualification: e.qualification })
        }),
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success("Registration successful! Please log in.");
        navigate('/login');
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (<div className="form-container">
    <div className="form-wrapper">
      <span className="logo"><img
        src={skilllogo}
        alt="Sample Brand Logo"
        width="30"
        className="align-top d-inline-block"
        height="30"
        style={{ borderRadius: "50%" }}
      /> SkillStudio</span>
      <span className="title">Register</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><input type="text" placeholder="Display Name" {...register("displayName", { required: 'User Name is Required' })} />{errors.displayName && (
          <span className="error">
            {String(errors.displayName.message)}
          </span>
        )}</div>
        <div><input type="email" placeholder="Email"  {...register("email", {
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Email is invalid'
          }
        })} />{errors.email && (
          <span className="error">
            {String(errors.email.message)}
          </span>
        )}</div>
        <div><input type="text" placeholder="Contact" {...register("contact", {
          required: "Contact is required",
          minLength: {
            value: 10,
            message: "Contact must be at least 10 characters long",
          },
        })} />{errors.contact && (
          <span className="error">
            {String(errors.contact.message)}
          </span>
        )}</div>
        <div><input type="password" placeholder="Password" {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        })} />{errors.password && (
          <span className="error">
            {String(errors.password.message)}
          </span>
        )}</div>

        <div className="role-selection">
          <label>
            <input type="checkbox" {...register("isInstructor")} />
            Instructor
          </label>
        </div>

        {isInstructor && (
          <div className="qualification-container">
            <input type="text" placeholder="Qualification" {...register("qualification", { required: 'Qualification is Required' })} />
            {errors.qualification && (
              <span className="error">{String(errors.qualification.message)}</span>
            )}
          </div>
        )}

        <button type="submit">Sign up</button>
      </form>
      <p>You do have an account? <Link to="/login">Login</Link></p>
    </div>
  </div>)
}

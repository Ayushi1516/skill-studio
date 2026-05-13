import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import skilllogo from "../../assets/logo.png";
import "./Register.css";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = async (e: any) => {
    const loadingToast = toast.loading("Creating your account...");
    try {
      const checkUser = await fetch(`http://localhost:3001/users?email=${e.email}`);
      const existingUsers = await checkUser.json();
      if (existingUsers.length > 0) {
        toast.dismiss(loadingToast);
        toast.error("An account with this email already exists.");
        return;
      }
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: e.displayName, email: e.email, contact: e.contact, password: e.password, role: 'user' }),
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
        <button type="submit">Sign up</button>
      </form>
      <p>You do have an account? <Link to="/login">Login</Link></p>
    </div>
  </div>)
}

/* const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const displayName = formData.get("displayName") as string;
    const email = formData.get("email") as string;
    const contact = formData.get("contact") as string;
    const password = formData.get("password") as string;

    if (!displayName || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
  }; */

/* return (
    <div className="form-container">
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
        <form onSubmit={handleSubmit}>
          <input required type="text" name="displayName" placeholder="Display Name" />
          <input required type="email" name="email" placeholder="Email" />
          <input required type="text" name="contact" placeholder="Contact" />
          <input required type="password" name="password" placeholder="Password" />
          <button>Sign up</button>
        </form>
        <p>You do have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  ); */
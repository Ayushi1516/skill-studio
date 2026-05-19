import { API_URL } from "../../constants";
import { useAuth } from "../../context/AuthContext"
import { User } from "../../types/interfaces";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SettingsTab =() => {
     const { currentUser, login } = useAuth();
     const [profileUpdating, setProfileUpdating] = useState(false);
      const { register, handleSubmit, reset, formState: { errors } } = useForm<User>({ 
        defaultValues: {
          displayName: currentUser?.displayName || '',
          email: currentUser?.email || '',
          contact: currentUser?.contact || ''
        } 
      });

      useEffect(() => {
        if (currentUser) {
          reset({
            displayName: currentUser.displayName,
            email: currentUser.email,
            contact: currentUser.contact
          });
        }
        }, [currentUser, reset]);

    const updateProfile = async (data: User) => {
        if (!currentUser) return;
        try {
          const res = await fetch(`${API_URL}/users/${currentUser.userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser?.token}`
            },
            body: JSON.stringify(data)
          });
    
          if (res.ok) {
            const responseData = await res.json();
            // The API returns { message, user }. We extract responseData.user to update the state.
            // Update context with merged data to preserve the session token.
            login({ ...currentUser, ...responseData.user });
            toast.success("Profile updated successfully!");
            setProfileUpdating(false);
          } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Failed to update profile.");
          }
        } catch (error) {
          toast.error("Failed to update profile. Please try again.");
        }
      };

    return(
        <div className="dashboard-card settings-section">
            <h3>Profile</h3>
            <p>Manage your profile and preferences.</p>
            {profileUpdating ? (
              <form onSubmit={handleSubmit(updateProfile)}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    placeholder="Display Name"
                    {...register("displayName", { required: "Display Name is required" })}
                  />
                  {errors.displayName && <span className="error">{String(errors.displayName.message)}</span>}

                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <span className="error">{String(errors.email.message)}</span>}

                </div>

                <div className="form-group">
                  <label>Contact</label>
                  <input
                    placeholder="Contact"
                    {...register("contact", { required: "Contact is required" })}
                  />
                  {errors.contact && <span className="error">{String(errors.contact.message)}</span>}

                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : (
              <div className="settings-placeholder">
                <p>Email: {currentUser?.email}</p>
                <p>Name: {currentUser?.displayName}</p>
                <p>Contact: {currentUser?.contact}</p>
                <button className="view-course-btn" onClick={() => setProfileUpdating(true)}>
                  Update Profile
                </button>
              </div>)}
          </div>
    )
}

export default SettingsTab;
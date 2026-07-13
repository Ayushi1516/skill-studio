import { useAuth } from "../../../context/AuthContext";
import InstructorCourses from "../../instructor/InstructorCourses";
import UserEnrolledCourses from "../../user/UserEnrolledCourses";
import { Link } from "react-router-dom";



const MyCoursesTab = () => {
  const { currentUser } = useAuth();

  if(!currentUser) {
  return (
      <div className="dashboard-container">
        <h1>Please login to see your dashboard</h1><p><Link to="/login">Login</Link></p>
      </div>
  )
  } else if(currentUser?.role == 'instructor') {
    return (<InstructorCourses/>)
  } else if(currentUser?.role == 'user') {
    return (<UserEnrolledCourses/>)
  } else {
    return (<div><p>Nothing to show</p></div>)
  }
}

export default MyCoursesTab;
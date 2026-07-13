import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { Enrollment } from "../../types/interfaces";
import { getEnrollmentsByUserId, updateEnrollmentProgress } from "../../services/api";

const UserEnrolledCourses = () => {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchEnrolledCourses = async () => {
        try {
          const response = await getEnrollmentsByUserId(currentUser.userId);
          const data = response.data;
          const enrollmentsWithData = data.map((e: Enrollment) => {
            // Safely parse completedChapters if it comes as a string from the API
            let completed = e.completedChapters;
            if (typeof completed === 'string') {
              try { completed = JSON.parse(completed); } catch { completed = []; }
            }
            return { ...e, completedChapters: Array.isArray(completed) ? completed : [] };
          });

          setEnrollments(enrollmentsWithData);
        } catch (error: any) {
          setError(true);
          toast.error("Issue in Loading data...")
        } finally {
          setLoading(false);
        }
      }
      fetchEnrolledCourses();
    }
  }, [currentUser]);

  const handleToggleChapter = async (enrollmentId: number, chapterId: number) => {
    // Store the original state in case we need to roll back
    const originalEnrollments = enrollments;

    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return;

    const isCompleted = enrollment.completedChapters.includes(chapterId);
    const newCompletedChapters = isCompleted ? enrollment.completedChapters.filter(id => id !== chapterId) : [...enrollment.completedChapters, chapterId];

    // Optimistically update the UI
    setEnrollments(prevEnrollments => prevEnrollments.map(e => e.id === enrollmentId ? { ...e, completedChapters: newCompletedChapters } : e));

    try {
      // Send the update to the server
      await updateEnrollmentProgress(enrollmentId, newCompletedChapters);
    } catch (error) {
      // If the server update fails, roll back the UI change and notify the user
      setEnrollments(originalEnrollments);
      toast.error("Failed to update progress. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }
  if (error) {
    return <div>Error loading courses:</div>;
  }


  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <h1>Please login to see your dashboard</h1><p><Link to="/login">Login</Link></p>
      </div>
    )
  } else {
    return (
      <div className="my-courses-section">
        <h3 className="section-title">My Courses</h3>
        {enrollments.length > 0 ? (
          <div className="enrolled-courses-list">
            {enrollments.map((enrollment, index) => (
              <EnrolledCourseCard key={enrollment.id || index} enrollment={enrollment} onToggleChapter={handleToggleChapter} />
            ))}
          </div>
        ) : (
          <div className="dashboard-card"><p>You have not enrolled in any courses yet. <Link to="/">Browse courses</Link> to get started.</p></div>
        )}
      </div>
    )
  }
}

export default UserEnrolledCourses;
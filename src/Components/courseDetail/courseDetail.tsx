import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetail.css';
import { useAuth } from '../../context/AuthContext';
import type { Course } from '../../types/interfaces';
import { getCourse, checkEnrollment, enrollInCourse } from '../../services/api';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch course details using the API service
        const courseResponse = await getCourse(courseId);
        setCourse(courseResponse.data);

        // 2. If user is logged in, check their enrollment status
        if (currentUser) {
          try {
            const enrollmentResponse = await checkEnrollment(currentUser.userId, courseId);
            setIsEnrolled(enrollmentResponse.data.length > 0);
          } catch (enrollmentError) {
            // Don't break the page if only the enrollment check fails.
            // The global interceptor will handle 401s.
            console.error("Failed to check enrollment status:", enrollmentError);
            // You could optionally show a small, non-blocking warning to the user.
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [courseId, currentUser]);

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!course || isEnrolled) return;

    try {
      await enrollInCourse(currentUser.userId, course.courseId);
      setIsEnrolled(true);
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  if (loading) {
    return <div className="course-detail-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="course-detail-container"><p>Error: {error}</p></div>;
  }

  if (!course) {
    return <div className="course-detail-container"><p>Course not found.</p></div>;
  }

  return (
    <>
      <div className="course-detail-container">
        <div className="course-header">
          <img src={course.imageUrl} alt={course.name} className="course-image" />
          <div className="course-header-info">
            <h1>{course.name}</h1>
            <p className="course-meta">Level: {course.level} | Duration: {course.Duration}</p>
            <p className="course-price">${course.price}</p>
            <button className="enroll-button" onClick={handleEnroll} disabled={currentUser?.role == 'instructor' || isEnrolled}>
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
          </div>
        </div>
        <div className="course-body">
          <div className="course-description">
            <button className="back-button" onClick={() => navigate(-1)}>
              &#8592; Back
            </button>
            <h2>About this course</h2>
            <p>{course.description}</p>
          </div>
          <div className="course-chapters">
            <h2>Course Content</h2>
            <ul>
              {course.chapters?.map((chapter:any) => (
                <li key={chapter.id}>
                  <span className="chapter-title">{chapter.title}</span>
                  <span className="chapter-duration">{chapter.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

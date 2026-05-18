import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import toast from 'react-hot-toast';
import type { Chapter, Enrollment } from '../../types/interfaces';
import { API_URL } from '../../constants';

const ChapterItem = ({
  chapter,
  isCompleted,
  onToggle
}: {
  chapter: Chapter;
  isCompleted: boolean;
  onToggle: () => void;
}) => (
  <div className="chapter-item">
    <label>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onToggle}
      />
      <span className={isCompleted ? 'completed' : ''}>{chapter.title}</span>
    </label>
    <span className="chapter-duration">{chapter.duration}</span>
  </div>
);

const ChapterList = ({
  chapters,
  completedChapters,
  onToggleChapter
}: {
  chapters: Chapter[] | undefined;
  completedChapters: number[];
  onToggleChapter: (chapterId: number) => void;
}) => (
  <div className="chapter-list">
    <h3>Lessons</h3>
    {chapters?.map((chapter, index) => (
      <ChapterItem
        key={chapter.id || index}
        chapter={chapter}
        isCompleted={completedChapters.includes(chapter.id)}
        onToggle={() => onToggleChapter(chapter.id)}
      />
    ))}
  </div>
)

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="progress-section">
      <div className="progress-label">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%`}}></div>
      </div>
    </div>
  )
}

// The main card for an enrolled course, composed of smaller components.
const EnrolledCourseCard = ({
  enrollment,
  onToggleChapter
}: {
  enrollment: Enrollment;
  onToggleChapter: (enrollmentId: number, chapterId: number) => void;
}) => {
 const { course, completedChapters, id: enrollmentId } = enrollment;

 // If for some reason the course data is not expanded, render a fallback.
 if (!course) {
  return <div className="enrolled-course-item">Could not load course data.</div>
 }

 const totalChapters = course.chapters?.length || 0;
 const progress = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100): 0;

  return (
    <div className="enrolled-course-item">
      <img src={course.imageUrl} alt={course.name} className="dashboard-course-img" />
      <div className="course-info">
        <h2>{course.name}</h2>
        <ProgressBar progress={progress}/>
        <ChapterList chapters={course.chapters} completedChapters={completedChapters}
         onToggleChapter={(chapterId: number) => onToggleChapter(enrollmentId, chapterId)}/>
        <Link to={`/course/${course.courseId}`} className='view-course-btn'>Continue Learning</Link>
      </div>
    </div>)
 }

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'help' | 'settings'>('courses');
  const [err, setError] = useState(false);

  // Fetch enrolled courses when the component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      const fetchedEnrolledCourses = async () => {
        try {
          const res = await fetch(`${API_URL}/enrollments?userId=${currentUser.userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // This is the crucial part: sending the JWT
              'Authorization': `Bearer ${currentUser?.token}` 
            },
    });
          const data = await res.json();
          const enrollmentsWithData = data.map((e: Enrollment) => ({
             ...e,
             completedChapters: e.completedChapters || []
          }));
          setEnrollments(enrollmentsWithData);
        } catch(error) {
          toast.error("Failed to load your courses.");
          setError(true);
        } finally {
          setLoading(false);
        }
      }
      fetchedEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <h1>Please login to see your dashboard.</h1>
        <p><Link to="/login">Login</Link> to view your courses.</p>
      </div>
    );
  }
  if (loading) return <div className="dashboard-container"><h1>Loading...</h1></div>;
  if (err) return <div className="dashboard-container"><h1>Something went wrong.</h1></div>;

  //The way handleToggleChapter is connected to the UI is a great example of a fundamental React pattern: "lifting state up" and passing data and callbacks down through components.
  const handleToggleChapter = async (enrollmentId: number, chapterId: number) => {
    // Store the original state in case we need to roll back
    const originalEnrollments = enrollments;

    const enrollment = enrollments.find(e=> e.id ===enrollmentId);
    if (!enrollment) return;

    const isCompleted = enrollment.completedChapters.includes(chapterId);
    const newCompletedChapters = isCompleted ? enrollment.completedChapters.filter(id => id !== chapterId) : [...enrollment.completedChapters, chapterId];
    
    // Optimistically update the UI
    setEnrollments(prevEnrollments => prevEnrollments.map(e => e.id === enrollmentId ? {...e, completedChapters: newCompletedChapters} : e));

    try{
      // Send the update to the server
      await fetch(`${API_URL}/enrollments/${enrollmentId}`, {
        method: 'PATCH', //update
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({completedChapters: newCompletedChapters}),

      });
    } catch(error) {
      // If the server update fails, roll back the UI change and notify the user
      setEnrollments(originalEnrollments);
      toast.error("Failed to update progress. Please try again.");
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidenav">
        <nav>
          <button 
            className={`sidenav-item ${activeTab === 'courses' ? 'active' : ''}`} 
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button 
            className={`sidenav-item ${activeTab === 'help' ? 'active' : ''}`} 
            onClick={() => setActiveTab('help')}
          >
            Help
          </button>
          <button 
            className={`sidenav-item ${activeTab === 'settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </aside>

      <main className="dashboard-container">
        {activeTab === 'courses' && (
          <>
            <h3>My Courses</h3>
            {enrollments.length > 0 ? (
              <div className="enrolled-courses-list">
                {enrollments.map((enrollment, index) => (
                  <EnrolledCourseCard key={enrollment.id || index} enrollment={enrollment} onToggleChapter={handleToggleChapter} />
                ))}
              </div>
            ) : (
              <p>You have not enrolled in any courses yet. <Link to="/">Browse courses</Link> to get started.</p>
            )}
          </>
        )}

        {activeTab === 'help' && (
          <div className="help-section">
            <h3>Help & Support</h3>
            <p>Need assistance? Contact our support team at support@skillstudio.com</p>
            <ul>
              <li>Frequently Asked Questions</li>
              <li>Platform Tutorial</li>
              <li>Community Forum</li>
            </ul>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <p>Manage your profile and preferences.</p>
            <div className="settings-placeholder">
              <p>Email: {currentUser.email}</p>
              <p>DisplayName: {currentUser.displayName}</p>
              <button className="view-course-btn">Update Profile</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
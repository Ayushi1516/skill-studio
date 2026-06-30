import { Link } from "react-router-dom";
import { Enrollment, Chapter } from "../../types/interfaces";


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
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}

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

  const chapters = course.chapters || [];
  const totalChapters = chapters.length;
  
  // Ensure we only count completed chapters that actually exist in the current course
  const validCompletedCount = chapters.filter(ch => 
    completedChapters.some(id => String(id) === String(ch.id))
  ).length;

  const progress = totalChapters > 0 ? Math.round((validCompletedCount / totalChapters) * 100) : 0;

  return (
    <div className="enrolled-course-item">
      <img src={course.imageUrl} alt={course.name} className="dashboard-course-img" />
      <div className="course-info">
        <h2>{course.name}</h2>
        <ProgressBar progress={progress} />
        <ChapterList chapters={course.chapters} completedChapters={completedChapters}
          onToggleChapter={(chapterId: number) => onToggleChapter(enrollmentId, chapterId)} />
        <Link to={`/course/${course.courseId}`} className='view-course-btn'>Continue Learning</Link>
      </div>
    </div>)
}



export default EnrolledCourseCard;
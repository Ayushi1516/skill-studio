import './CourseCard.css';
import { Link } from 'react-router-dom';
import type { Course } from '../../types/interfaces';

interface CourseCardProps {
  courseData: Course[];
}
 interface CardProps {
  course: Course;
}

export default function CourseCard({ courseData }: CourseCardProps) {
    if (!courseData || courseData.length === 0) {
        return <p>No courses available at the moment.</p>;
    }
    return (
      <div className="gallery">
        {courseData.map((course) => (
          <Card key={course.courseId} course={course} />
        ))}
      </div>
    );
}

function Card({ course }: CardProps) {
  return (
    <Link to={`/course/${course.courseId}`} className="card-link">
      <div className="card">
        <img className="avatar" src={course.imageUrl} alt={course.name} />
        <div className="card-content">
          <h2>{course.name}</h2>
          <p>Duration: {course.Duration}</p>
          <p>Price: ${course.price}</p>
          <p>Level: {course.level}</p>
          <p>Rating: {course.rating} / 5</p>
        </div>
      </div>
    </Link>
  );
}
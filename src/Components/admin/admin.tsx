import { useState, useEffect } from 'react';
import './Admin.css';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import type { Course } from '../../types/interfaces';
import { useForm } from 'react-hook-form';

const initialCourseState = {
  name: '',
  imageUrl: '',
  Duration: '',
  level:'',
  price: '',
  rating: '',
  description: '',
  chapters: []
};

export default function Admin() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Course, 'id'>>({ defaultValues: initialCourseState });

  useEffect(() => {
    console.log(currentUser);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:3001/courses');
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to fetch courses");
    }
  };

  const onSubmit = async (data: Omit<Course, 'id'>) => {
    if (isEditing) {
      try {
        const res = await fetch(`http://localhost:3001/courses/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          toast.success("Course updated successfully");
          fetchCourses();
          resetForm();
        }
      } catch (error) {
        toast.error("Failed to update course");
      }
    } else {
      try {
        const res = await fetch('http://localhost:3001/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          toast.success("Course added successfully");
          fetchCourses();
          resetForm();
        }
      } catch (error) {
        toast.error("Failed to add course");
      }
    }
  };

  const handleEdit = (course: Course) => {
    setIsEditing(course.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = course;
    reset(rest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`http://localhost:3001/courses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Course deleted successfully");
        fetchCourses();
      }
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    reset(initialCourseState);
  };

  return (
    <div className="admin-container">
      {currentUser?.role == 'admin' ? (<>
        <div className="admin-header">
          <h3>Admin Dashboard</h3>
        </div>
        <form className="course-form" onSubmit={handleSubmit(onSubmit)}>
          <h4 style={{ gridColumn: 'span 2' }}>{isEditing ? 'Edit Course' : 'Add New Course'}</h4>
          <input
            placeholder="Course Name"
            {...register("name", { required: "Course Name is required" })}
          />
          {errors.name && <span className="error">{String(errors.name.message)}</span>}
          <input
            placeholder="Image URL"
            {...register("imageUrl", { required: "Image URL is required" })}
          />
          {errors.imageUrl && <span className="error">{String(errors.imageUrl.message)}</span>}
          <input
            placeholder="Duration (e.g. 3 months)"
            {...register("Duration", { required: "Duration is required" })}
          />
          {errors.Duration && <span className="error">{String(errors.Duration.message)}</span>}
          <input
            placeholder="Level"
            {...register("level", { required: "Level is required" })}
          />
          {errors.level && <span className="error">{String(errors.level.message)}</span>}
          <input
            placeholder="Price"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <span className="error">{String(errors.price.message)}</span>}
          <input
            placeholder="Rating (0-5)"
            {...register("rating", { required: "Rating is required" })}
          />
          {errors.rating && <span className="error">{String(errors.rating.message)}</span>}
          <textarea
            placeholder="Description"
            {...register("description", { required: "Description is required" })}
            rows={4}
          />
          {errors.description && <span className="error">{String(errors.description.message)}</span>}

          <div className="form-actions">
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>

        <div className="admin-course-list">
          <h4>Existing Courses</h4>
          {courses.map((course: Course) => (
            <div key={course.id} className="admin-course-item">
              <div className="admin-course-info">
                <img src={course.imageUrl} alt={course.name} className="admin-course-img" />
                <div>
                  <h5>{course.name}</h5>
                  <p>Price: ${course.price} | Rating: {course.rating}</p>
                </div>
              </div>
              <div className="admin-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(course)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div> </>) : (<h3>You need Admin rights to view this page.</h3>)}
    </div>
  );
} 
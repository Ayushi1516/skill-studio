import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../coursecard/courseCard";
import "./Home.css";
import { AppDispatch, RootState } from "../../features/redux/store";
import { fetchCourses } from "../../features/redux/courseSlice";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: courses, status, error } = useSelector((state: RootState) => state.course);
  const [searchQuery, setSearchQuery] = useState(""); // for filtering courseList

  useEffect(() => {
    // We only want to fetch courses if they haven't been fetched yet.
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
  }, [status, dispatch]);

  const filteredCourses = useMemo(() => 
    courses.filter((course:any) => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [courses, searchQuery]);

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <>
      <div className="section">
        <p>Welcome to SkillStudio!</p>
        <h1>Skills to transform your career and life</h1>
        <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        {isLoading && <p>Loading courses...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && <CourseCard courseData={filteredCourses} />}
      </div>
    </>
  );
}

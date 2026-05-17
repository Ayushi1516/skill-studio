import { useState, useEffect } from "react";
import CourseCard from "../coursecard/courseCard";
import "./Home.css";
import type { CourseSummary } from "../../types/interfaces";
import { API_URL } from "../../constants";

export default function Home() {
  const [courses, setCourses] = useState<CourseSummary[]>([]); // for setting course data
  const [searchQuery, setSearchQuery] = useState(""); // for filtering courseList
  const [loading, setLoading] = useState<boolean>(true); // for delaying in response
  const [error, setError] = useState<string | null>(null); // for error handling

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error: any) {
        setError(error.message);
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
        {loading && <p>Loading courses...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && <CourseCard courseData={filteredCourses} />}
      </div>
    </>
  );
}

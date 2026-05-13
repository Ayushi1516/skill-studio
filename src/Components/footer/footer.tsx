import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>SkillStudio</h3>
                    <p>Empowering learners worldwide with the best skills to transform their careers.</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/courses">Courses</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: info@skillstudio.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SkillStudio. All rights reserved.</p>
            </div>
        </footer>
    );
}
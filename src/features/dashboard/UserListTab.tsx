import { User } from "../../types/interfaces";
import { useState } from "react";

interface UserListTabProps {
    role: string;
    data: User[];
    loading: boolean;
}

const UserListTab = ({ role, data, loading }: UserListTabProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logic happens here so it updates whenever searchQuery changes
    const filteredData = data
        .filter((u) => u.role === role)
        .filter((u) => u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
        
    return (<div className="user-list">
        <h3 className="section-title">{role === 'user' ? 'Users' : 'Instructors'} List</h3>
        <div className="search-container">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-bar" placeholder={`Search ${role === 'user' ? 'users' : 'instructors'}...`} value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}/>
        </div>
        <table className="user-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((user: User, index: number) => (
                    <tr key={user.userId || index}>
                        <td>{user.displayName}</td>
                        <td>{user.email}</td>
                        <td>{user.contact}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        {loading && <p> Loading ...</p>}
    </div>)
}

export default UserListTab;
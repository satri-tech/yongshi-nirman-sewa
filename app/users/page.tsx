// app/users/page.js
export const revalidate = 60;

import { getAllUsers } from "@/lib/users/fetchAllUsers";

export default async function UsersPage() {
    const users = await getAllUsers();
    const buildTime = new Date().toISOString();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>

            {/* Add this to see when page was generated */}
            <div className="mb-4 p-2 bg-gray-100 rounded">
                <p><strong>Page generated at:</strong> {buildTime}</p>
                <p><strong>User count:</strong> {users.length}</p>
            </div>

            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.id} className="border p-3 rounded">
                        <p><strong>{user.username}</strong> ({user.email})</p>
                        <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
                        <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
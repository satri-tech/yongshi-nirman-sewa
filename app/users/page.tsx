export const revalidate = 1; // Revalidate every second for quick testing

import { getAllUsers } from "@/lib/users/fetchAllUsers";

export default async function UsersPage() {
    const users = await getAllUsers(); // SSG happens by default

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>
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

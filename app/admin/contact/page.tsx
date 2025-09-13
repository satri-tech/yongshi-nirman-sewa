export const dynamic = "force-dynamic";

import { fetchContacts } from "@/app/actions/contact";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Phone, User, Calendar } from "lucide-react"
import { truncateMessage } from "./utils";
import { formatDate } from "@/lib/utils/formatDate";
import DeleteContact from "./DeleteContact";

export default async function ContactUs() {
    const response = await fetchContacts()
    const contacts = response?.data;
    return <div>
        <div className="min-h-screen py-2">
            <div className="w-full px-2">
                <div className=" mb-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Portfolio Management</h1>
                            <p className="mt-2">
                                Create and manage your construction projects portfolio
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border px-2">
                    <Table >
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No contact messages found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts?.map((message) => (
                                    <TableRow key={message.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {message.fullName}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <a href={`mailto:${message.email}`} className="text-blue-500 hover:underline">
                                                    {message.email}
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <a href={`tel:${message.phone}`} className="text-blue-500 hover:underline">
                                                    {message.phone}
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                {truncateMessage(message.message)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {formatDate(message.createdAt)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <DeleteContact id={message.id} fullName={message.fullName} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    </div>
}



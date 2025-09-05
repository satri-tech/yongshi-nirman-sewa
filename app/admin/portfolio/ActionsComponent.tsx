import { Input } from '@/components/ui/input'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
const ActionsComponent = () => {
    return (
        <div className=" rounded-lg shadow-sm border p-3 mb-6">
            <div className="flex  gap-4 justify-between" >
                <Input
                    type="text"
                    placeholder="Search projects..."
                    className=" rounded-md px-3 py-5 text-base placeholder:text-base  w-full"
                />
                <div className='flex gap-4 '>
                    <Select>
                        <SelectTrigger className="w-[180px] py-5">
                            <SelectValue placeholder="Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="residential">Residential</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-[180px] py-5">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Light</SelectItem>
                            <SelectItem value="completed">Dark</SelectItem>
                            <SelectItem value="progress">Progress</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button>
                        <Plus className="w-5 h-5" />
                        Add New Project
                    </Button>
                </div>
            </div >
        </div >
    )
}

export default ActionsComponent

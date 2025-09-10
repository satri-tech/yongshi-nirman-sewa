
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formSchema } from "./CreatePortfolio";

type FormSchema = z.infer<typeof formSchema>;

interface SelectDeadlineProps {
    form: UseFormReturn<FormSchema>;
}

export default function SelectStartDate({ form }: SelectDeadlineProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full ">
                    <FormLabel className="text-base font-medium">
                        Start Date
                        <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex flex-col gap-1 w-full">
                        <FormControl className="w-full">
                            <Popover
                                modal={true}
                                open={isCalendarOpen}
                                onOpenChange={setIsCalendarOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left py-5 font-normal dark:bg-neutral-950",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ?? undefined}
                                        onSelect={(date) => {
                                            field.onChange(date || null);
                                            setIsCalendarOpen(false); // Close the calendar after selection
                                        }}

                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormControl>
                        <FormMessage className=" w-max font-medium" />
                    </div>
                </FormItem>
            )}
        />
    );
}

import React from "react";

export default function Footer() {
    return (
        <div className="w-full flex flex-col items-center bg-gray-100 text-gray-800 py-10 border-t border-gray-300" id="footer">
            <div className="w-10/12 flex flex-col gap-10">

                {/* Logo and Tagline Placeholder */}
                <div className="h-20 w-40 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>

                {/* Grid Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-6">

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-3">
                        <div className="h-3 w-24 bg-gray-300 rounded"></div>
                        <div className="h-3 w-28 bg-gray-300 rounded"></div>
                        <div className="h-3 w-20 bg-gray-300 rounded"></div>
                        <div className="h-3 w-32 bg-gray-300 rounded"></div>
                        <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    </div>

                    {/* Social Media */}
                    <div className="flex flex-col gap-3">
                        <div className="h-3 w-28 bg-gray-300 rounded"></div>
                        <div className="h-3 w-24 bg-gray-300 rounded"></div>
                        <div className="h-3 w-20 bg-gray-300 rounded"></div>
                        <div className="h-3 w-28 bg-gray-300 rounded"></div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <div className="h-4 w-48 bg-gray-300 rounded"></div>
                        <div className="h-4 w-36 bg-gray-300 rounded"></div>
                    </div>

                </div>
            </div>

            {/* Bottom Footer Text Placeholder */}
            <div className="w-10/12 border-t border-gray-300 mt-10 pt-4 text-right">
                <div className="h-3 w-64 bg-gray-200 rounded ml-auto"></div>
            </div>
        </div>

    );
};


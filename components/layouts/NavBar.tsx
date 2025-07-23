'use client'
export default function NavBar() {
 
    return (
        <div className="py-6 flex w-full justify-center sticky top-0 bg-white z-50 border-b border-gray-300">
            <div className="w-[92%] flex justify-between items-center">

                {/* Logo Placeholder */}
                <div className="h-10 w-10 bg-gray-300 rounded-md"></div>

                {/* Desktop Links */}
                <div className="hidden lg:flex gap-6 items-center">
                    {/* Navigation Link Placeholders */}
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>

                    {/* Menu Icon Placeholder */}
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>

                {/* Mobile Menu Icon */}
                <div className="lg:hidden h-6 w-6 bg-gray-300 rounded"></div>
            </div>
        </div>

    );
}
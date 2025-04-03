import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Flower2, Search, UserRoundSearch } from "lucide-react";
import { Link } from "react-router-dom";

// Create a new context to manage sidebar state globally
import { createContext } from "react";

// This would typically be in a separate file
export const SidebarContext = createContext({
    isSidebarOpen: true,
    toggleSidebar: () => {},
});

const SIDEBAR_ITEMS = [
    { name: "Dashboard", icon: Flower2, color: "#097969", path: "/dashboard" },
    { name: "Analyze", icon: Search, color: "#AFE1AF", path: "/analyze" },
    { name: "Advice", icon: UserRoundSearch, color: "#00FFFF", path: "/experts" },
];

const Sidebar = () => {
    // Get sidebar state from context instead of local state
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const openWidth = 256;
    const closedWidth = 80;

    return (
        <motion.div
            className="fixed left-0 top-0 h-screen bg-white bg-opacity-50 backdrop-blur-md border-r border-gray-700 shadow-lg z-30"
            animate={{ width: isSidebarOpen ? openWidth : closedWidth }}
        >
            {/* Sidebar content remains the same */}
            <div className="p-4 flex flex-col h-full">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit self-start"
                >
                    <Menu size={24} />
                </motion.button>

                <nav className="mt-8 flex flex-col flex-grow">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.path} to={item.path}>
                            <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;
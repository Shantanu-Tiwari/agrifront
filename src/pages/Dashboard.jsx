import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [aiResponse, setAiResponse] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("https://agriback-mj37.onrender.com/api/reports", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch reports: ${res.status}`);
                }

                const data = await res.json();
                setReports(Array.isArray(data) ? data : data.reports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setError(`Error fetching reports: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleKnowMore = async () => {
        if (!selectedReport) return;
        setLoadingAI(true);
        setAiResponse(null);

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Explain the disease: ${selectedReport.analysisResult}. Provide its cure and prevention.`,
            });

            setAiResponse(response.text);
        } catch (err) {
            console.error("Error fetching AI response:", err);
            setAiResponse("Failed to fetch AI response.");
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="bg-green-50 min-h-screen p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Previous Reports</h1>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : reports.length === 0 ? (
                <p className="text-gray-600">No reports found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div
                            key={report._id || report.id}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer transition-transform transform hover:scale-105"
                            onClick={() => setSelectedReport(report)}
                        >
                            <img
                                src={report.imageUrl || "/placeholder-image.jpg"}
                                alt="Report"
                                className="w-full h-40 object-cover rounded-md mb-4"
                                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                            />
                            <p className="text-gray-800">
                                <strong>Name:</strong> {report.name || "Disease Report"}
                            </p>
                            <p className="text-gray-800">
                                <strong>Status:</strong> {report.status || "Unknown"}
                            </p>
                            {report.status === "Processed" && (
                                <p className="text-gray-700">
                                    <strong>Result:</strong> {report.analysisResult || "No results available"}
                                </p>
                            )}
                            <p className="text-gray-600 text-sm mt-2">
                                <strong>Date:</strong> {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Unknown date"}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for detailed view */}
            {selectedReport && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedReport(null)} // Close when clicking outside
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setSelectedReport(null)}
                        >
                            ✕
                        </button>
                        <img
                            src={selectedReport.imageUrl}
                            alt="Full View"
                            className="w-full h-auto rounded-lg mb-4"
                        />
                        <p className="text-gray-800"><strong>Name:</strong> {selectedReport.name || "Disease Report"}</p>
                        <p className="text-gray-800"><strong>Status:</strong> {selectedReport.status || "Unknown"}</p>
                        <p className="text-gray-700"><strong>Result:</strong> {selectedReport.analysisResult || "No results available"}</p>
                        <p className="text-gray-600 text-sm"><strong>Date:</strong> {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleDateString() : "Unknown date"}</p>

                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={handleKnowMore}
                        >
                            Know More
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for AI Response */}
            {aiResponse && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setAiResponse(null)} // Close when clicking outside
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setAiResponse(null)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Disease Information</h2>
                        {loadingAI ? (
                            <p className="text-gray-600">Fetching details...</p>
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">{aiResponse}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

import { useEffect, useState } from "react";

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                console.log("Response status:", res.status);

                if (!res.ok) {
                    const errorData = await res.text();
                    console.error("API error response:", errorData);
                    throw new Error(`Failed to fetch reports: ${res.status}`);
                }

                const data = await res.json();
                console.log("Fetched Reports Data:", data);

                // Check if data is an array or has a reports field
                if (Array.isArray(data)) {
                    setReports(data);
                } else if (data.reports && Array.isArray(data.reports)) {
                    setReports(data.reports);
                } else {
                    console.error("Unexpected API response format:", data);
                    setReports([]);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
                setError(`Error fetching reports: ${error.message}`);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

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
                        <div key={report._id || report.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                            <img
                                src={report.imageUrl || "/placeholder-image.jpg"}
                                alt="Report"
                                className="w-full h-40 object-cover rounded-md mb-4"
                                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                            />
                            <p className="text-gray-800">
                                <strong>Name:</strong> {report.name || "Unnamed Report"}
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
        </div>
    );
};

export default Dashboard;

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, ChevronDown, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ExpertsPage = () => {
    // State for experts, reports, and form data
    const [experts, setExperts] = useState([]);
    const [reports, setReports] = useState([]);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ visible: false, success: false, message: "" });
    const [activeTab, setActiveTab] = useState("new");
    const [requests, setRequests] = useState([]);

    // Fetch experts and user reports on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // These would be your actual API endpoints
                const expertsResponse = await axios.get("https://agriback-mj37.onrender.com/experts");
                const reportsResponse = await axios.get("https://agriback-mj37.onrender.com/reports/user");
                const requestsResponse = await axios.get("https://agriback-mj37.onrender.com/expert-requests");

                setExperts(expertsResponse.data);
                setReports(reportsResponse.data);
                setRequests(requestsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setFeedback({
                    visible: true,
                    success: false,
                    message: "Failed to load data. Please try again."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle expert selection
    const handleExpertSelect = (expert) => {
        setSelectedExpert(expert);
    };

    // Handle report selection
    const handleReportSelect = (report) => {
        setSelectedReport(report);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedExpert || !selectedReport) {
            setFeedback({
                visible: true,
                success: false,
                message: "Please select both an expert and a report."
            });
            return;
        }

        try {
            setLoading(true);
            // This would be your actual API endpoint
            await axios.post("https://agriback-mj37.onrender.com/expert-requests", {
                expertId: selectedExpert._id,
                reportId: selectedReport._id,
                message
            });

            setFeedback({
                visible: true,
                success: true,
                message: "Your request has been sent successfully!"
            });

            // Reset form
            setSelectedExpert(null);
            setSelectedReport(null);
            setMessage("");

            // Refresh request list
            const requestsResponse = await axios.get("https://agriback-mj37.onrender.com/expert-requests");
            setRequests(requestsResponse.data);

            // Switch to history tab
            setActiveTab("history");
        } catch (error) {
            console.error("Error submitting request:", error);
            setFeedback({
                visible: true,
                success: false,
                message: "Failed to send request. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    // Mock data for development - remove in production
    if (experts.length === 0) {
        setExperts([
            { _id: "1", name: "Dr. Sarah Johnson", specialty: "Plant Pathology", image: "/api/placeholder/80/80", rating: 4.8 },
            { _id: "2", name: "Prof. Michael Chen", specialty: "Soil Science", image: "/api/placeholder/80/80", rating: 4.7 },
            { _id: "3", name: "Dr. Amelia Rodriguez", specialty: "Agricultural Economics", image: "/api/placeholder/80/80", rating: 4.9 }
        ]);
    }

    if (reports.length === 0) {
        setReports([
            { _id: "1", title: "Tomato Plant Analysis", date: "2025-03-28", status: "completed" },
            { _id: "2", title: "Wheat Field Assessment", date: "2025-03-20", status: "completed" },
            { _id: "3", title: "Soil Quality Report", date: "2025-03-15", status: "completed" }
        ]);
    }

    if (requests.length === 0) {
        setRequests([
            {
                _id: "1",
                expert: { name: "Dr. Sarah Johnson", specialty: "Plant Pathology" },
                report: { title: "Tomato Plant Analysis" },
                status: "pending",
                createdAt: "2025-03-30T10:30:00Z"
            },
            {
                _id: "2",
                expert: { name: "Prof. Michael Chen", specialty: "Soil Science" },
                report: { title: "Soil Quality Report" },
                status: "completed",
                createdAt: "2025-03-25T14:45:00Z",
                response: "Based on your soil analysis, I recommend increasing nitrogen levels..."
            }
        ]);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Expert Advice</h1>

            {/* Tab navigation */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'new' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('new')}
                >
                    New Request
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('history')}
                >
                    Request History
                </button>
            </div>

            {/* New Request Form */}
            {activeTab === 'new' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    {feedback.visible && (
                        <div className={`p-4 mb-6 rounded-md ${feedback.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {feedback.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-4">Select an Expert</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {experts.map((expert) => (
                                    <div
                                        key={expert._id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedExpert?._id === expert._id ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'}`}
                                        onClick={() => handleExpertSelect(expert)}
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={expert.image || "/api/placeholder/80/80"}
                                                alt={expert.name}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                            <div>
                                                <h3 className="font-medium">{expert.name}</h3>
                                                <p className="text-sm text-gray-600">{expert.specialty}</p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="text-sm ml-1">{expert.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-4">Select a Report</h2>
                            <div className="relative">
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {selectedReport ? selectedReport.title : "Select a report..."}
                    </span>
                                        <ChevronDown size={20} className="text-gray-500" />
                                    </div>

                                    <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                        {reports.map((report) => (
                                            <div
                                                key={report._id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                                                onClick={() => handleReportSelect(report)}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{report.title}</span>
                                                    <span className="text-sm text-gray-500">
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-4">Message (Optional)</h2>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border rounded-lg p-3 min-h-32"
                                placeholder="Describe what specific advice you're looking for..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || !selectedExpert || !selectedReport}
                                className={`flex items-center px-6 py-3 rounded-lg ${loading || !selectedExpert || !selectedReport ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            >
                                {loading ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        <Send size={18} className="mr-2" />
                                        <span>Send Request</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Request History */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-lg shadow-md">
                    {requests.length > 0 ? (
                        <div className="divide-y">
                            {requests.map((request) => (
                                <div key={request._id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-medium text-lg">{request.report.title}</h3>
                                            <p className="text-gray-600">
                                                Expert: {request.expert.name} ({request.expert.specialty})
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Requested: {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm ${
                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                            <div className="flex items-center">
                                                {request.status === 'pending' ? (
                                                    <Clock size={14} className="mr-1" />
                                                ) : (
                                                    <CheckCircle size={14} className="mr-1" />
                                                )}
                                                <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {request.status === 'completed' && request.response && (
                                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Expert Response:</h4>
                                            <p className="text-gray-800">{request.response}</p>
                                        </div>
                                    )}

                                    {request.status === 'pending' && (
                                        <div className="mt-4 flex items-center text-gray-500 text-sm">
                                            <Clock size={14} className="mr-1" />
                                            <span>Waiting for expert response</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <AlertCircle size={40} className="mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-700">No Requests Yet</h3>
                            <p className="text-gray-500 mt-2">You haven't sent any requests to experts yet.</p>
                            <button
                                onClick={() => setActiveTab('new')}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Create Your First Request
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpertsPage;
import { useState, useEffect } from "react";
import axios from "axios";
import { Send, ChevronDown, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ExpertsPage = () => {
    const [experts, setExperts] = useState([]);
    const [reports, setReports] = useState([]);
    const [requests, setRequests] = useState([]);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ visible: false, success: false, message: "" });
    const [activeTab, setActiveTab] = useState("new");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [expertsRes, reportsRes, requestsRes] = await Promise.all([
                    axios.get("https://agriback-mj37.onrender.com/experts"),
                    axios.get("https://agriback-mj37.onrender.com/reports/user"),
                    axios.get("https://agriback-mj37.onrender.com/expert-requests")
                ]);
                setExperts(expertsRes.data);
                setReports(reportsRes.data);
                setRequests(requestsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setFeedback({ visible: true, success: false, message: "Failed to load data." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExpert || !selectedReport) {
            setFeedback({ visible: true, success: false, message: "Select both expert and report." });
            return;
        }
        try {
            setLoading(true);
            await axios.post("https://agriback-mj37.onrender.com/expert-requests", {
                expertId: selectedExpert._id,
                reportId: selectedReport._id,
                message
            });
            setFeedback({ visible: true, success: true, message: "Request sent successfully!" });
            setSelectedExpert(null);
            setSelectedReport(null);
            setMessage("");
            const requestsRes = await axios.get("https://agriback-mj37.onrender.com/expert-requests");
            setRequests(requestsRes.data);
            setActiveTab("history");
        } catch (error) {
            console.error("Error submitting request:", error);
            setFeedback({ visible: true, success: false, message: "Failed to send request." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Expert Advice</h1>
            <div className="flex border-b mb-6">
                <button className={`py-2 px-4 ${activeTab === 'new' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`} onClick={() => setActiveTab('new')}>New Request</button>
                <button className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`} onClick={() => setActiveTab('history')}>Request History</button>
            </div>
            {activeTab === 'new' && (
                <div className="bg-white shadow-md p-6 rounded-lg">
                    {feedback.visible && <div className={`p-4 mb-6 rounded-md ${feedback.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {experts.map(expert => (
                                <div key={expert._id} className={`border rounded-lg p-4 cursor-pointer ${selectedExpert?._id === expert._id ? 'border-green-500 bg-green-50' : ''}`} onClick={() => setSelectedExpert(expert)}>
                                    <h3 className="font-medium">{expert.name}</h3>
                                    <p className="text-sm text-gray-600">{expert.specialty}</p>
                                </div>
                            ))}
                        </div>
                        <div className="relative mt-4">
                            <div className="border rounded-lg p-4 flex justify-between items-center cursor-pointer" onClick={() => setSelectedReport(selectedReport ? null : reports[0])}>
                                <span>{selectedReport ? selectedReport.title : "Select a report..."}</span>
                                <ChevronDown size={20} className="text-gray-500" />
                            </div>
                            <div className="absolute bg-white border rounded-lg shadow-md mt-2 w-full max-h-40 overflow-y-auto">
                                {reports.map(report => (
                                    <div key={report._id} className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedReport(report)}>
                                        {report.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <textarea className="w-full border rounded-lg p-3 mt-4 min-h-32" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe what specific advice you're looking for..." />
                        <button type="submit" disabled={loading || !selectedExpert || !selectedReport} className={`mt-4 px-6 py-3 rounded-lg ${loading || !selectedExpert || !selectedReport ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                            {loading ? "Sending..." : <><Send size={18} className="mr-2" /> Send Request</>}
                        </button>
                    </form>
                </div>
            )}
            {activeTab === 'history' && (
                <div className="bg-white shadow-md p-6 rounded-lg">
                    {requests.length > 0 ? requests.map(request => (
                        <div key={request._id} className="p-4 border-b">
                            <h3 className="font-medium">{request.report.title}</h3>
                            <p className="text-gray-600">Expert: {request.expert.name}</p>
                            <p className={`mt-2 px-3 py-1 rounded-full text-sm ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{request.status}</p>
                        </div>
                    )) : <p className="text-gray-500">No requests yet.</p>}
                </div>
            )}
        </div>
    );
};
export default ExpertsPage;

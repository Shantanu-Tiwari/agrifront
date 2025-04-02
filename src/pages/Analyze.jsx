import { useState } from "react";

const Analyze = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Preview the image
        }
    };

    const handleUpload = async () => {
        if (!image) {
            setMessage("Please select an image.");
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("image", image);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://agriback-mj37.onrender.com/api/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to upload image.");
            }

            setMessage("Image uploaded successfully! Your report is being processed.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-blue-50 min-h-screen p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Analyze Image</h1>

            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-lg mx-auto">
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

                {preview && (
                    <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-md mb-4" />
                )}

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                    {uploading ? "Uploading..." : "Submit for Analysis"}
                </button>

                {message && <p className="mt-4 text-gray-700">{message}</p>}
            </div>
        </div>
    );
};

export default Analyze;

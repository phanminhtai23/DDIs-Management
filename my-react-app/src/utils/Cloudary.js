import React, { useState } from "react";

const UploadImage = () => {
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_upload_preset"); // Thay bằng upload preset của bạn

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            setImageUrl(data.secure_url);
            console.log("Uploaded Image URL:", data.secure_url);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <input
                type="file"
                onChange={handleUpload}
                className="border p-2 rounded-md"
            />
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-48 rounded-md shadow-md"
                />
            )}
        </div>
    );
};

export default UploadImage;

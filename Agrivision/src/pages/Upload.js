import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Upload() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [image, setImage] = useState(null);
  const [resolutionValid, setResolutionValid] = useState(false);
  const [name, setName] = useState("");

  // ✅ Check Image Resolution
  const checkImageResolution = (file) => {
    const img = new Image();
    img.onload = function () {
      const width = img.width;
      const height = img.height;

      console.log("Image Resolution:", width, "x", height);

      if (width >= 400 && height >= 400) {
        setResolutionValid(true);
        alert(`✅ Image resolution OK (${width} x ${height})`);
      } else {
        setResolutionValid(false);
        alert(
          `❌ Low image resolution (${width} x ${height}). Please upload an image ≥ 1200 x 1200.`
        );
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    checkImageResolution(file);
  };

  const handleUpload = async () => {
  if (!token) return navigate("/login");
  if (!resolutionValid) return alert("Image does not meet resolution requirement.");

  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);

  try {
    await axios.post("http://127.0.0.1:8000/api/images/upload/", formData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✅ Image uploaded successfully!");
    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Upload failed. Check backend console.");
  }
};



  return (
    <div className="container">
      <h2>Upload Crop Image</h2>

      <input
        type="text"
        placeholder="Crop Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button
        onClick={handleUpload}
        disabled={!resolutionValid}
        style={{ marginTop: "10px" }}
      >
        Upload
      </button>
    </div>
  );
}

export default Upload;

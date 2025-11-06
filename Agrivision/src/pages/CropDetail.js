import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CropDetail.css";

function CropDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/images/crop/${name}/`);
        setImages(res.data);
      } catch (error) {
        setImages([]);
      }
    };
    fetchGallery();
  }, [name]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/images/crops/${id}/delete/`);
      alert("Image deleted successfully");
      // Refresh images after deletion
      const res = await axios.get(`http://127.0.0.1:8000/api/images/crop/${name}/`);
      setImages(res.data);
      setModalImage(null);
    } catch (error) {
      alert("Failed to delete image");
    }
  };

  return (
    <div className="crop-details">
      <button
        className="modal-close-btn"
        style={{ position: "absolute", right: "35px", top: "35px", fontSize: "2.1em" }}
        onClick={() => navigate("/dashboard")}
      >
        ✕
      </button>
      <div className="crop-details-header" style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "22px" }}>
        <img
          src={`${process.env.PUBLIC_URL}/crop-thumbnails/${name.toLowerCase()}.jpg`}
          className="crop-thumb-large"
          alt={name}
        />
        <h1 className="crop-title">{name.charAt(0).toUpperCase() + name.slice(1)}</h1>
      </div>

      <div className="crop-gallery">
        {images.length === 0 ? (
          <div className="no-data">No images found for {name}.</div>
        ) : (
          <div className="crop-grid">
            {images.map((img) => (
              <div
                key={img.id}
                className="crop-img-card"
                onClick={() => setModalImage(img)}
              >
                <img src={img.image_url} alt={img.name} className="crop-img-thumb" />
              </div>
            ))}
          </div>
        )}
      </div>

      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={modalImage.image_url} alt="Large" className="modal-large-img" />
            <div className="modal-meta">
              <span>
                Uploaded by: <b>{modalImage.uploaded_by ? modalImage.uploaded_by : "Unknown"}</b>
              </span>
              <span>
                Date: {modalImage.created_at ? new Date(modalImage.created_at).toLocaleDateString() : ""}
              </span>
              <a href={modalImage.image_url} download target="_blank" rel="noopener noreferrer">
                <button className="modal-download-btn">Download</button>
              </a>
              {(role === "Admin" || role === "Staff") && (
                <button
                  className="modal-delete-btn"
                  onClick={() => handleDelete(modalImage.id)}
                >
                  Delete
                </button>
              )}
            </div>
            <button className="modal-close-btn" onClick={() => setModalImage(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropDetails;

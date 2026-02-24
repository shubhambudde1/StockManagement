// src/components/NewsCard.jsx
import React from "react";

const NewsCard = ({ article }) => {
   
  if (!article) return null;

  const { title, summary, url, image_url, pub_date, source, topics } = article;

  // Format date nicely
  const formattedDate = pub_date ? new Date(pub_date).toLocaleString() : "";

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block ">
    <div className="border rounded-lg shadow-md p-2  w-full flex">
        <div>
         {image_url && (
        <img src={image_url} alt={title} className="w-full h-20 object-cover rounded-md mb-3" />
      )}
        </div>
     <div className="ml-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-2">{summary}</p>
    
      </div>

    </div>
    </a>
  );
};

export default NewsCard;


import React, { createContext, useContext, useEffect, useState } from "react";


const StoryContext = createContext();

export const useStory = () => useContext(StoryContext);

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);

  // get the stories from the backend 
  
    const fetchStories = async () => {
      try {
        const response = await fetch("https://donex-uq5f.onrender.com/stories");
        const data = await response.json();
        setStories(data["All stories"] || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

  useEffect(() => {
    fetchStories();
  }, []);


  // get the stories from the backend by id
    const fetchStoryById = async (id) => {
      try {
        const response = await fetch(`https://donex-uq5f.onrender.com/stories/${id}`);
        const data = await response.json();
        return data; // Return the fetched story

      } catch (error) {
        console.error("Error fetching story", error);
        return null;
      }
    };


  // Create a new story
  const createStory = async (storyData, token) => {
    try {
      const response = await fetch("https://donex-uq5f.onrender.com/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
      });

      const data = await response.json();
      if (response.ok) {
        setStories((prev) => [...prev, { id: data.id, ...storyData }]);
      }
      return data;
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  // Update an existing story
  const updateStory = async (id, updateData, token) => {
    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/stories/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (response.ok) {
        setStories((prev) =>
          prev.map((story) => (story.id === id ? { ...story, ...updateData } : story))
        );
      }
      return data;
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  // Delete a story
  const deleteStory = async (id, token) => {
    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/stories/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStories((prev) => prev.filter((story) => story.id !== id));
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  useEffect(() => {
    fetchStories()
  }, []); 

  return (
    <StoryContext.Provider
      value={{
        stories,
        createStory,
        fetchStories,
        fetchStoryById,
        updateStory,
        deleteStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from "react";

const StoryContext = createContext();

export const useStoryContext = () => useContext(StoryContext);

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);

  // get the stories from the backend 
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5001/stories");
        const data = await response.json();
        setStories(data["All stories"] || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  // Create a new story
  const createStory = async (storyData, token) => {
    try {
      const response = await fetch("http://127.0.0.1:5001/stories", {
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
      const response = await fetch(`http://127.0.0.1:5001/stories/update/${id}`, {
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
      const response = await fetch(`http://127.0.0.1:5001/story/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStories((prev) => prev.filter((story) => story.id !== id));
      }
      return data;
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        createStory,
        updateStory,
        deleteStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

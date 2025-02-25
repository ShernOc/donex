import React, { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/admin");
        const data = await response.json();
        setAdmins(data.Admins);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdmins();
  }, []);

  const registerAdmin = async (adminData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins((prev) => [...prev, data]);
      }
      return data;
    } catch (error) {
      console.error("Error registering admin:", error);
    }
  };

  const updateAdmin = async (id, updateData) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins((prev) => prev.map((admin) => (admin.id === id ? { ...admin, ...updateData } : admin)));
      }
      return data;
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      }
      return data;
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        maintenanceMode,
        newRegistrations,
        admins,
        registerAdmin,
        updateAdmin,
        deleteAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

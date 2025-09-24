import React, { createContext, useContext, useState } from "react";

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <ContactContext.Provider value={{ selectedContact, setSelectedContact }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = () => useContext(ContactContext);

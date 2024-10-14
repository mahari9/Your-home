import { createContext, useContext, useState } from "react";

const profileContext = createContext();

export default function ProfileContext({ children }) {
  {
    /**Totally unnecessary context - this is remote state - I have a custom hook - delete and switch to React Query. */
  }
  const [activeProfile, setActiveProfile] = useState(null);
  return (
    <profileContext.Provider value={{ activeProfile, setActiveProfile }}>
      {children}
    </profileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(profileContext);
  if (!context) throw new Error("You can't use context HERE!");
  return context;
}

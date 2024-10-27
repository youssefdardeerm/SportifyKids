import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

export let DataContext = createContext();

export default function DataContextFunction({ children }) {


  return (
    <DataContext.Provider
      value={{
    
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

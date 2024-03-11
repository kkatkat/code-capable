import React, { useState, createContext } from "react";
import { User } from "./entities/user";

export const UserContext = createContext<{ loggedUser: User | null, setLoggedUser: React.Dispatch<React.SetStateAction<User | null>> }>({ loggedUser: null, setLoggedUser: () => { } });

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
            {children}
        </UserContext.Provider>
    )
}
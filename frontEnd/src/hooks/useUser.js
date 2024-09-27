import { useState } from 'react';

function useUser() {
    const [user, setUserState] = useState(() => {
        const savedUser = localStorage.getItem("userLogin");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const setUser = (newUser) => {
        if(newUser === null) setUserState(null);
        else setUserState(newUser);
        if (newUser) {
            localStorage.setItem("userLogin", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("userLogin");
        }
    };
    return [user, setUser];
}

export default useUser;
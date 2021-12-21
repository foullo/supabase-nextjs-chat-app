import React from 'react';

const Navbar = ({ currentUser, session, supabase }) => {
if (!currentUser) return null
    return (
            <div className="flex justify-between items-center py-4">
                <h1>Supabase Chat </h1>
                
                <div className="flex space-between">
                    <a
                        href=""
                        className="bg-gray-700
                        text-white py-2 px-4 mr-2"
                    >
                        Bienvenue, { currentUser.username ? currentUser.username : session.user.email }
                    </a>
                    <a
                        href=""
                        className="bg-blue-500 hover:bg-blue-600
                        text-white py-2 px-4 ml-2"
                    >
                        Deconnexion
                    </a>
                </div>
                
            </div>
        )

}

export default Navbar



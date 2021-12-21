import Head from 'next/head'
import Navbar from "../components/Navbar";

import {useEffect, useState} from "react";
import Auth from "../components/Auth";
import Chat from '../components/Chat';

export default function Home({ currentUser, session, supabase }) {
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        setLoggedIn(!!session)
    }, [session])
    return (
        <div className="container w-full">
            <Head>
                <title>NextJS And Supabase Chat App</title>
            </Head>

            <main className="container flex flex-col justify-center items-center">
                {loggedIn ? <Chat currentUser={currentUser} session={session} supabase={supabase} /> : <Auth supabase={supabase} />}
            </main>

        </div>
    )
}

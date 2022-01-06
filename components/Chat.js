import React, { useEffect, useState, useRef } from "react";




const Chat = ({ currentUser, session, supabase }) => {
    if (!currentUser) return null

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [messages, setMessages] = useState([])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const message = useRef("")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [editingUsername, setEditingUsername] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const newUsername = useRef("")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [users, setUsers] = useState({})

    // eslint-disable-next-line react-hooks/exhaustive-deps,react-hooks/rules-of-hooks
    useEffect(async () => {

        const getMessages = async () => {
            let { data: messages, error } = await supabase
                .from('message')
                .select('*')

            setMessages(messages)
        }

        await getMessages()

        const setupMessagesSubscription = async () => {
            await supabase
                .from('message')
                .on('INSERT', payload => {
                    setMessages(previous => [].concat(previous, payload.new))
                })
                .subscribe()
        }

        await setupMessagesSubscription()

        const setupUsersSubscription = async () => {
            await supabase
                .from('user')
                .on('UPDATE', payload => {
                    setUsers(users => {
                        const user = users[payload.new.id]
                        if (user) {
                            // Update user
                            return Object.assign({}, users, {
                                [payload.new.id]: payload.new
                            })
                        } else {
                            return users
                        }
                    })
                })
                .subscribe
        }

        await setupUsersSubscription()

    }, [])

    const sendMessage = async evt => {
        evt.preventDefault()

        const content = message.current.value
        await supabase
            .from('message')
            .insert([
                { content, user_id: session.user.id}
            ])

        message.current.value = ""
    }

    const logout = evt => {
        evt.preventDefault()
        window.localStorage.clear()
        window.location.reload()
        //supabase.auth.signOut()
    }

    const setUsername = async evt => {
        evt.preventDefault()
        const username = newUsername.current.value
        await supabase
            .from('user')
            .insert([
                { ...currentUser, username }
            ], { upsert: true })
        newUsername.current.value = ""
        setEditingUsername(false)
    }

    const getUsersFromSupabase = async (users, userIds) => {
        const usersToGet = Array.from(userIds).filter(userId => !users[userId])
        if (Object.keys(users).length && usersToGet.length == 0) return users

        const { data } = await supabase
            .from('user')
            .select('id,username')
            .in('id', usersToGet)

        const newUsers = {}
        data.forEach(user => newUsers[user.id] = user)
        return Object.assign({}, users, newUsers)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(async () => {
        const getUsers = async () => {
            const userIds = new Set(messages.map(message => message.user_id))
            const newUsers = await getUsersFromSupabase(users, userIds)
            setUsers(newUsers)
        }

        await getUsers()
    }, [messages])

    const username = user_id => {
        const user = users[user_id]
        if (!user) return ""
        return user.username ? user.username : user_id
    }

    return (
    <>
        <div className="flex justify-between bg-red-300 items-center py-2 px-10 fixed top-0 left-0 right-0">
            <div className="sm:w-full"><h1 className="font-bold uppercase">Supabase Chat </h1></div>

            <div className="flex">
                <div>
                    <button
                        className="text-sm bg-gray-700
                        text-white py-2 px-2 mr-2 hover:text-gray-900 hover:bg-teal-200"
                    >
                        Bienvenue, { currentUser.username ? currentUser.username : session.user.email }
                    </button>

                </div>

                <div className="justify-evenly">
                    {editingUsername ? (
                        <form className="flex justify-between" onSubmit={setUsername}>
                            <input className="border-solid border-2 border-light-blue-500 " placeholder="Nouveau nom" required ref={newUsername}/>
                            <button className="text-sm bg-blue-500
                        text-white py-2 px-4 mr-2 hover:text-gray-900 hover:bg-teal-200" type="submit">Changer Votre Nom</button>

                        </form>
                    ) : (
                        <div className="flex justify-between">
                            <button
                                className="text-sm bg-gray-700
                        text-white py-2 px-4 mr-2 hover:text-gray-900 hover:bg-teal-200"
                                onClick={() => setEditingUsername(true)}>Modifier Votre Nom
                            </button>

                            <button
                                className="text-sm bg-blue-500
                        text-white py-2 px-4 mr-2 hover:text-gray-900 hover:bg-red-500"
                                onClick={evt => logout(evt)}>D&eacute;connexion
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>


    <div className="bg-white flex flex-col justify-center items-center my-10 mx-auto py-20">
        <h1 className="lg:text-xl md:text-md sm:text-sm font-black mb-14">Chat App Supabase avec NextJS</h1>

        {/*<p>Bienvenue, { currentUser.username ? currentUser.username : session.user.email }</p>*/}

        <div className="my-6">
            {messages.map(message =>
                <div key={message.id} className="border border-indigo-500 my-2 px-4">
                    <div className="flex justify-end">
                        <span className="bg-black p-1 mt-2 text-white border-solid border-2 border-light-blue-500">{username(message.user_id)}</span>
                    </div>
                    <div>{message.content}</div>
                </div>
            )}
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={sendMessage}>
                <input placeholder="Votre message ici" required ref={message}/>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Envoi Message
                    </button>
                </div>

            </form>
        </div>
    </div>
        </>
    )
}

export default Chat

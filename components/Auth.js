const Auth = ({ supabase }) => {
    const signInWithGithub = () => {
        supabase.auth.signIn({
            provider: 'github'
        })
    }
    return <div className="container flex justify-center justify-items-center">
        <button className="bg-blue-500 text-white p-4 rounded-md mt-10" onClick={signInWithGithub}>Connexion Avec Github</button>
    </div>
}

export default Auth

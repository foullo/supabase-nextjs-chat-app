const Auth = ({ supabase }) => {
    const signInWithGithub = () => {
        supabase.auth.signIn({
            provider: 'github'
        })
    }
    return <div>
        <button onClick={signInWithGithub}>Log in with Github</button>
    </div>
}

export default Auth

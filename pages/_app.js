import '../styles/index.css'
import useSupabase from "../utils/useSupabase";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  const { currentUser, session, supabase } = useSupabase()
  return(
      <div className="container w-screen mx-auto ">
        <Component currentUser={currentUser} session={session} supabase={supabase} {...pageProps} />
      </div>
  )
}

export default MyApp

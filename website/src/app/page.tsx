import { ConnectedLoginOrCreate } from '../components/LoginForm'
import { ConnectedPlayButton } from '../components/PlayButton'

export default function Home(): React.ReactNode {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1>Solarpunk Drifters</h1>

      <article>A post-postapocalyptic cooperative game</article>

      <ConnectedLoginOrCreate />
      <ConnectedPlayButton />
      <a href='/about'>About</a>
    </main>
  )
}

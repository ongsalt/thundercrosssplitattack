import { useRouter } from "next/router"


function Error() {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    // window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
    // setRickrolled(true)
    router.push('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  }
  return (
    <div> you fucked up the server</div>
  )
}


export default Error
import { isAuthinicated } from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashBoard')({
  component: RouteComponent,
  beforeLoad : async ()=>{
    const user = await isAuthinicated();
    if(!user){
      throw redirect({
        to:"/login",
        
      })
    }
  }
})

function RouteComponent() {
  return <div>Hello "/dashBoard"!</div>
}

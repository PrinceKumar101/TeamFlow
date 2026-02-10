import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

const clickme = ()=> alert("Hey there");

function RouteComponent() {
  return (
    <>
    <div>
      <Button onClick={clickme}>Click me</Button>
    </div>
    
    </>
  )
}

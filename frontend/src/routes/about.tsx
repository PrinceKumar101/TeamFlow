import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/hooks/redux'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})


function RouteComponent() {
  const todo = useAppSelector(state => state.todo)
  return (
    <>
    <div>
      {todo.map((item)=>{
        return (
          <div key={item.id}>
            <h1>{item.id}</h1>
            <p>{item.task}</p>
            <p>{item.completed}</p>
          </div>
        )
      })}
    </div>
    <div>
      <Input placeholder='Enter todo name'/>
      <Button>Add Todo</Button>
    </div>
    
    </>
  )
}

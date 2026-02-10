import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { decrement, incrementByNumber, asyncIncrementOfCount  } from '../store/slices/counter';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/counter')({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.counter.value);
  return <>
  <div className='flex gap-5'>
    <h1>Counter: <span>{count}</span></h1>
    <Button  onClick={()=> dispatch(asyncIncrementOfCount(10))}>Increment</Button>
    <Button variant={'ghost'} onClick={()=> dispatch(decrement())}>Decrement</Button>
    <Button variant={"outline"} onClick={()=> dispatch(incrementByNumber(10))}>Increment by number</Button>
  </div>
    
  </>
}

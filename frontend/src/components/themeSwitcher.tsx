import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button } from "./ui/button";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Moon, Sun } from "lucide-react";

const ThemSwitcherButton = () => {
    const dispatch = useAppDispatch();
    const darkMode = useAppSelector(state => state.theme.value);
  return (
    <>
      <Button className="size-7"
        onClick={() => {
          dispatch(toggleTheme());
        }}
      >
        {darkMode ? <Sun size={5}/> : <Moon size={5}/>}
      </Button>
    </>
  );
};
export default ThemSwitcherButton

const fetchThemeData = ():boolean=>{
    const darkMode = localStorage.getItem("dark");
    if(!darkMode) return false;
    return true;
}

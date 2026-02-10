import express from "express"

const router = express.Router();

router.get("/", (req, res)=>{
    res.send("Hello there from users route.");
})
router.post("/login", )



export {router as userRoutes};


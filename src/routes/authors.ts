import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { authors } from "../models/authors";
import { books } from "../models/books";

const router = Router()

router.get("/", (req: Request, res: Response) => {
    res.status(200).json(authors)
})

router.get("/:id", [param("id").isInt().withMessage("The ID must be an integer")], (req: Request, res: Response) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {id} = req.params;
    const author = authors.find( (author) => author.id === parseInt(id))

    if(!author){
        return res.status(404).send('Author not found')
    }

    res.status(200).json(author);
    }
)

router.post("/", [
    body("name").notEmpty().withMessage("Name is required"),
    body("surname").notEmpty().withMessage("Surname is required")
],
(req:Request , res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {name,surname} = req.body
    const newAuthor = {id: authors.length + 1 , name, surname}

    authors.push(newAuthor)

    res.status(201).json(newAuthor);
}
)

router.put("/:id", (req:Request , res: Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const indexId = authors.findIndex(author => author.id === parseInt(req.params.id));

    if(indexId === -1){
        return res.status(404).json({error : "Author ID not found"});
    }

    const updatedAuthor = {...authors[indexId]}

    if (req.body.name) updatedAuthor.name = req.body.name;
    if (req.body.surname) updatedAuthor.surname = req.body.surname;

    authors[indexId] = updatedAuthor;
    res.status(200).json(authors[indexId]);
})

router.delete("/:id", (req:Request , res: Response)=> {

    const indexId = authors.findIndex( author => author.id === parseInt(req.params.id));

    if(indexId === -1){
        
        return res.status(404).json({error : "Author ID not found"});
    }

    const removed = authors.splice(indexId, 1)[0];
    res.status(200).json({ message: "Author deleted", author: removed });
})

router.get("/:id/books",
    [param("id").isInt().withMessage("Author ID must be an integer")],
    (req:Request, res:Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                const err : any = new Error("Validation failed");
                err.status = 400;
                err.details = errors.array();
                throw err;
            }

            const authorId = parseInt(req.params.id);
            const authorExists = authors.find((author) => author.id === authorId)

            if(!authorExists){
                const err: any = new Error("Author not found");
                err.status = 404;
                throw err;
            }

            const authorBooks = books.filter((book) => book.authorId === authorId);
            res.status(200).json(authorBooks)
        } catch (error) {
            next(error)
        }
    })

export default router
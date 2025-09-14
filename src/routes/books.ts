import { Router, Request, Response, NextFunction } from "express";
import { body,param, validationResult } from "express-validator";
import { books } from "../models/books";
import { authors } from "../models/authors";

const router = Router();

router.get("/", (req:Request, res:Response) => {

        let results = [... books]

        if(req.query.title){
            const title = String(req.query.title).toLowerCase();
            results = results.filter((book) => book.title.toLowerCase().includes(title))
        }

        if(req.query.year){
            const year = parseInt(String(req.query.year))
            results = results.filter((book) => book.year === year)
        }

        if (req.query.sortBy) {
            const sortBy = String(req.query.sortBy);

            results.sort((a: any, b: any) => {
                if (a[sortBy] > b[sortBy]) return 1;
                if (a[sortBy] < b[sortBy]) return -1;
                return 0;
            });
        }
            res.status(200).json(results);
    
})

router.get("/:id",
    [param("id").isInt().withMessage("ID must be an integer")], 
    (req:Request, res:Response) => {
  
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()})
    }

    const book = books.find(book => book.id === parseInt(req.params.id))
    if(!book){
        return res.status(404).json({error : "Book not found"})
    }
    res.status(200).json(book)
})

router.post("/",[
    body("title").notEmpty().withMessage("Title is required"),
    body("year").notEmpty().withMessage("The year is required"),
    body("authorId")
    .notEmpty()
    .withMessage("authorId is required")
    .isInt()
    .withMessage("authorId must be a number")
], (req:Request, res:Response, next: NextFunction) => {
    
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const err: any = new Error("Validation failed");
            err.status = 400;
            err.details = errors.array();
            throw err;
        }
        const { title, year, authorId } = req.body;

        const authorExists = authors.find(author => author.id === parseInt(authorId));
        if (!authorExists){                       
            const err: any = new Error("Invalid authorId: author not found");
            err.status = 400;
            throw err;
        }

        const duplicateBooks = books.find((book) => book.title === title && book.authorId === parseInt(authorId));
        if(duplicateBooks){
            const err : any = new Error ("Duplicate book: this author already has a book with that title");
            err.status = 409;
            throw err;
        }

        const newBook = {id: books.length + 1 ,title, year,authorId: parseInt(authorId)}
        books.push(newBook);
        res.status(201).json(newBook)
            
    } catch (error) {
        next(error)
    }
    
})

router.put(
  "/:id",
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("authorId").optional().isInt().withMessage("authorId must be a number"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    } 
    const index = books.findIndex(book => book.id === parseInt(req.params.id));

    if (index === -1){
        return res.status(404).json({ error: "Book not found" });
    } 

    const updatedBook = { ...books[index] };

    if (req.body.title){
        updatedBook.title = req.body.title;
    } 
    if (req.body.year){
        updatedBook.year = req.body.year;
    } 
    if (req.body.authorId) {
      const authorExists = authors.find(author => author.id === parseInt(req.body.authorId));
      if (!authorExists) {
        return res.status(400).json({ error: "Invalid authorId: author not found" });
      }
      updatedBook.authorId = parseInt(req.body.authorId);
    }

    books[index] = updatedBook;
    res.status(200).json(updatedBook);
  }
);

router.delete("/:id",
  (req: Request, res: Response) => {

  const index = books.findIndex(book => book.id === parseInt(req.params.id));
  if (index === -1){
    return res.status(404).json({ error: "Book not found" });
  } 

  const removed = books.splice(index, 1)[0];
  res.status(200).json({ message: "Book deleted", book: removed });
});

export default router;
import { Router, Request, Response } from "express";
import { body,param, validationResult } from "express-validator";
import { books } from "../models/books";
import { authors } from "../models/authors";

const router = Router();

router.get("/", (req:Request, res:Response) => {
    res.status(200).json(books);
})

router.get("/:id",[param("id").isInt().withMessage("ID must be an integer")], (req:Request, res:Response) => {
  
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
], (req:Request, res:Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, year, authorId } = req.body;

    const authorExists = authors.find(author => author.id === parseInt(authorId));
    if (!authorExists){

        return res.status(400).json({ error: "Invalid authorId: author not found" });
    } 
    
    const newBook = {
        id: books.length + 1 ,
        title, 
        year,
        authorId: parseInt(authorId)
    }
    books.push(newBook);
    res.status(201).json(newBook)
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
export interface Book {
    id: number,
    title: string,
    year: number,
    authorId: number
}

export const books : Book[] = [
    {id:1, title: "Her brown eyes, my answer found" , year: 2024, authorId:1},
    {id:2, title: "Mysterious Mermaid", year: 1972, authorId: 2}
]
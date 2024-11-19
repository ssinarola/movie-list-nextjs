import { z } from "zod";

export const LOGIN = z.object({
    email: z.string({ required_error: "Email address is required" }).min(1, "Email address is required").email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
})

export const UPDATE_MOVIE = z.object({
    title: z.string({ required_error: 'Title is required' }).min(1, "Title is required"),
    releasedYear: z.string({ required_error: 'Released year is required' }).refine((val) => /^\d{4}$/.test(val.toString()), {
        message: "Year must be a number with 4 digits",
    }),
})
export const CREATE_NEW_MOVIE = UPDATE_MOVIE.extend({
    image: z.any().refine(file => file, "Image is required")
})
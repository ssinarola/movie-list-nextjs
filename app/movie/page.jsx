"use client";
import { useRouter } from "next/navigation";
import { ApiHelper } from "../../helpers/ApiHelper";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { CREATE_NEW_MOVIE, UPDATE_MOVIE } from "../../helpers/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../Components/ErrorMessage";
import FileUploadIcon from "../../assets/icons/FileUploadIcon";

const AddMovie = ({ params }) => {
    const isEditMode = params.movieId ? true : false;
    const movieId = params.movieId;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const schema = isEditMode ? UPDATE_MOVIE : CREATE_NEW_MOVIE;
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
        setValue,
    } = useForm({ resolver: zodResolver(schema) });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getMovie = async (movieId) => {
            if (isEditMode) {
                try {
                    const response = await ApiHelper.getMovieById(movieId);
                    reset({ ...response });
                } catch (error) {
                    console.error("Failed to fetch movie details:", error);
                }
            }
        };
        getMovie(movieId);
    }, [movieId, isEditMode]);

    const submitHandler = async (values) => {
        const imageUrl = watch("image")
            ? await uploadImage(watch("image"))
            : watch("imageUrl");

        const payload = {
            title: values.title,
            releasedYear: values.releasedYear,
            imageUrl: imageUrl,
        };

        setIsLoading(true);
        try {
            if (isEditMode) {
                const res = await ApiHelper.updateMovie(movieId, payload);
                toast.success(res?.message);
                setIsLoading(false);
            } else {
                const res = await ApiHelper.addMovie(payload);
                toast.success(res?.message);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error?.response?.data);
        } finally {
            router.push("/");
        }
    };

    const uploadImage = async (img) => {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "mystore");
        data.append("cloud_name", "mambpc");
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/v1_1/mambpc/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            );
            const imageUrl = await response.json();
            return imageUrl.url;
        } catch (error) {
            console.error("Failed to upload image:", error);
            toast.error("Failed to upload image");
        }
    };

    const imageChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file);
        }
    };

    const imagePreviewClickHandler = () => {
        fileInputRef.current.click();
    };

    const imagePreview =
        watch("image") || watch("imageUrl") ? (
            <img
                key={watch("image") ? watch("image").name : watch("imageUrl")}
                className="rounded-lg"
                src={
                    watch("image")
                        ? URL.createObjectURL(watch("image"))
                        : watch("imageUrl")
                }
                alt="Thumb"
                style={{ width: "100%", height: "473px", objectFit: "contain" }}
            />
        ) : (
            <div
                className="flex flex-col items-center justify-center pt-5 pb-6 gap-2"
                style={{ width: "100%", height: "473px" }}
            >
                {errors?.image ? (
                    <ErrorMessage
                        error={errors?.image}
                        message={errors?.image?.message}
                    />
                ) : (
                    <>
                        <FileUploadIcon />
                        <p className="mb-2 text-sm text-white dark:text-gray-400">
                            Drop an image here
                        </p>
                    </>
                )}
            </div>
        );

    return (
        <div
            className="sm:w-full p-5 md:p-5 lg:p-8 xl:p-12"
            style={{ minHeight: "calc(100vh - 92px)" }}
        >
            <p className="text-h3 leading-h3 lg:text-h2 lg:leading-h2 sm:text-h3 sm:leading-h3 md:text-h3 md:leading-h3 text-white mb-10">
                {isEditMode ? "Edit" : "Create a new movie"}
            </p>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="flex flex-col sm:flex-row gap-6 xl:gap-28">
                    <div
                        onClick={imagePreviewClickHandler}
                        className={`flex flex-col items-center justify-center border border-white border-dashed rounded-lg mb-2 bg-input cursor-pointer md:w-full basis-1/2 p-3 ${errors?.image && "!bg-white !border-error"}`}
                    >
                        {imagePreview}
                    </div>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field: { onChange, onBlur } }) => (
                            <input
                                ref={fileInputRef}
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    onChange(e);
                                    imageChange(e);
                                }}
                                onBlur={onBlur}
                                disabled={isLoading}
                            />
                        )}
                    />

                    <div className="flex flex-col gap-6 md:w-2/5 w-full ">
                        <div className="flex flex-col gap-6">
                            <div>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            placeholder="Title"
                                            className={`input ${errors?.title && "!bg-white !border-error"}`}
                                        />
                                    )}
                                />
                                <ErrorMessage
                                    error={errors?.title}
                                    message={errors?.title?.message}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="releasedYear"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <input
                                            type="number"
                                            name="releasedYear"
                                            id="releasedYear"
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            placeholder="Publishing year"
                                            className={`input sm:w-2/3 ${errors?.releasedYear && "!bg-white !border-error"}`}
                                        />
                                    )}
                                />
                                <ErrorMessage
                                    error={errors?.releasedYear}
                                    message={errors?.releasedYear?.message}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="w-full text-white bg-background border border-white text-body-md rounded-lg leading-body-md px-5 py-2.5 text-center "
                                onClick={() => router.push("/")}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full text-white bg-primary border border-white text-body-md rounded-lg leading-body-md px-5 py-2.5 text-center"
                            >
                                {isLoading ? "Loading..." : isEditMode ? "Update" : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddMovie;

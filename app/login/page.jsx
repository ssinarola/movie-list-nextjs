"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ApiHelper } from "../../helpers/ApiHelper";
import ErrorMessage from "../../Components/ErrorMessage";
import { LOGIN } from "../../helpers/validationSchema";

const Login = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({ resolver: zodResolver(LOGIN) });

    const [isApiCalling, setIsApiCalling] = useState(false);
    const router = useRouter();

    const submitHandler = async (values) => {
        try {
            setIsApiCalling(true);
            const res = await ApiHelper.login(values);
            if (res) {
                toast.success(res?.message);
                setIsApiCalling(false);
                router.push("/");
            } else {
                toast.error(res?.error);
            }
        } catch (error) {
            setIsApiCalling(false);
        }
    };

    return (
        <section style={{ minHeight: "calc(100vh - 25px)" }}>
            <div className="flex flex-col lg:max-w-md md:max-w-md sm:max-w-sm max-w-xs justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="md:text-h1 text-white text-center md:leading-h1 mb-8 font-semibold text-h2 leading-h2">
                    Sign in
                </h1>
                <form
                    className="space-y-4 md:space-y-6"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    type="text"
                                    className={`input ${errors?.email && "!bg-white !border-error"}`}
                                />
                            )}
                        />
                        <ErrorMessage error={errors?.email} message={errors?.email?.message} />
                    </div>
                    <div>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    className={`input ${errors?.password && "!bg-white !border-error"}`}
                                />
                            )}
                        />
                        <ErrorMessage error={errors?.password} message={errors?.password?.message} />
                    </div>
                    {/* <div className="flex items-center justify-center">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                aria-describedby="remember"
                                type="checkbox"
                                className="rounded bg-input "
                                required=""
                            />
                        </div>
                        <label
                            htmlFor="remember"
                            className="ml-2 leading-h5 text-body-sm text-white"
                        >
                            Remember me
                        </label>
                    </div> */}
                    <button
                        type="submit"
                        className="w-full text-white bg-primary text-body-md rounded-lg leading-body-md px-5 py-2.5 text-center font-bold"
                        disabled={isApiCalling}
                    >
                        {isApiCalling ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;

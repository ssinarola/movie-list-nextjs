
import { NextResponse } from 'next/server';

const AUTH_PATH = new Set(["/login"]);

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value

    if (AUTH_PATH.has(pathname) && !!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!AUTH_PATH.has(pathname) && pathname.startsWith("/") && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/', '/login', '/movie/:path*', '/api/addMovie/:path*'],
}
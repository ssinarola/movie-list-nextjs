import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MovieCard = ({ movie, index }) => {
    return (
        <div key={movie._id} className="p-2 bg-card rounded-xl flex flex-col justify-between hover:bg-gray-light cursor-pointer">
            <Link href={`/movie/${movie._id}`} className="flex justify-center" style={{ flex: '1 1 auto' }} >
                <Image
                    className='rounded-xl'
                    style={{ width: '100%', height: '400px' }}
                    width={266}
                    height={400}
                    src={movie?.imageUrl ?? 'fallback-image-url'}
                    alt={`Card img cap${index}`}
                />
            </Link>
            <div className="m-4 flex flex-col gap-2 justify-center">
                <span className="text-body-lg leading-h4 text-white">{movie.title}</span>
                <p className="text-body-sm leading-h5 text-white">{movie.releasedYear}</p>
            </div>
        </div>
    )
}

export default MovieCard
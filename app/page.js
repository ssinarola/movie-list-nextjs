'use client'
import { ApiHelper } from "../helpers/ApiHelper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from '../Components/Loader'
import MovieCard from '../Components/MovieCard'
import Pagination from '../Components/Pagination'
import NoMovie from '../Components/NoMovie'
import LogoutIcon from '../assets/icons/LogoutIcon'
import AddIcon from '../assets/icons/AddIcon'
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter()

  const [moviesData, setMoviesData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 8;

  const totalPages = Math.ceil(moviesData?.totalMovies / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const getMoviesData = async () => {
      setIsLoading(true);
      try {
        const res = await ApiHelper.getMovies(currentPage, pageSize);
        setMoviesData(res);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getMoviesData();
  }, [currentPage]);

  const logoutHandler = async () => {
    try {
      const res = await ApiHelper.logout()
      if (res) {
        toast.success(res)
        router.push('/login');
      }
    } catch (error) {
      console.log('error', error)
    }

  }

  const addMovieHandler = () => {
    router.push('/movie')
  }

  return (
    <main className="min-h-screen items-center justify-between py-20 px-6 md:p-24">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="md:p-6">
          {moviesData?.movies?.length > 0 ?
            <div>
              <div className="flex justify-between">
                <div className="flex items-center justify-center py-2 md:py-0 gap-3">
                  <span className="xl:text-h2 lg:text-h2 lg:leading-h2 md:text-h3 md:leading-h3 sm:text-h3 sm:leading-h3 xs:text-h3 xs:leading-h3 text-white">
                    My Movies
                  </span>
                  <button onClick={() => router.push('/movie')}>
                    <AddIcon className="w-6 h-6 xl:w-8 xl:h-8" />
                  </button>
                </div>
                <div className="flex">
                  <button className=" flex items-center gap-3 cursor-pointer" onClick={logoutHandler}>
                    <span className={`text-white hidden sm:inline md:inline`}>Logout</span>
                    <LogoutIcon className="w-6 h-6 xl:w-8 xl:h-8" />
                  </button>
                </div>
              </div>
              <div className="flex justify-center py-3 md:py-14">
                <div className="md:py-16 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-6">
                  {moviesData?.movies?.map((movie, index) => (
                    <MovieCard movie={movie} index={index} key={movie._id} />
                  ))}
                </div>
              </div >
              {totalPages > 1 && (
                <div className="mt-5">
                  <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
              )}
            </div > :
            <NoMovie addMovieHandler={addMovieHandler} />
          }
        </div>
      )}
    </main >
  )
}

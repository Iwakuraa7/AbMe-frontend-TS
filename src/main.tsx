import { createRoot } from 'react-dom/client';
import HomePage from '../pages/HomePage.tsx';
import UserPage from '../pages/UserPage.tsx';
import SearchAnimePage from '../pages/SearchAnimePage.tsx';
import SearchBookpage from '../pages/SearchBookPage.tsx';
import SearchMangaPage from '../pages/SearchMangaPage.tsx';
import SearchMoviePage from '../pages/SearchMoviePage.tsx';
import SearchMusicPage from '../pages/SearchMusicPage.tsx';
import SignInPage from '../pages/SignInPage.tsx';
import SignUpPage from '../pages/SignUpPage.tsx';
import MainPage from '../pages/MainPage.tsx';
import './index.css';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
  },
  {
    path: '/home',
    element: <MainPage/>
  },
  {
    path: 'myprofile',
    element: <UserPage/>
  },
  {
    path: 'user/:username',
    element: <UserPage/>
  },
  {
    path: 'search/anime',
    element: <SearchAnimePage/>
  },
  {
    path: 'search/book',
    element: <SearchBookpage/>
  },
  {
    path: 'search/manga',
    element: <SearchMangaPage/>
  },
  {
    path: 'search/movie',
    element: <SearchMoviePage/>
  },
  {
    path: 'search/music',
    element: <SearchMusicPage/>
  },
  {
    path: 'signin',
    element: <SignInPage/>
  },
  {
    path: 'signup',
    element: <SignUpPage/>
  },
])

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <RouterProvider router={router}/>
  </UserProvider>  
)

import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import FullLayout from '../layouts/FullLayout/FullLayout';
import HomePage from '../pages/HomePage/HomePage';
import PostPage from '../pages/PostPage/PostPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';

export const routes = [
    {
        path: '/',
        page: HomePage,
        layout: FullLayout,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        layout: DefaultLayout,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        layout: DefaultLayout,
    },
    {
        path: '/user/:id',
        page: ProfilePage,
        layout: FullLayout,
    },
    {
        path: '/post',
        page: PostPage,
        layout: FullLayout,
    },
];

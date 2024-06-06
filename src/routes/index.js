import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import HomePage from '../pages/HomePage/HomePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';

export const routes = [
    {
        path: '/',
        page: HomePage,
        layout: DefaultLayout,
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
];

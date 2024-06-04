import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import HomePage from '../pages/HomePage/HomePage';
import SignInPage from '../pages/SignInPage/SignInPage';

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
];

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from './routes';
import * as role from './constants/index';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import CustomFragment from './components/CustomFragment/CustomFragment';
import { useEffect, useState } from 'react';
import * as userService from './services/userService';
import { updateUser } from './redux/slice/userSlice';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import Loading from './components/Loading/Loading';

function App() {
    const [loading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const handleGetDetailUser = async (id, access_token) => {
        const res = await userService.getUser(id, access_token);
        dispatch(updateUser({ ...res?.data, access_token }));
    };

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let userData = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            userData = jwtDecode(storageData);
        }
        return { userData, storageData };
    };

    useEffect(() => {
        setIsLoading(true);
        let { storageData, userData } = handleDecoded();

        if (userData?.id) {
            handleGetDetailUser(userData?.id, storageData);
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Loading isLoading={loading}>
                <Router>
                    <Routes>
                        {routes.map((route, index) => {
                            const Page = route.page;
                            let Layout = DefaultLayout;
                            const isPrivate = route?.isPrivate;
                            const isAuth = user?.role === role.ROLE_USER;

                            if (route.layout) {
                                Layout = route.layout;
                            }

                            if (route.layout === null) {
                                Layout = CustomFragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={isPrivate ? (isAuth ? route?.path : '/') : route?.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </Loading>
        </div>
    );
}

export default App;

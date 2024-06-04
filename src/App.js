import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';
import { routes } from './routes';
import * as role from './constants/index';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import CustomFragment from './components/CustomFragment/CustomFragment';

function App() {
    const user = useSelector((state) => state.user);

    return (
        <div>
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
        </div>
    );
}

export default App;

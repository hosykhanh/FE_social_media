import { Menu } from 'antd';
import { useState } from 'react';
import { getItem } from '../../utils';
import { AppstoreOutlined, UserOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './AdminPage.module.scss';
import TableUser from '../../components/TableUser/TableUser';
import { useQuery } from 'react-query';
// import TableRequest from '../../components/TableRequest/TableRequest';
// import TableReport from '../../components/TableReport/TableReport';

const cx = classNames.bind(styles);

function AdminPage() {
    const [keySelected, setKeySelected] = useState('user');
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        // getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        // getItem('Yêu cầu', 'request', <QuestionCircleOutlined />),
        // getItem('Báo cáo', 'report', <ExclamationCircleOutlined />),
    ];
    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    // // --- API GET ALL PRODUCT ---
    // const getAllProduct = async () => {
    //     const res = await productService.getAllProduct({ limit: 100 });
    //     return res;
    // };

    // const {
    //     isLoading: isLoadingProduct,
    //     data: dataProduct,
    //     refetch: refetchProduct,
    // } = useQuery(['products'], getAllProduct, {
    //     enabled: keySelected === 'product',
    // });

    // // --- API GET ALL REQUEST ---
    // const getAllRequest = async () => {
    //     const res = await contactService.getAllRequest();
    //     return res;
    // };

    // const {
    //     isLoading: isLoadingRequest,
    //     data: dataRequest,
    //     refetch: refetchRequest,
    // } = useQuery(['requests'], getAllRequest, {
    //     enabled: keySelected === 'request',
    // });

    // // --- API GET ALL REPORT ---
    // const getAllReport = async () => {
    //     const res = await contactService.getAllReport();
    //     return res;
    // };

    // const {
    //     isLoading: isLoadingReport,
    //     data: dataReport,
    //     refetch: refetchReport,
    // } = useQuery(['reports'], getAllReport, {
    //     enabled: keySelected === 'report',
    // });

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <TableUser />;
            // case 'product':
            //     return <TableProduct isLoading={isLoadingProduct} data={dataProduct} refetch={refetchProduct} />;
            // case 'request':
            //     return <TableRequest isLoading={isLoadingRequest} data={dataRequest} refetch={refetchRequest} />;
            // case 'report':
            //     return <TableReport isLoading={isLoadingReport} data={dataReport} refetch={refetchReport} />;
            default:
                return <></>;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Menu
                defaultSelectedKeys={keySelected}
                mode="inline"
                onClick={handleOnClick}
                style={{ width: 256, height: '100%', marginTop: '10px' }}
                items={items}
            />
            <div className={cx('wrapper-content')}>{renderPage(keySelected)}</div>
        </div>
    );
}

export default AdminPage;

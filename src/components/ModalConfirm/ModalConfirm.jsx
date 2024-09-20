import { Modal } from 'antd';
import Button from '../Button/Button';
import classNames from 'classnames/bind';
import styles from './ModalConfirm.module.scss';
import { useEffect } from 'react';
import * as message from '../Message/Message';
import Loading from '../Loading/Loading';
import checkStatusResponse from '../../utils/checkStatusResponse';

const cx = classNames.bind(styles);

function ModalConfirm({ title, isOpen = false, setIsOpen, rowSelected, refetch, mutation }) {
    const { isLoading, isSuccess, data, isError } = mutation;

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            setIsOpen(false);
            message.success('Xóa thành công');
            if (refetch) {
                refetch();
            }
        } else if (isError) {
            message.error('Xóa thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, data]);

    const handleDelete = () => {
        if (rowSelected) {
            console.log(rowSelected);
            mutation.mutate(rowSelected);
        }
    };

    return (
        <Loading isLoading={isLoading}>
            <Modal forceRender open={isOpen} onCancel={() => setIsOpen(false)} footer={null}>
                <div className={cx('wrapper')}>
                    <h2 className={cx('title')}>{title}</h2>
                    <div>
                        <Button danger large onClick={handleDelete}>
                            Xóa
                        </Button>
                        <Button large outline onClick={() => setIsOpen(false)}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </Modal>
        </Loading>
    );
}

export default ModalConfirm;

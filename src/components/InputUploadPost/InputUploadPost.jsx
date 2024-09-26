import { CloseOutlined, FileImageOutlined, LoadingOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './InputUploadPost.module.scss';

const cx = classNames.bind(styles);

function InputUploadPost({ onChange, name }) {
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            const url = URL.createObjectURL(info.file.originFileObj);
            setImageUrl(url);
            onChange(info.file.originFileObj);
        }
    };

    const uploadButton = (
        <div className={cx('button-uploader')}>
            {loading ? <LoadingOutlined /> : <FileImageOutlined style={{ fontSize: 30, color: '#999' }} />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Thêm ảnh
            </div>
        </div>
    );

    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            await onChange(file); // Call the function that handles API call
            onSuccess();
        } catch (error) {
            onError(error);
            message.error('Tải lên thất bại!');
        }
    };

    const handleRemove = () => {
        // Thêm logic để xử lý việc xóa ảnh
        setImageUrl('');
        message.info('Đã xóa ảnh/video');
    };

    return (
        <div className={cx('frame-uploader')}>
            <CloseOutlined
                onClick={handleRemove}
                style={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer', fontSize: 18 }}
            />
            <div className={cx('container-uploader')}>
                <Upload
                    name="image"
                    showUploadList={false}
                    maxCount={1}
                    customRequest={customRequest}
                    onChange={handleChange}
                    className={cx('content-uploader')}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{ width: 'auto', maxHeight: '300px', maxWidth: '100%' }}
                            name={name || ''}
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </div>
        </div>
    );
}

export default InputUploadPost;

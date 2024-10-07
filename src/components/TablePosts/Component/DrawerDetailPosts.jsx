import DrawerComp from '../../DrawerComp/DrawerComp';
import Loading from '../../Loading/Loading';
import { useEffect, useState } from 'react';
import * as postsService from '../../../services/postsService';
import PostFrame from '../../PostFrame/PostFrame';

function DrawerDetailPosts({ isOpenDrawer, setIsOpenDrawer, rowSelected, refetch }) {
    const [dataPosts, setDataPosts] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getPosts = async () => {
            setIsLoading(true);
            const data = await postsService.getPosts(rowSelected);
            setDataPosts(data);
            setIsLoading(false);
        };
        if (rowSelected) {
            getPosts();
        }
    }, [rowSelected]);

    return (
        <DrawerComp title="Thông tin chi tiết bài viết" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
            <Loading isLoading={isLoading}>
                {dataPosts ? (
                    <PostFrame
                        _id={dataPosts?._id}
                        image={dataPosts?.image}
                        description={dataPosts?.description}
                        favorites={dataPosts?.favorites}
                        author={dataPosts?.user}
                        createdAt={dataPosts?.createdAt}
                        updatedAt={dataPosts?.updatedAt}
                    />
                ) : (
                    <></>
                )}
            </Loading>
        </DrawerComp>
    );
}

export default DrawerDetailPosts;

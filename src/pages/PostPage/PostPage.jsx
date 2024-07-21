import React from 'react';
import SliderComponent from '../../components/Slider/Slider';
import { slide } from '../../assets';

const PostPage = () => {
    return (
        <div>
            <SliderComponent alt="slider" width="20%" images={slide} />
        </div>
    );
};

export default PostPage;

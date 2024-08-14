import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    image: '',
    description: '',
    favorites: '',
    id: '',
};

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        updatePosts: (state, action) => {
            const { image = '', description = '', favorites = '', _id = '' } = action.payload;
            state.image = image;
            state.description = description;
            state.favorites = favorites;
            state.id = _id;
        },
    },
});

export const { updatePosts } = postsSlice.actions;

export default postsSlice.reducer;

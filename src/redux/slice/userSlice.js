import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Male',
    access_token: '',
    id: '',
    dateOfBirth: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {
                name = '',
                email = '',
                phone = '',
                address = '',
                access_token = '',
                _id = '',
                gender = 'Male',
                dateOfBirth = '',
            } = action.payload;
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.id = _id;
            state.gender = gender;
            state.access_token = access_token;
            state.dateOfBirth = dateOfBirth;
        },

        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.access_token = '';
            state.phone = '';
            state.address = '';
            state.gender = 'Male';
            state.id = '';
            state.dateOfBirth = '';
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;

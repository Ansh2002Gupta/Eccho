import { createSlice } from "@reduxjs/toolkit";

const ChatListSlice = createSlice({
    name: 'ChatListContext',
    initialState: {
        engagedContacts: [],
        isRefetchContacts: false,
    },
    reducers: {
        setList: (state, action) => {
            state.engagedContacts = action.payload.contactList;
        },
        emptyList: (state) => {
            state.engagedContacts = [];
        },
        removeList: (state, action) => {
            state.engagedContacts.filter(contact => contact.id !== action.payload.idToDelete);
        },
        updateList: (state, action) => {
            state.engagedContacts.push(action.payload.contactObject);
        },
        setRefetchContacts: (state, action) => {
            state.isRefetchContacts = action.payload.isRefetchContacts;
        },
    }
});

export const { setList, emptyList, removeList, updateList, setRefetchContacts } = ChatListSlice.actions;

export default ChatListSlice.reducer;

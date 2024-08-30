const express = require('express');
const asyncHandler = require("express-async-handler");
const UserContacts = require('../Schemas/UserContacts');

const newContactController = asyncHandler(async (req, res) => {
    const {name, email=undefined, phoneNumber} = req.body;

    if(!name){
        res.status(422).json({error: "Server: I think you forgot to enter contact name."});
    }

    if(!phoneNumber){
        res.status(422).json({error: "Server: I think you forgot to enter contact phone number."});
    }

    const existingContact = await UserContacts.findOne({PhoneNumber: phoneNumber});

    if(existingContact){
        return res.status(409).json({error: "Server: This contact already exists!"});
    }

    const newContact = await UserContacts.create({
        Name: name,
        Email: !!email ? email : null,
        PhoneNumber: phoneNumber,
    });

    if(newContact){
        return res.status(201).json({
            message: "Server: Contact saved successfully!",
            _id: newContact._id,
            name: newContact.Name,
            email: newContact.Email,
            phoneNumber: newContact.PhoneNumber,
        });
    }
    else{
        return res.status(500).json({internalError: 'Internal Error | Sorry! failed to add this contact.'});
    }
});

const getContactList = asyncHandler(async (req, res) => {
    try {
        const contacts = await UserContacts.find();
        return res.status(200).json({message: 'Successfully fetched contact list!', contacts: contacts});
    }
    catch(error){
        return res.status(500).json({internalError: 'Internal Error | Failed to fetch contact list.'});
    }
});



module.exports = { newContactController, getContactList };

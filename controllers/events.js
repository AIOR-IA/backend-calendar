const express = require('express');
const Event = require('../models/Event');


const getEvents = async(req, res = express.response, next) => {

    const events = await Event.find()
                              .populate('user', 'name');

    return res.json({
        ok: true,
        events
    })
}

const createEvent = async(req, res = express.response, next) => {

    const event = new Event(req.body);

    try {

        event.user = req.uid;
        const eventSave = await event.save();

        res.json({
            ok: true,
            event: eventSave
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Call the admin'
        })
    }
}


const updateEvent = async(req, res = express.response, next) => {

    const eventID = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventID);

        if(!event) {
            return res.status(404).json({
                ok: false,
                msg:'Event does`nt exist by id'
            })
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Privilegies incorrects'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        //el tercer argumento es para que retorne el nuevo valor pero actualizado
        const eventUpdated = await Event.findByIdAndUpdate(eventID, newEvent, {new: true});

        res.json({
            ok:true,
            event: eventUpdated
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Call the admin'
        })
    }
    
}

const deleteEvent = async(req, res = express.response, next) => {
    const eventID = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventID);

        if(!event) {
            return res.status(404).json({
                ok: false,
                msg:'Event does`nt exist by id'
            })
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Privilegies incorrects'
            })
        }

      

        //el tercer argumento es para que retorne el nuevo valor pero actualizado
        await Event.findByIdAndDelete(eventID);

        res.json({
            ok:true,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Call the admin'
        })
    }
}
module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}
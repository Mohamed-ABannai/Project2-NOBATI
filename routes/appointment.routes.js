const router = require("express").Router()
const Appointment = require("../models/Appointment")
const { isPatient } = require("../middleware/is-signed-in")

router.get('/', isPatient, async (req, res) => {

    const appointments = await Appointment.find({
        patient: req.session.user._id
    }).populate('doctor')

    res.render('appointments/allAppointments.ejs', { appointments:appointments })
})

module.exports = router;

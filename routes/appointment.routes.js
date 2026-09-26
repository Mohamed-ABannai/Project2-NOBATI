const router = require("express").Router()

router.get('/', isPatient, async (req, res) => {

    const appointments = await Appointment.find({
        patient: req.session.user._id
    }).populate('doctor')

    res.render('appointments/allAppointments.ejs', { appointments })
})

module.exports = router;

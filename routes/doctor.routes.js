const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { isSignedIn, isDoctor, isAdmin } = require("../middleware/is-signed-in");
const router = require("express").Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/', isDoctor, async (req, res) => {

    res.render('doctors/homepage.ejs')
})

router.get('/new', isAdmin, async (req, res) => {

    const departments = await Department.find()

    res.render('doctors/createDoctor.ejs', {
        departments: departments
    })
})

router.post('/new', isAdmin, upload.single("image"), async (req, res) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: "doctor",
        phone: req.body.phone
    })

    const addDoctor = await Doctor.create({
        user: newUser._id,
        specialization: req.body.specialization,
        department: req.body.department,
        consultationFee: req.body.consultationFee,
        bio: req.body.bio,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    })

    res.redirect('/doctor/allDoctors')
})

router.get('/allDoctors', isSignedIn, async (req, res) => {

    const foundDoctors = await Doctor.find({
        isActive: true
    })
        .populate('user')
        .populate('department')

    res.render('doctors/allDoctors.ejs', {
        doctors: foundDoctors
    })
})

router.get('/edit', isDoctor, async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })
        .populate('user')
        .populate('department')

    res.render('doctors/updateProfile.ejs', {
        doctor: doctor
    })
})

router.put('/profile', isDoctor, upload.single('image'), async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })

    const userUpdate = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
    }

    const doctorUpdate = {
        specialization: req.body.specialization,
        consultationFee: req.body.consultationFee,
        bio: req.body.bio
    }

    if (req.file) {
        doctorUpdate.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    }

    const foundUser = await User.findByIdAndUpdate(
        req.session.user._id,
        userUpdate
    )

    const foundDoctor = await Doctor.findByIdAndUpdate(
        doctor._id,
        doctorUpdate
    )

    req.session.user.username = req.body.username

    res.redirect('/doctor/edit')
})

router.get('/appointments', isDoctor, async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })

    const appointments = await Appointment.find({
        doctor: doctor._id
    })
        .populate('patient')

    res.render('doctors/appointments.ejs', {
        appointments: appointments
    })
})

router.put('/appointments/:id/confirm', isDoctor, async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })

    const foundAppointment = await Appointment.findOneAndUpdate(
        {
            _id: req.params.id,
            doctor: doctor._id,
            status: 'pending'
        },
        {
            status: 'confirmed'
        }
    )

    res.redirect('/doctor/appointments')
})

router.put('/appointments/:id/cancel', isDoctor, async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })

    const foundAppointment = await Appointment.findOneAndUpdate(
        {
            _id: req.params.id,
            doctor: doctor._id
        },
        {
            status: 'cancelled'
        }
    )

    res.redirect('/doctor/appointments')
})

router.put('/appointments/:id/complete', isDoctor, async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })

    const foundAppointment = await Appointment.findOneAndUpdate(
        {
            _id: req.params.id,
            doctor: doctor._id,
            status: 'confirmed'
        },
        {
            status: 'completed'
        }
    )

    res.redirect('/doctor/appointments')
})

router.get('/appointments/:id/redirect', isDoctor, async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.session.user._id
    })

    const appointment = await Appointment.findOne({
        _id: req.params.id,
        doctor: doctor._id,
        status: 'completed'
    })
        .populate('patient')

    const doctors = await Doctor.find({
        isActive: true
    })
        .populate('user')
        .populate('department')

    res.render('doctors/redirectAppointment.ejs', {
        appointment: appointment,
        doctors: doctors
    })
})

router.put('/appointments/:id/redirect',isDoctor,async(req,res)=>{

    const doctor = await Doctor.findOne({
        user:req.session.user._id
    })

    const appointmentUpdate = {
        doctor:req.body.doctor,
        appointmentDate:req.body.appointmentDate,
        appointmentTime:req.body.appointmentTime,
        status:'pending'
    }

    const foundAppointment = await Appointment.findOneAndUpdate(
        {
            _id:req.params.id,
            doctor:doctor._id,
            status:'completed'
        },
        appointmentUpdate
    )

    res.redirect('/doctor/appointments')
})

router.get('/:id/edit', isAdmin, async (req, res) => {

    const foundone = await Doctor.findById(req.params.id)
        .populate('user')
        .populate('department')

    const departments = await Department.find()

    res.render('doctors/updateDoctor.ejs', {
        doctor: foundone,
        departments: departments
    })
})

router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {

    const foundDoctor = await Doctor.findById(req.params.id)

    if (!foundDoctor) {
        return res.send('Doctor not found')
    }

    const {
        username,
        email,
        phone,
        specialization,
        department,
        consultationFee,
        bio
    } = req.body

    const userUpdate = {
        username,
        email,
        phone
    }

    const doctorUpdate = {
        specialization,
        department,
        consultationFee,
        bio
    }

    if (req.file) {
        doctorUpdate.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    }

    const foundUser = await User.findByIdAndUpdate(
        foundDoctor.user,
        userUpdate
    )

    const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        doctorUpdate
    )

    res.redirect('/doctor/allDoctors')
})

router.delete('/:id', isAdmin, async (req, res) => {

    const foundDoctor = await Doctor.findById(req.params.id)

    if (!foundDoctor) {
        return res.send('Doctor not found')
    }

    const doctorUpdate = {
        isActive: false
    }

    const userUpdate = {
        isActive: false
    }

    const deletedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        doctorUpdate
    )

    const deletedUser = await User.findByIdAndUpdate(
        foundDoctor.user,
        userUpdate
    )

    res.redirect('/doctor/allDoctors')
})

module.exports = router;

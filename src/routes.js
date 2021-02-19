var express = require('express'),
    routes = express.Router();
var userController = require('./controller/artisans-controller');
var customerController = require('./controller/customer-controller');
var orderController = require('./controller/orders-controller');
var reviewsController = require('./controller/reviews-controller');
const AuthCtrl = require('./controller/resetPassword-controller');

var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


routes.post('/upload', upload.array('img[]'), (req, res, next) => {
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});



routes.post('/register', userController.registerUser);
// User Controller
routes.post('/jobRestored', userController.jobRestored) //Restore Task 
routes.post('/rejectedJobOrders', userController.rejectedJobOrders); //Cancelling or Rejecting the jobOrders
routes.post('/allRejectedJobs', userController.rejectedJob) //AllRejectedJobs history Tracker
routes.post('/jobOrdersData', userController.addJobOrders);
routes.post('/allJobsAccepted', userController.allJobAccepted);
routes.post('/allCompletedJobs', userController.completedJob)
routes.post('/logout', userController.logoutUser)

routes.post('/login', userController.loginUser);
routes.post('/account', userController.getUser);
routes.post('/deletedCompletedTask', userController.deletedCompletedTask) //Deleted Task Or Store Task under Rejected  History Tracker
routes.get('/allActiveUsers', userController.returnAllActiveUsers)

// Customer Controller
routes.post('/checkRejected', orderController.checkRejected); //check rejected under Usertask MOdel compared to Bookings model
routes.get('/allCustomers', customerController.getAllCustomers);

// Order Controller
routes.post('/acceptedJobToCompleted', orderController.acceptedJobToCompleted)
routes.post('/getCustomersData', orderController.getCustomersData)
routes.post('/allLogsHistory', orderController.allLogsHistory)
routes.post('/stats', orderController.statistics)
routes.get('/deleteAllLogs', orderController.deleteAllLogs)
routes.get('/deleteAllTasks', orderController.taskDeletion)
routes.get('/deleteAllStats', orderController.deleteAllStats)
routes.get('/getNewOrder', orderController.getOrders);
routes.get('/getCustomersName', orderController.getCustomersName);

// Auth Controller For Password Reset
routes.post('/reqResetPassword', AuthCtrl.ResetPassword);
routes.post('/new-password', AuthCtrl.NewPassword);
routes.post('/valid-password-token', AuthCtrl.ValidPasswordToken);

// Reviews Controller
routes.get('/reviews', reviewsController.getReviews);

module.exports = routes;
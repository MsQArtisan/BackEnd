var express = require('express'),
    routes = express.Router();
var userController = require('./controller/artisans-controller');
var customerController = require('./controller/customer-controller');
var orderController = require('./controller/orders-controller');
var reviewsController = require('./controller/reviews-controller');
const AuthCtrl = require('./controller/resetPassword-controller');

// User Controller
routes.post('/jobRestored', userController.jobRestored) //Restore Task 
routes.post('/rejectedJobOrders', userController.rejectedJobOrders); //Cancelling or Rejecting the jobOrders
routes.post('/allRejectedJobs', userController.rejectedJob) //AllRejectedJobs history Tracker
routes.post('/jobOrdersData', userController.addJobOrders);
routes.post('/allJobsAccepted', userController.allJobAccepted);
routes.post('/allCompletedJobs', userController.completedJob)
routes.post('/logout', userController.logoutUser)
routes.post('/register', userController.registerUser);
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
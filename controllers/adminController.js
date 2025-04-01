// controllers/adminController.js

exports.showDashboard = async (req, res) => {
  try {
    // console.log("Rendering admin dashboard:", req.session.user);
    const userId = req.session.user.user_id;
    // console.log("User ID:", userId); // Debugging line
    
    res.render('admin/admin-dashboard', { title: 'Admin Dashboard', user: req.session.user });
  
  } catch (err) {
    console.error("Error in showDashboard controller:", err);
    return res.status(500).send("Internal Server Error"); 
  }
  
  };
  
  // exports.listStudents = (req, res) => {
  //   const students = []; // Replace with actual student data
  //   res.render('admin/students', { title: 'Manage Students', user: req.user, students });
  // };
  
  // exports.viewStudent = (req, res) => {
  //   const student = {}; // Replace with logic to fetch a student by ID
  //   res.render('admin/student-details', { title: 'Student Details', user: req.user, student });
  // };
  
  // exports.addStudent = (req, res) => {
  //   // Logic to add a new student
  //   res.redirect('/admin/students');
  // };
  
  // exports.updateStudent = (req, res) => {
  //   // Logic to update a student
  //   res.redirect('/admin/students');
  // };
  
  // exports.deleteStudent = (req, res) => {
  //   // Logic to delete a student
  //   res.redirect('/admin/students');
  // };
  
  // exports.listCourses = (req, res) => {
  //   const courses = []; // Replace with actual courses data
  //   res.render('admin/courses', { title: 'Manage Courses', user: req.user, courses });
  // };
  
  // exports.addCourse = (req, res) => {
  //   // Logic to add a new course
  //   res.redirect('/admin/courses');
  // };
  
  // exports.updateCourse = (req, res) => {
  //   // Logic to update a course
  //   res.redirect('/admin/courses');
  // };
  
  // exports.deleteCourse = (req, res) => {
  //   // Logic to delete a course
  //   res.redirect('/admin/courses');
  // };
  
  // exports.generateReports = (req, res) => {
  //   res.render('admin/reports', { title: 'Reports', user: req.user });
  // };
  
  // exports.showNotifications = (req, res) => {
  //   res.render('admin/notifications', { title: 'Manage Notifications', user: req.user });
  // };
  
  // exports.sendNotification = (req, res) => {
  //   // Logic to send notifications
  //   res.redirect('/admin/notifications');
  // };
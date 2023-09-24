const express = require("express");
const router = express();
const studentController = require("../controller/students.controller")

router.get("/",(request,response)=>{
    response.render("students");
});
// get students login data
router.get("/login/:query",(request,response)=>{
    studentController.getStudentId(request,response);
});

// get students data
router.get("/count-all",(request,response)=>{
    studentController.countStudents(request,response);
});

// get invitation
router.get("/invitation/:studentToken",(request,response)=>{
    studentController.invitation(request,response);
});

// get all students data
router.get("/all/:companyId",(request,response)=>{
    studentController.allStudents(request,response);
});

// get students pagenation
router.get("/:from/:to",(request,response)=>{
    studentController.paginate(request,response);
});
//post request

router.post("/",(request,response)=>{
    studentController.create(request,response);
});

//post request student image url and password
router.post("/:id",(request,response)=>{
    studentController.createUser(request,response);
});


// delete request
router.delete("/:id",(request,response)=>{
    studentController.deleteStudents(request,response);
});

// put request
router.put("/:id",(request,response)=>{
    studentController.updateStudents(request,response);
});

module.exports = router;
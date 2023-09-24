const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

// creat students
const create = async (request, response) => {
  const tokenData = tokenService.verify(request);
  if (tokenData.isVerified) {
    const data = request.body;
    data["companyId"] = tokenData.data.uid;
    try {
      const dataRes = await dbService.creatRecord(data, "studentSchema");
      response.status(200);
      response.json({
        message: "Record Created",
        data: dataRes,
      });
    } catch (error) {
      response.status(409);
      response.json({
        message: "Record Not Created",
        data: error,
      });
    }
  } else {
    response.status(401);
    response.json({
      message: "Permission Denied !",
    });
  }
};

// get students
const countStudents = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    const dataRes = await dbService.countData("studentSchema");
    response.status(200);
    response.json({
      data: dataRes,
    });
  } else {
    response.status(401);
    response.json({
      message: "Permission Denied !",
    });
  }
};

// paginate
const paginate = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    let from = Number(request.params.from);
    let to = Number(request.params.to);
    const query = {
      companyId: tokenData.data.uid,
    };
    const dataRes = await dbService.paginateData(
      query,
      from,
      to,
      "studentSchema"
    );
    response.status(200);
    response.json({
      data: dataRes,
    });
  } else {
    response.status(401);
    response.json({
      message: "Permission Denied !",
    });
  }
};

// get all students
const allStudents = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    const query = {
      companyId: request.params.companyId,
    };
    const dataRes = await dbService.getRecordByQuery(query, "studentSchema");
    response.status(200);
    response.json({
      data: dataRes,
    });
  } else {
    response.status(401);
    response.json({
      message: "Permission Denied !",
    });
  }
};

// delete students
const deleteStudents = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    const id = request.params.id;
    const deleteRes = await dbService.deleteById(id, "studentSchema");
    response.status(200);
    response.json({
      data: deleteRes,
    });
  } else {
    response.status(401);
    response.json({
      message: "Permission Denied !",
    });
  }
};

// update students
const updateStudents = async (request, response) => {
  const tokenData = await tokenService.verify(request);
  if (tokenData.isVerified) {
    const id = request.params.id;
    const data = request.body;
    const updateRes = await dbService.updateById(id, data, "studentSchema");
    response.status(200);
    response.json({
      data: updateRes,
    });
  } else {
    response.status(401);
    response.json({
      message: "Permission Denied !",
    });
  }
};

// invitation
const invitation = async (request, response) => {
  const token = request.params.studentToken;
  const tokenData = await tokenService.customTokenVerification(token);
  if (tokenData.isVerified) {
    const studentId = tokenData.data.studentId;
    const student = await getStudentInfo(studentId)
    console.log(student)
    if (!student.isUser) {
      response.render("invitation");

    } else {
      response.redirect("/");
    }
  } else {
    response.status(401);
    response.redirect("/");
  }
};


// getStudentInfo function
const getStudentInfo = async (studentId) => {
  const query = {
    _id: studentId
  }
  const dataRes = await dbService.getRecordByQuery(query, "studentSchema");
  return dataRes[0]
}
// user profile url and password post request
const createUser = async (request, response) => {
  const query = {
    _id: request.params.id
  }
  const updateMe = {
    updatedAt: Date.now(),
    isUser: true,
    isProfile: request.body.isProfile,
    studentProfile: request.body.studentProfile,
    status: true
  }
  await dbService.upDateByQuery(query, "studentSchema", updateMe)
  const userData = {
    uid: request.params.id,
    password: request.body.password,
    role: "student"
  }
  await dbService.creatRecord(userData, 'userSchema')
  response.status(200);
  response.json({
    message: request.body,
  });
}


// getStudentId function
const getStudentId = async (request, response) => {
  const token = await tokenService.verify(request);
  if (token.isVerified) {
    const query = {
      studentEmail: token.data.email
    }
    const companyRes = await dbService.getRecordByQuery(query, "studentSchema");

    if (companyRes.length > 0) {
      response.status(200);
      response.json({
        isCompanyExists: true,
        message: "Company Available",
        data: companyRes
      })

    } else {
      response.status(404);
      response.json({
        isCompanyExists: false,
        message: "Company Not Found !"
      })
    }

  } else {
    response.status(401)
    response.json({
      message: "Permission Denied !"
    })
  }
}

module.exports = {
  create: create,
  countStudents: countStudents,
  paginate: paginate,
  deleteStudents: deleteStudents,
  updateStudents: updateStudents,
  allStudents: allStudents,
  invitation: invitation,
  createUser: createUser,
  getStudentId : getStudentId
};

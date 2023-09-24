// get country phone code
$(document).ready(() => {
    $(".country").on("input", async function () {
        let keyword = $(this).val().trim().toLowerCase();
        const localData = checkInLs("countryCode");
        if (localData.isExsists) {
            const countries = localData.data;
            for (let country of countries) {
                if (country.name.toLowerCase().indexOf(keyword) != -1) {
                    const dial_code = country.dial_code;
                    $(".code").html(dial_code);
                }
            }
        } else {
            const request = {
                type: "GET",
                url: "../json/country-code.json"
            };
            const response = await ajax(request)  // ajex request
            localStorage.setItem("countryCode", JSON.stringify(response))
        }


    });
});

// add students
$(document).ready(() => {
    $("#student-form").submit(async function (e) {
        e.preventDefault();
        const token = getCookie("authToken");
        let formData = new FormData(this);
        formData.append("token", token);
        const request = {
            type: "POST",
            url: "/students",
            data: formData,
            isLoader: true,
            commonBtn: ".add-student-btn",
            loaderBtn: ".student-loader-btn"
        }
        try {
            const dataRes = await ajax(request);
            const student = dataRes.data;
            let tr = dynamicTr(student)
            $(".students-list").append(tr);
            // activating student action
            studentAction();
            $("#student-modal").modal("hide");

        } catch (error) {
            $(".student-email").addClass
                ("animate__animated animate__shakeX border border-danger");
            $(".student-email").click(function () {
                $(".student-email").removeClass
                    ("animate__animated animate__shakeX border border-danger");
                $(this).val('');
            })

        }
    })
});

// update student
const updateStudent = (oldTr) => {
    $(".update-student-btn").click(async function (e) {
        e.preventDefault()
        const form = document.querySelector("#student-form")
        const id = this.getAttribute("data-id");
        const token = getCookie("authToken");
        const formData = new FormData(form);
        formData.append("token", token);
        formData.append("updatedAt", new Date());
        const request = {
            type: "PUT",
            url: "/students/" + id,
            data: formData,
            isLoader: true,
            commonBtn: ".update-student-btn",
            loaderBtn: ".student-loader-btn",
        }
        try {
            const response = await ajax(request);
            $(".add-student-btn").removeClass("d-none")
            $(".update-student-btn").addClass("d-none")
            $("#student-modal").modal("hide");
            $(form).trigger("reset")
            const student = response.data;
            const tr = dynamicTr(student);
            const updatedTd = $(tr).html();
            $(oldTr).html(updatedTd);
            oldTr = "";
            studentAction();

        } catch (error) {
            alert("Not Updated")
        }

    })
}

// show student
$(document).ready(() => {
    let from = 0;
    let to = 5;
    showStudents(from, to);
    getPaginationList()
})

const showStudents = async (from, to) => {
    $(".students-list").html('');
    const request = {
        type: "GET",
        url: `students/${from}/${to}`,
        isLoader: true,
        commonBtn: ".tmp",
        loaderBtn: ".students-skeleton"
    }
    const response = await ajax(request);
    // response convert json stringify ,set section currentStudent
    // then access data click btn export
    let currentStudent = JSON.stringify(response.data)
    sessionStorage.setItem("current-student", currentStudent);
    if (response.data.length > 0) {
        for (let student of response.data) {
            let tr = dynamicTr(student);
            $(".students-list").append(tr);
        }

        // delete and update action 
        studentAction();
    } else {
        swal("There is no student", "Add Students", "warning");
    }
}

// dynamic tr code function
const dynamicTr = (student) => {
    const studentString = JSON.stringify(student);
    const studentData = studentString.replace(/"/g, "'");
    let tr = `
  <tr class="animate__animated animate__fadeIn animate__slower">
      <td class="text-nowrap">
          <div class = "d-flex align-items-center">
             ${student.isProfile ? `<img width="50" height="50" class="mx-3 rounded-circle" src="${student.studentProfile}">` :
            `<i class="fa fa-user-circle mx-3" style ="font-size:45px;"></i>`
            }
                  <div>
                      <p class="p-0 m-0 text-capitalize">${student.studentName}</p>
                      <small class="text-uppercase">${student.studentCountry}</small>
                  </div>
          </div>
      </td>
      <td class="text-nowrap">${student.studentEmail}</td>
      <td class="text-nowrap">${student.studentMobile}</td>
      <td class="text-nowrap">${student.studentFather}</td>
      <td class="text-nowrap">${student.studentDob}</td>
      <td class="text-nowrap">${student.studentCountry}</td>
      <td class="text-nowrap">${student.studentState}</td>
      <td class="text-nowrap">${student.studentPincode}</td>
      <td class="text-nowrap">${student.studentAddress}</td>
      <td class="text-nowrap">
          ${student.status ? `<span class="badge badge-success">Active</span>` :
        `<span class="badge badge-danger">Pending</span>`
        }
      </td>
      <td class="text-nowrap">${formatDate(student.createdAt)}</td>
      <td class="text-nowrap">
          <div class="d-flex">
              <button data-student="${studentData}" data-id="${student._id}" class=" edit-student icon-btn-primary">
                  <i class="fa fa-edit"></i>
              </button>
              <button data-id="${student._id}" class=" delete-student icon-btn-danger mx-2 ">
                  <i class="fa fa-trash"></i>
              </button>
              <button data-id="${student._id}" data-email="${student.studentEmail}" class=" share-student icon-btn-info">
                  <i class="fa fa-share"></i>
              </button>
          </div>
      </td>
  </tr>
  
  `;

    return tr;
}

//formateDate
const formatDate = (dateStr) => {
    let date = new Date(dateStr);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();
    dd < 10 ? dd = "0" + dd : dd = dd
    mm < 10 ? mm = "0" + mm : mm = mm
    return dd + "-" + mm + "-" + yy + " " + date.toLocaleTimeString();

}

//-------------------
const studentAction = () => {
    // delete student
    $(document).ready(() => {
        $(".delete-student").each(function () {
            $(this).click(async function () {
                const tr = this.parentElement.parentElement.parentElement;
                const id = $(this).data("id");
                const token = getCookie("authToken");
                const request = {
                    type: "DELETE",
                    url: "/students/" + id,
                    data: {
                        token: token
                    }
                }
                let isConform = await conform("DELETED");
                if (isConform) {
                    const response = await ajax(request);
                    tr.remove();
                }
            })
        })
    });

    // update student
    $(document).ready(() => {
        const allEditBtn = $(".edit-student")
        for (let btn of allEditBtn) {
            btn.onclick = function () {
                const id = $(this).data("id");
                const tr = this.parentElement.parentElement.parentElement;
                const studentString = $(this).data("student");
                const studentData = studentString.replace(/'/g, '"');
                const student = JSON.parse(studentData)
                for (let key in student) {
                    let value = student[key]
                    $(`[name=${key}]`).val(value)
                }
                $(".update-student-btn").attr("data-id", id)
                $(".add-student-btn").addClass("d-none")
                $(".update-student-btn").removeClass("d-none")
                $("#student-modal").modal("show");
                updateStudent(tr);
            }
        }
    })

    // open share model
    $(document).ready(function () {
        $(".share-student").each(function () {
            $(this).click(async function () {
                const studentId = $(this).data("id");
                const studentEmail = $(this).data("email");
                $("#share-email-btn").attr("data-email", studentEmail);
                const companyToken = getCookie("authToken")
                const tmp = decodeToken(companyToken)
                const company = tmp.data.companyInfo;
                const prepareDataForToken = JSON.stringify({
                    studentId : studentId,
                    companyName : company.company,
                    companyEmail : company.email,
                    companyLogo : company.logoUrl
                })
                const formData = new FormData();
                formData.append("token",getCookie("authToken"))
                formData.append("data",prepareDataForToken)
                const request = {
                    type : "POST",
                    url : "/get-token/172800",
                    data : formData
                }
                const response = await ajax(request);
                const token = response.token
                let link = `${window.location}/invitation/${token}`
                $(".link").val(link);
                $("#share-modal").modal("show");
            })
        })
    });

    //copy link
    $(document).ready(function () {
        $("#copy-btn").click(function () {
            $(".link").select();
            document.execCommand('copy');
            $("i", this).removeClass("fa fa-copy");
            $("i", this).addClass("fa fa-check");
            setTimeout(() => {
                $("i", this).removeClass("fa fa-check");
                $("i", this).addClass("fa fa-copy");

            }, 2000)
        })
    })


    // share on email
    $(document).ready(function () {
        $("#share-email-btn").click(async function () {
            const studentEmail = this.getAttribute("data-email");
            const token = getCookie("authToken");
            const tokenData = decodeToken(token);
            const company = tokenData.data.companyInfo;
            const reciept = {
                to: studentEmail,
                subject: "Admission invitation Link !",
                message: "Thank you bing the pare of our team. We are happy to serve our services for you.",
                companyName: company.company,
                companyEmail: company.email,
                companyMobile: company.mobile,
                companyLogo: company.logoUrl,
                invitationLink: $(".link").val()

            }
            const formData = new FormData();
            formData.append("token", token);
            formData.append("reciept", JSON.stringify(reciept));


            const request = {
                type: "POST",
                url: "/sendMail",
                data: formData,
                isLoader: true,
                commonBtn: ".tmp",
                loaderBtn: ".progress-loader"
            }
            try {
                const response = await ajax(request);
                $("#share-modal").modal("hide")
            } catch (error) {
                console.log(error)
            }
        })
    })
}

//--------------------------


//get pagination list
const getPaginationList = async () => {
    let i;
    const request = {
        type: "GET",
        url: "/students/count-all"
    }

    const response = await ajax(request);
    const totleStudent = response.data;
    let length = totleStudent / 5;
    let skipData = 0;
    if (length.toString().indexOf(".") != -1) {
        length = length + 1
    }
    for (i = 1; i <= length; i++) {
        let button = `
           <button data-skip=${skipData} class="border ${i == 1 ? "active" : ""} btn-design paginate-btn">
                     <i>${i}</i>
            </button>
           `;
        $("#student-pagination").append(button);
        skipData = skipData + 5
    }

    getPaginationData();
}
// get paginationdata
const getPaginationData = () => {
    $(".paginate-btn").each(function (index) {
        $(this).click(function () {
            controlPrevAndNext(index);
            removeClassess(".paginate-btn", "active")
            const skip = $(this).data("skip");
            $(this).addClass("active");
            showStudents(skip, 5)

        })
    })
}
// next btn coding from paginationdata
$(document).ready(function () {
    $("#next").click(function () {
        let crurentIndex = 0;
        $(".paginate-btn").each(function () {
            if ($(this).hasClass("active")) {
                crurentIndex = $($(this)).index()
            }
        });
        $(".paginate-btn").eq(crurentIndex + 1).click();
        controlPrevAndNext(crurentIndex + 1);
    })
});

// prev btn coding
$(document).ready(function () {
    $("#prev").click(function () {
        let crurentIndex = 0;
        $(".paginate-btn").each(function () {
            if ($(this).hasClass("active")) {
                crurentIndex = $($(this)).index()
            }
        });
        $(".paginate-btn").eq(crurentIndex - 1).click();
        controlPrevAndNext(crurentIndex + -1);
    })
});

// control Prev And Next coding
const controlPrevAndNext = (crurentIndex) => {
    const totalBtn = $(".paginate-btn").length - 1;
    if (crurentIndex === totalBtn) {
        $("#next").attr("disabled", true);
        $("#prev").attr("disabled", false)
    } else if (crurentIndex > 0) {
        $("#prev").attr("disabled", false);
        $("#next").attr("disabled", false);
    } else {
        $("#next").attr("disabled", false)
        $("#prev").attr("disabled", true)
    }
}


// filter by name email number
$(document).ready(function () {
    $(".filter").on("input", function () {
        let keyword = $(this).val().trim().toLowerCase();
        let tr = $(".students-list tr");
        $(tr).each(function () {
            let allTd = this.querySelectorAll("TD");
            let name = allTd[0].querySelector("p").innerHTML;
            let email = allTd[1].innerHTML;
            let mobile = allTd[2].innerHTML;
            if (name.toLowerCase().indexOf(keyword) != -1) {
                $(this).removeClass("d-none");
            } else if (email.toLowerCase().indexOf(keyword) != -1) {
                $(this).removeClass("d-none");
            } else if (mobile.indexOf(keyword) != -1) {
                $(this).removeClass("d-none");
            } else {
                $(this).addClass("d-none");
            }
        })


    })
})


// export data into pdf
$(document).ready(() => {
    $("#current").click(async function (e) {
        e.preventDefault()
        let currentStudent = sessionStorage.getItem("current-student");
        if (currentStudent != null) {
            const token = getCookie("authToken")
            let formData = new FormData();
            formData.append("data", currentStudent)
            formData.append("token", token)
            const request = {
                type: "POST",
                url: "/export-to-pdf",
                data: formData
            }
            try {
                let response = await ajax(request);
                const downloadRequest = {
                    type: "GET",
                    url: "/exports/"+response.filename
                }
                const pdfFile = await ajaxDownloader(downloadRequest)
                const pdfUrl = URL.createObjectURL(pdfFile)
                let a = document.createElement("A");
                a.href = pdfUrl; // kis adress pe jana hey downlode kerney k leye ?
                a.download = response.filename; // Kis name se download kerna hey
                a.click(); // khud he download ho ga
                a.remove(); // ancker tag remove 
                deletePdf(response.filename) // delete pdf after download
            } catch (error) {
                console.log(error)
            }
        } else {
            swal("Students not found", "Add student !", "warning")
        }

    })
})

// export all data into pdf
$(document).ready(()=>{
    $("#all").click(async function(e){
        e.preventDefault()
        const token = getCookie("authToken")
        const company = decodeToken(token)
        const companyId = company.data.companyInfo._id;
        const request = {
            type : "GET",
            url : "/students/all/"+companyId,
        }
        try {
            const response = await ajax(request)
            const allStudents = JSON.stringify(response.data);
            const token = getCookie("authToken")
            let formData = new FormData();
            formData.append("data", allStudents)
            formData.append("token", token)
            const studentsRequest = {
                type: "POST",
                url: "/export-to-pdf",
                data: formData
            }
            try {
                let response = await ajax(studentsRequest);
                const downloadRequest = {
                    type: "GET",
                    url: "/exports/"+response.filename
                }
                const pdfFile = await ajaxDownloader(downloadRequest)
                const pdfUrl = URL.createObjectURL(pdfFile)
                let a = document.createElement("A");
                a.href = pdfUrl; // kis adress pe jana hey downlode kerney k leye ?
                a.download = response.filename; // Kis name se download kerna hey
                a.click(); // khud he download ho ga
                a.remove(); // ancker tag remove 
                deletePdf(response.filename) // delete pdf after download
            } catch (error) {
                console.log(error)
            }
            
        } catch (error) {
            
        }
    })

})

// downloadRequest pdf 
const ajaxDownloader = (request) => {
    return $.ajax({
        type: request.type,
        url: request.url,
        xhr: () => {
            const xml = new XMLHttpRequest();
            xml.responseType = "blob";
            return xml
        }
    }).promise();
}

// delete pdf
const deletePdf = async (filename)=>{
    const token = getCookie("authToken")
    const request = {
        type: "DELETE",
        url: "/export-to-pdf/"+filename,
        data : {
            token : token
        }
    }
    await ajax(request)

}
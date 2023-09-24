$(document).ready(() => {
    const inv = getInvitation()
    $(".logo").attr("src", inv.companyLogo)
    $(".company-name").html(inv.companyName)
    $(".email").html(inv.companyEmail)
})

const getInvitation = () => {
    const url = window.location.pathname;
    const array = url.split("/");
    const inv = decodeToken(array[array.length - 1])
    const token = array[array.length - 1];
    inv.data["token"] = token;
    return inv.data;

}

// profileurl 
let profileUrl = '<i class="fa fa-user-circle" style ="font-size:45px;"></i>';
let isProfile = false
// uploade profile 
$(document).ready(() => {
    $(".student-profile").on("change", async function () {
        let file = this.files[0];
        let objectUrl = await uploadeFileOnS3(file)
        profileUrl = objectUrl;
        isProfile = true;
    })
})

// update user info
$(document).ready(()=>{
    $("form").submit(async function(e){
        e.preventDefault()
        let inv = getInvitation()
        const formData = new FormData(this);
        formData.append("studentProfile",profileUrl)
        formData.append("isProfile",isProfile);
        formData.append("token",inv.token);
        const request ={
            type : "POST",
            url : "/students/"+inv.studentId,
            data : formData
        }
      const response =  await ajax(request)
        window.location = "/"

    })
})

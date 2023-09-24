
$(document).ready(() => {
    $(".toggler").click(() => {
        let state = $(".sidenav").hasClass("sidenav-open");
        if (state) {
            $(".sidenav").removeClass("sidenav-open");
            $(".sidenav").addClass("sidenav-close");

            // section controll
            $(".section").removeClass("section-open");
            $(".section").addClass("section-close");
        } else {
            $(".sidenav").addClass("sidenav-open");
            $(".sidenav").removeClass("sidenav-close");

            // section controll
            $(".section").addClass("section-open");
            $(".section").removeClass("section-close");
        }
    })
})

// show company info
$(document).ready(function () {
    const token = getCookie("authToken");
    const companyObj = decodeToken(token)
    const companyInfo = companyObj.data.companyInfo;
    $(".company-name").html(companyInfo.company);
    $(".company-email").html(companyInfo.email);
    $(".company-mobile").html(companyInfo.mobile);
    if (companyInfo.isLogo) {
        $(".logo-box").html('');
        $(".logo-box").css({
            backgroundImage: `url(${companyInfo.logoUrl})`,
            backgroundSize: "cover"
        })
    }
})

// uplode logo
$(document).ready(function () {
    $(".logo-box").click(() => {
        let imgType = [
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/jpg",
            "image/gif"

        ]
        let input = document.createElement("INPUT");
        input.type = "file";
        input.click()
        input.accept = "image/*";
        input.onchange = async function () {
            let file = this.files[0]
            // show progress
            $(".uploader").removeClass("d-none")
            $(".uploader").toast("show")
            if (imgType.indexOf(file.type) != -1) {
                const objectUrl = await uploadeFileOnS3(file)
                $(".logo-box").html('Wait...');
                const isUpdated = await updateLogoUrl(objectUrl);
                console.log(isUpdated)
                if (isUpdated) {
                    $(".logo-box").html('');
                    $(".logo-box").css({
                        backgroundImage : `url(${objectUrl})`,
                        backgroundSize : "cover"
                    })
                }

            } else {
                swal("onley image accepted", "please upload image", "warning")
            }
        }

    })
});

// updata image url in database 
const updateLogoUrl = async (url) => {
    const token = getCookie("authToken");
    const company = decodeToken(token);
    const id = company.data.uid;
    const formData = new FormData();
    formData.append("isLogo", true);
    formData.append("logoUrl", url);
    formData.append("token", token);

    const request = {
        type: "PUT",
        url: "/api/private/company/"+id,
        data: formData
    }
    try {
     await ajax(request);
        return true
    } catch (error) {
        return false

    }
}
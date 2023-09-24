
// email config credentiol
const config = {
    accessKeyId : "AKIATOUN3Z5IVN6LZQ5G",
    secretAccessKey : "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",
    region : "ap-southeast-1",
    params : {
        Bucket : "docs.justweb.com"
    }
}

const s3 = new AWS.S3(config);
// get cookie
const getCookie = (cookieName) => {
    const allCookies = document.cookie;
    let cookies = allCookies.split(";");
    let cookieValue = "";
    for (let cookie of cookies) {
        const currentCookie = cookie.split("=");
        if (currentCookie[0].trim() == cookieName) {
            cookieValue = currentCookie[1];
        }
    }
    return cookieValue;
}

//  ajex request coding
const ajax = (request) => {
    return new Promise((resolve, reject) => {
        const options = {
            type: request.type,
            url: request.url,
            beforeSend: () => {
                if (request.isLoader) {
                    $(request.loaderBtn).removeClass("d-none");
                    $(request.commonBtn).addClass("d-none");

                }
            },
            success: (response) => {
                if (request.isLoader) {
                    $(request.loaderBtn).addClass("d-none");
                    $(request.commonBtn).removeClass("d-none");
                }
                resolve(response)
            },
            error: (error) => {
                if (request.isLoader) {
                    $(request.loaderBtn).addClass("d-none");
                    $(request.commonBtn).removeClass("d-none");

                }
                reject(error)

            }

        }

        // check request
        if (request.type == "POST" || request.type == "PUT") {
            options['data'] = request.data;
            options["processData"] = false;
            options["contentType"] = false;
        }

        if (request.type == "DELETE") {
            options['data'] = request.data;

        }
        // ajex request
        $.ajax(options)
    })
}

// check country in local storage
const checkInLs = (key) => {
    if (localStorage.getItem(key) != null) {
        let tmp = JSON.parse(localStorage.getItem(key));
        return {
            isExsists: true,
            data: tmp
        }
    } else {
        return {
            isExsists: false
        }
    }
}


//---------------------------------------------



// removeClassess
const removeClassess = (element, className) => {
    $(element).each(function () {
        $(this).removeClass(className);
    })
}

// delete conform message
const conform = (message) => {
    return new Promise((resolve, reject) => {

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    resolve(true)
                    swal(`Poof! Your imaginary file has been ${message}`, {
                        icon: "success",
                    });
                } else {
                    reject(false)
                    swal("Your imaginary file is safe!");
                }
            });

    })
}

// decode token 
const decodeToken = (token) => {
    let peyload = JSON.parse(atob(token.split(".")[1]));
    return peyload
}
// uploade file s3 uploadeFileOnS3

//  key ka K capital dena hey or jo file uplode ki gai hey us ka name 
  // daynamic rakhney k leye file ka orignel name de den gey file.name
  //public read is leye rakha ta keh file her jagha se read ho jaye

const uploadeFileOnS3 = async (file) =>{
const fileInfo = {
    Key : file.name, 
    Body : file,  
    ACL : "public-read" 
}
// ACL : "public-read"   kerney se file public ho
 // gi is ke link ko browser me dalney se file download ho gi,
 // ager ACL of ho gi to file private ho gi

 // s3 ka file load methood call ker ke file information de dena hey
 try {
    const response = await s3.upload(fileInfo)
    .on("httpUploadProgress",(progress)=>{
        let total = progress.total
        let loaded = progress.loaded
        let percentage = Math.floor((loaded*100)/total);
        $(".file-name").html(file.name)
        $(".progress-width").css({width : percentage+"%"});
        // calculate mb
        let totalMb = (total/1024/1024).toFixed(1);
        let loadedMb = (loaded/1024/1024).toFixed(1);
        $(".progress-text").html(`${loadedMb}Mb / ${totalMb}Mb`);
        
    })
    .promise();

    return response.Location
 } catch (error) {
    return error
 }
}


// redirecting user if already loged
if (document.cookie.indexOf("authToken") != -1) {
  window.location = "/students";
}

// enable login btn
$(document).ready(()=>{
  $('.loginAs').each(function(){
$(this).on("change",function(){
  $(".login-btn").prop("disabled",false)
})
  })
})
// requesting login modal
$(document).ready(function () {
  $("#login-modal-request").click((e) => {
    e.preventDefault();
    $("#signup-modal").modal("hide");
    $("#login-modal").modal("show");
  });
});

// requesting signup modal
$(document).ready(function () {
  $("#signup-modal-request").click((e) => {
    e.preventDefault();
    $("#login-modal").modal("hide");
    $("#signup-modal").modal("show");
  });
});

// signup request

$(document).ready(() => {
  $("#signup-form").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/signup",
      // data: {
      //     company: $("[name='company']").val(),
      //     email: $("[name='email']").val(),
      //     mobile: $("[name='mobile']").val(),
      //     password: $("[name='password']").val()
      // },

      data: new FormData(e.target),
      contentType: false,
      processData: false,
      beforeSend: () => {
        $(".before-send").removeClass("d-none");
        $(".signup-btn").addClass("d-none");
      },
      success: (response) => {
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");
        if (response.isUserCreated) {
          window.location = "/students";
        }
      },
      error: (error) => {
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");
        const errorRes = error.responseJSON;
        if (error.status == 409) {
          const field = "." + errorRes.message.field;
          const label = errorRes.message.label;
          $(field).addClass("border border-danger");
          $(field + "-error").html(label);
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else {
          swal("500", "internal server Error !", "warning");
        }
      },
    });
  });
});

//login request
$(document).ready(() => {
  $("#login-form").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/login",
      data: new FormData(e.target),
      contentType: false,
      processData: false,
      beforeSend: () => {
        $(".before-send").removeClass("d-none");
        $(".login-btn").addClass("d-none");
      },
      success: (response) => {
        $(".before-send").addClass("d-none");
        $(".login-btn").removeClass("d-none");

        if (response.isLoged) {
          window.location = "/students";
        }
      },
      error: (error) => {
        console.log(error);
        $(".login-btn").removeClass("d-none");
        $(".before-send").addClass("d-none");
        if (error.status == 404) {
          let field = ".username";
          $(".username").addClass("border border-danger");
          $(".username-error").html("User not found");
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else if (error.status == 401) {
          let field = ".password";
          $(".password").addClass("border border-danger");
          $(".password-error").html("wrong password !");
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else if (error.status == 406) {
          let field = ".password";
          $(".password").addClass("border border-danger");
          $(".password-error").html(error.responseJSON.message);
          setTimeout(() => {
            resetValidator(field);
          }, 3000);
        } else {
          swal("500", "internel server error !", "warning");
        }
      },
    });
  });
});

// field validater function
const resetValidator = (field) => {
  $(field).removeClass("border-danger");
  $(field + "-error").html("");
};

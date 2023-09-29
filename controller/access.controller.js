const tokenService = require("../services/token.service");
const accessList = {
    admin: {
        toolbar: [
            {
                icon: "fa fa-bell",
                link: "/notifications",
                design: "icon-btn-dark"
            },
            {
                icon: "fa fa-user-secret",
                link: "/students",
                design: "icon-btn-primary"
            },
            {
                icon: "fa fa-users",
                link: "/teams",
                design: "icon-btn-warning"
            },
            {
                icon: "fa fa-cog",
                link: "/setting",
                design: "icon-btn-info"
            },
            {
                icon: "fa fa-sign-out-alt",
                link: "/logout",
                design: "icon-btn-danger"
            }
        ]
    },
    employee: {},
    student: {
        toolbar : [
            {
                icon: "fa fa-bell",
                link: "/notifications",
                design: "icon-btn-dark"
            },
            {
                icon: "fa fa-cog",
                link: "/setting",
                design: "icon-btn-info"
            },
            {
                icon: "fa fa-sign-out-alt",
                link: "/logout",
                design: "icon-btn-danger"
            }
        ]
    }
}
const getAccess = async (request, response) => {
    const tokenData = await tokenService.verify(request);
    const role = tokenData.data.role
    response.status(200)
    response.json({
        msg: "success",
        data: accessList[role]
    })
}

module.exports = {
    getAccess: getAccess
}
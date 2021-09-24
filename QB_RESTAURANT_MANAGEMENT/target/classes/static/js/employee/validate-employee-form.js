$("#employeeForm").validate({
    errorElement: 'div',
    rules: {
        employee_name:  {
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        phoneNumber: {
            required: true,
            regexPhone: true,
        },
        user_name:{
            required:true,
            minlength: 5,
            maxlength: 50,
        },
        password:{
            required:true,
            minlength: 5,
            maxlength: 50,
        },
        DOB:{
            required:true,
        },
        address:{
            required:true
        },
    },

    messages: {
        employee_name: {
            required: "Vui lòng nhập tên nhân viên !",
            minlength: "Vui lòng nhập tối thiểu 5 ký tự!",
            maxlength: "Vui lòng nhập tối đa chỉ có 50 ký tự!"
        },
        phoneNumber: {
            required: "Vui lòng nhập số điện thọai !",
        },
        user_name:{
            required: "Vui lòng nhập tên đăng nhập!",
            minlength: "Tên đăng nhập tối thiểu 5 ký tự !",
            maxlength: "Tên đăng nhập tối đa 50 ký tự"
        },
        password:{
            required:"Vui lòng nhập mật khẩu !",
            minlength: "Mật khẩu tối thiểu 5 ký tự",
            maxlength:"Mật khẩu nhập tối đa 50 ký tự",
        },
        DOB:{
            required: "Ngày sinh không được để trống !",
        },
        address:{
            required: "Địa chỉ không được để trống !"
        },
    },
    submitHandler: function() {
        createEmployee();
    }
});

$("#editEmployeeForm").validate({
    errorElement: 'div',
    rules: {
        up_employee_name:  {
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        up_phoneNumber: {
            required: true,
            regexPhone: true,
        },
        up_user_name:{
            required:true,
            minlength: 5,
            maxlength: 50,
        },
        up_password:{
            required:true,
            minlength: 5,
            maxlength: 50,
        },
        up_DOB:{
            required:true,
        },
        up_address:{
            required:true
        },
    },

    messages: {
        up_employee_name: {
            required: "Vui lòng nhập tên nhân viên !",
            minlength: "Vui lòng nhập tối thiểu 5 ký tự!",
            maxlength: "Vui lòng nhập tối đa chỉ có 50 ký tự!"
        },
        up_phoneNumber: {
            required : "Vui lòng nhập số điện thọai !",
        },
        up_user_name:{
            required: "Vui lòng nhập tên đăng nhập!",
            minlength: "Tên đăng nhập tối thiểu 5 ký tự !",
            maxlength: "Tên đăng nhập tối đa 50 ký tự"
        },
        up_password:{
            required:"Vui lòng nhập mật khẩu !",
            minlength: "Mật khẩu tối thiểu 5 ký tự",
            maxlength:"Mật khẩu nhập tối đa 50 ký tự",
        },
        up_DOB:{
            required: "Ngày sinh không được để trống !",
        },
        up_address:{
            required: "Địa chỉ không được để trống !"
        },
    },
    submitHandler: function() {
        saveEmployee();
    }
});
$.validator.addMethod("regexPhone", function (value, element) {
    return this.optional(element) || /((09|03|07|08|05)+([0-9]{8})\b)/g.test(value);
}, "Hãy nhập số điện thoại hợp lệ!!!");

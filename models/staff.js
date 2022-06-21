function Staff (id, fullName, email, passWord, datepicker, basicSalary, position, workTimeInMonth){
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.passWord = passWord;
    this.datepicker = datepicker;
    this.basicSalary = basicSalary;
    this.position = position;
    this.workTimeInMonth = workTimeInMonth;

    this.totalSalary = function() {
        var totalSalary;
        if (this.position === "Sếp") {
            totalSalary = this.basicSalary * 3
        } else if (this.position === "Trưởng phòng"){
            totalSalary = this.basicSalary * 2
        } else {
            totalSalary = this.basicSalary * 1
        }
        return totalSalary;
    };

    this.typeOfEmployee = function() {
        var typeOfEmployee;
        if (this.workTimeInMonth >= 192) {
            typeOfEmployee = "Nhân viên xuất sắc"
        } else if (this.workTimeInMonth >= 176){
            typeOfEmployee = "Nhân viên giỏi"
        }  else if (this.workTimeInMonth >= 160){
            typeOfEmployee = "Nhân viên khá"
        } else {
            typeOfEmployee = "Nhân viên trung bình"
        }
        return typeOfEmployee;
    };
}


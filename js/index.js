/**
 * 1. quản lý nhân viên (CRUD)
 *      - Tạo nhân viên mới
 *      - Xem danh sách nhân viên
 *      - Cập nhật thông tin NV.
 *      - Xóa nhân viên
 *      - Tìm kiếm nhân viên bằng ID + tên.
 *      - validate dữ liệu 
 * 2. Giao diện
 * 3. Phân tích và build DB: lớp đối tượng nhân viên
 *      ** staff: 
 *             + id, fullName, email, password, datepicker, basicSalary, position, workTimeInMonth
 *             + totalSalary
 *             + typeOfEmployee
 */

var staffList = [];

function createStaff() {
   
    var id = document.getElementById("tknv").value;
    var fullName = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var passWord = document.getElementById("password").value;
    var datepicker = document.getElementById("datepicker").value;
    var basicSalary = +document.getElementById("luongCB").value;
    var position = document.getElementById("chucvu").value;
    var workTimeInMonth = +document.getElementById("gioLam").value;

    // Gọi tới hàm validation để kiểm tra xem from có hợp lệ hay không
    var isValid = validation()
    if(!isValid){
        return alert ("Vui lòng kiểm tra các input");
    }


    // Kiểm tra id nhân viên, xem có NV nào trong mẫu có id trùng không.
    var foundIndex = findById(id);

    if (foundIndex !== -1) {
        alert("Mã nhân viên trùng lặp!");
        return;
    }

    //tạo 1 staff mới
    var newStaff = new Staff(id, fullName, email, passWord, datepicker, basicSalary, position, workTimeInMonth);

    //push staff mới vào danh sách.
    staffList.push(newStaff);
    
    //render giao diện table
    renderTable();

    // lưu danh sách SV vào local của trình duyệt
    saveData();

    // reset input + báo lỗi
    resetForm() 

}

function findById(id) {
    // Tìm nv nào trong staffList => index
    // => -1 
    for (var i = 0; i < staffList.length; i++) {
        if (staffList[i].id === id) {
            return i;
        }
    }
    return -1;
}

function renderTable(data) {

    if(!data){
        data = staffList;
    }

    var html = "";

    for (var i = 0; i < data.length; i++) {
        var currentStaff = data[i];
        html += `<tr>
        <td>${currentStaff.id}</td>
        <td>${currentStaff.fullName}</td>
        <td>${currentStaff.email}</td>
        <td>${dayjs(currentStaff.datepicker).format("MM/DD/YYYY")}</td>
        <td>${currentStaff.position}</td>
        <td>${currentStaff.totalSalary()}</td>
        <td>${currentStaff.typeOfEmployee()}</td>
        <td>
        <button class="btn btn-danger" onclick="deleteStaff('${currentStaff.id}')">Xóa</button>
        <button class="btn btn-info" onclick="getStaffInfo('${currentStaff.id}')">Cập Nhật</button>
        </td>
        </tr>`;
    }
    document.getElementById("tableDanhSach").innerHTML = html;
}

function saveData() {
    localStorage.setItem("list1", JSON.stringify(staffList));
}

//data (local) => data mới
function mapData(dataFromLocal) {
    var mappedData = [];
    for (var i = 0; i < dataFromLocal.length; i++) {
        var item = dataFromLocal[i];
        var newStaff = new Staff(item.id, item.fullName, item.email, item.passWord, item.datepicker, item.basicSalary, item.position, item.workTimeInMonth);
        
        mappedData.push(newStaff);
    }

    return mappedData;
}

function getData() {
    var staffListStr = localStorage.getItem("list1");
    // duoi local k có thì nó trả về nude
    if (!staffListStr) return;
   

    //parse : chuyển từ chuổi về obj.
    staffList = mapData(JSON.parse(staffListStr))
    renderTable();
}
getData();

function deleteStaff(id){
    var index = findById (id);

    if(index === -1){
        alert ("Id ko hợp lệ!");
        return;
    }

    staffList.splice(index, 1);
    renderTable();

    saveData();
}

// update - phần 1: lấy thôgn tin của staff muốn cập nhật và show lên form.
function getStaffInfo(id){
    var index = findById(id);

    if (index === -1) {
        alert ("Id ko hợp lệ!");
        return;
    }

    var foundStaff = staffList[index];

    document.getElementById("tknv").value = foundStaff.id;
    document.getElementById("name").value = foundStaff.fullName;
    document.getElementById("email").value = foundStaff.email;
    document.getElementById("password").value = foundStaff.password;
    document.getElementById("datepicker").value = foundStaff.datepicker;
    document.getElementById("luongCB").value = foundStaff.basicSalary;
    document.getElementById("chucvu").value = foundStaff.position;
    document.getElementById("gioLam").value = foundStaff.workTimeInMonth;

    document.getElementById("btnThemNV").style.display = "none";
    document.getElementById("btnThem").click()
    // muốn click nút này nút kia click theo thì có 2 cách:
    // cách 1: Dom id tới cái button đó và thêm thuộc tính click()
    // =>>>>>>>>document.getElementById("btnThem").click()
    // cách 2 dùng datatoggle và datatarget giống hệt nhau ở 2 nút đó.
    //  =>>>>>>>>>data-toggle="modal" data-target="#myModal" (nút cập nhật và nút thêm nhân viên)
}

// update - phần 2: người dùng sửa lại thông tin trên form và nhấn nút lưu thay đổi =>
//khi nhấn nút lưu thay đổi thì phải reset lại form, các input trở về trống.

function resetForm() {
    //reset input
    document.getElementById("tknv").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("datepicker").value = "";
    document.getElementById("luongCB").value = "";
    document.getElementById("chucvu").value = "";
    document.getElementById("gioLam").value = "";
    // reset span lỗi

    document.getElementById("tbTKNV").innerHTML = "";
    document.getElementById("tbTen").innerHTML = "";
    document.getElementById("tbEmail").innerHTML = "";
    document.getElementById("tbMatKhau").innerHTML = "";
    document.getElementById("tbNgay").innerHTML = "";
    document.getElementById("tbLuongCB").innerHTML = "";
    document.getElementById("tbChucVu").innerHTML = "";
    document.getElementById("tbGiolam").innerHTML = "";
}

function updateStaff(){
    //lấy dữ liệu từ input
    var id = document.getElementById("tknv").value;
    var fullName = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var passWord = document.getElementById("password").value;
    var datepicker = document.getElementById("datepicker").value;
    var basicSalary = +document.getElementById("luongCB").value;
    var position = document.getElementById("chucvu").value;
    var workTimeInMonth = +document.getElementById("gioLam").value;

    // Kiểm tra hợp lệ
    var isValid = validation();
    if (!isValid){
        return alert("Vui lòng kiểm tra lại lại các input")
    }

    // id cũ => tìm vị trí => cập nhật từng field
    var index = findById(id);

    if (index === -1){
        alert("ID chưa giống với ID cũ");
        return;

    }

    var foundStaff = staffList[index];

    foundStaff.fullName = fullName;
    foundStaff.email = email;
    foundStaff.passWord = passWord;
    foundStaff.datepicker = datepicker;
    foundStaff.basicSalary = basicSalary;
    foundStaff.position = position;
    foundStaff.workTimeInMonth = workTimeInMonth;

    renderTable();

    saveData();

    alert("Update thành công!");

    // document.getElementById("btnCreate").style.display = "inline-block";
    

    document.getElementById("tknv").disabled = false;
    document.getElementById("btnDong").click()

    resetForm()
}

// validation
function validation(){
    // debugger;
    // kiểm tra không được để trống: hàm validation
    // hàm checkValidity() là hàm kiểm tra xemc các input bên trong tag form có hợp lệ hay không.
    var isValid = document.getElementById("formQLNV").checkValidity();
    // => kiểm tra toàn bộ, chỉ cần 1 input trống thì không hợp lệ

    if(!isValid){
        // DOM tói input tknv và kiểm tra hợp lệ
        var inpMaNV = document.getElementById("tknv")
        var spanMaNV = document.getElementById("tbTKNV")
        if(inpMaNV.validity.valueMissing){
            // input đang bị lỗi required.
            spanMaNV.innerHTML = "Mã nhân viên không được để trống"
            
        } else if (inpMaNV.validity.patternMismatch){
            // input đang bị lỗi định dạng không hợp lệ
            spanMaNV.innerHTML = "Mã NV phải là số và từ 4 đến 6 kí số";
        } else {
            spanMaNV.innerHTML = ""
        }        


        // DOM tói input name và kiểm tra hợp lệ
        var inpTenSNV = document.getElementById("name");
        var spanTenNV = document.getElementById("tbTen");
        if(inpTenSNV.validity.valueMissing){
            // input đang bị lỗi required
            spanTenNV.innerHTML = "Tên nhân viên không được để trống";
        } else if (inpTenSNV.validity.patternMismatch){
            // input đang bị lỗi không đúng định dạng
            spanTenNV.innerHTML = "Tên nhân viên phải là chữ";
        } else {
            spanTenNV.innerHTML = "";
        }
        
        // DOM tới input email và kiểm tra hợp lệ
        var inpEmailNV = document.getElementById("email");
        var spanEmailNV = document.getElementById("tbEmail");
        if(inpEmailNV.validity.valueMissing){
            // input đang bị lỗi required
            spanEmailNV.innerHTML = "Email nhân viên không được để trống";
        } else if (inpEmailNV.validity.patternMismatch){
            // input đang bị lỗi Email không đúng định dạng
            spanEmailNV.innerHTML = "Email nhân viên không đúng định dạng";
        } else {
            spanEmailNV.innerHTML = "";
        }

        // DOM tới input datepicker và kiểm tra hợp lệ
        // typeMismatch: kiểm tra các input có type đặc biệt như email,date,...
        var inpdatepicker= document.getElementById("datepicker");
        var spandatepicker= document.getElementById("tbNgay");
        if(inpdatepicker.validity.valueMissing){
            // input đang bị lỗi required
            spandatepicker.innerHTML = "Ngày bắt đầu tính lương không được để trống";
        } else if (inpdatepicker.validity.typeMismatch){
            // input đang bị lỗi Ngày bắt đầu tính lương định dạng
            spandatepicker.innerHTML = "Ngày bắt đầu tính lương không đúng định dạng mm/dd/yyyy";
        } else if (dayjs(inpdatepicker.value).isAfter(dayjs())){
            // Ngày bắt đầu tính lương đang lớn hơn ngày hiện tại
            spandatepicker.innerHTML = "Ngày bắt đầu tính lương không hợp lệ (lớn hơn ngày hiện tại)";
        } else {
            spandatepicker.innerHTML = "";
        }

        // DOM tới select chucvu và kiểm tra hợp lệ
        var selectposition= document.getElementById("chucvu");
        var spanposition= document.getElementById("tbChucVu");
        if(selectposition.validity.valueMissing){
            // input đang bị lỗi required
            spanposition.innerHTML = "Chức vụ không được để trống";
        } else {
            spanposition.innerHTML = "";
        }
    
        // Dom tới input password và kiểm tra hợp lệ
        // validity.rangeUnderflow: trả ra true nếu giá trị của input nhở hơn giá trị của attributr min.
        // validity.rangeOverflow: trả ra true nếu giá trị của input nhở hơn giá trị của attributr max.
        var inpPassword= document.getElementById("password");
        var spanPassword= document.getElementById("tbMatKhau");
        if(inpPassword.validity.valueMissing){
            // input đang bị lỗi required
            spanPassword.innerHTML = "passWord không được để trống";
        } else if (inpPassword.validity.patternMismatch){
            // input đang bị lỗi Password không đúng định dạng
            spanPassword.innerHTML = "Password nhân viên không đúng định dạng. Phải có tối thiểu 6 và tối đa 10 ký tự, ít nhất một chữ cái viết hoa(A-Z), một kí số(0-9) và một ký tự đặc biệt ( một trong các kí tự sau: @$!%*?&}. Khi cập nhật lại thì phải gõ lại password cũ hoặc đổi password mới.";
        } else {
            spanPassword.innerHTML = "";
        }

        // Dom tới input luongCB và kiểm tra hợp lệ  
        var inpLuongCB= document.getElementById("luongCB");
        var spanLuongCB= document.getElementById("tbLuongCB");
        if(inpLuongCB.validity.valueMissing){
            // input đang bị lỗi required
            spanLuongCB.innerHTML = "Lương cơ bản không được để trống";
        } else if (inpLuongCB.validity.patternMismatch){
            // input đang bị lỗi Password không đúng định dạng
            spanLuongCB.innerHTML = "Lương cơ bản phải nằm trong khoảng từ 1.000.000 đến 20.000.000, vui lòng không nhập dấu '.' hoặc dấu cách ' ' giữa các số 0";
        } else {
            spanLuongCB.innerHTML = "";
        }

        // Dom tới input gioLam và kiểm tra hợp lệ  
        var inpGioLam= document.getElementById("gioLam");
        var spanGioLam= document.getElementById("tbGiolam");
        if(inpGioLam.validity.valueMissing){
            // input đang bị lỗi required
            spanGioLam.innerHTML = "Giờ làm không được để trống";
        } else if (inpGioLam.validity.patternMismatch){
            // input đang bị lỗi Password không đúng định dạng
            spanGioLam.innerHTML = "Số giờ làm trong tháng phải từ 80 - 200 giờ";
        } else {
            spanGioLam.innerHTML = "";
        }
    }
    return isValid;
}

// tìm kiếm tuyến tính.
function findStaff () {
    var results = []

    // 1. láy keyword (chổ ngta nhập vào trong thẻ input search)
    var keyword = document.getElementById("searchName").value.toLowerCase().trim();
    // 2. duyệt staffList, kiểm tra từng nhân viên
    for(var i = 0; i < staffList.length; i++){
        var currentStaff = staffList[i];
        if(currentStaff.typeOfEmployee().toLowerCase().includes(keyword)) {
            // currentStaff.id === keyword || currentStaff.fullName.toLowerCase().includes(keyword) || currentStaff.typeOfEmployee().toLowerCase().includes(keyword)
            results.push(currentStaff)
        }
    }
    // console.log(results)
    renderTable(results)
}
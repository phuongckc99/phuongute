// liên kết web app firebase
const firebaseConfig = {
    apiKey: "AIzaSyADPKKEeLsVLwPAlaHqE5fNZZfdkchqYHw",
    authDomain: "phuong-ute.firebaseapp.com",
    databaseURL: "https://phuong-ute-default-rtdb.firebaseio.com",
    projectId: "phuong-ute",
    storageBucket: "phuong-ute.appspot.com",
    messagingSenderId: "506351613161",
    appId: "1:506351613161:web:9a82481db0bafd32a7ac78",
    measurementId: "G-FSEEDZGPN1"
  };
  firebase.initializeApp(firebaseConfig)
  const database = firebase.database(); // lên kết realtime database

// khai báo biến và liên kết bên HTML 
//

  //auto update data từ firebase về html
  // Nhiệt độ phòng
const tempC = document.getElementById("TempC");
    database.ref("AmTemp/AmC").on("value", function(snaphot){
        let C = snaphot.val();
        tempC.innerHTML = C;
        console.log(C);  
    })
const tempF = document.getElementById("TempF");
    database.ref("AmTemp/AmF").on("value", function(snaphot){
        let F = snaphot.val();
        tempF.innerHTML = F;
        console.log(F);
    })
    // Nhiệt độ vật thể
const tempOBC = document.getElementById("OBTempC");
database.ref("ObTemp/ObC").on("value", function(snaphot){
    let OBC = snaphot.val();
    tempOBC.innerHTML = OBC;
    console.log(OBC);
})
const tempOBF = document.getElementById("OBTempF");
database.ref("ObTemp/ObF").on("value", function(snaphot){
    let OBF = snaphot.val();
    tempOBF.innerHTML = OBF;
    console.log(OBF);
})
// BPW with SPO2
const bpw = document.getElementById("BPW");
database.ref("Suckhoe/BPW").on("value", function(snaphot){
    let A = snaphot.val();
    bpw.innerHTML = A;
    console.log(A);
})
const spo2 = document.getElementById("SPO2");
database.ref("Suckhoe/SPO2").on("value", function(snaphot){
    let B = snaphot.val();
    spo2.innerHTML = B;
    console.log(B);
})

const data = document.getElementById("heartRateInput");  
const averageBPMDisplay = document.getElementById("averageBPM");  
const BPMList = document.getElementById("BPMList"); // Tham chiếu đến danh sách  

const data1 = document.getElementById("spo2RateInput");  
const averagespo2Display = document.getElementById("averagespo2");  
const spo2List = document.getElementById("spo2List"); // Tham chiếu đến danh sách  

let spo22 = []; // Mảng để lưu trữ các giá trị nhịp tim  
let BPM = []; // Mảng để lưu trữ các giá trị nhịp tim  
let timeout; // Biến để lưu trữ timeout  

// Hàm để cập nhật danh sách nhịp tim trên HTML  
function updateBPMList() {  
    BPMList.innerHTML = BPM.map(bpm => `<li>${bpm}</li>`).join('');  
}  
function updatespo2List() {  
    spo2List.innerHTML = spo22.map(spo2 => `<li>${spo2}</li>`).join('');  
}
// Hàm để xóa mảng cũ  
function clearBPMData() {  
    BPM = []; // Xóa mảng  
    averageBPMDisplay.innerHTML = ""; // Xóa hiển thị giá trị trung bình  
    updateBPMList(); // Cập nhật lại danh sách hiển thị 
      
    spo22 = []; // Xóa mảng  
    averagespo2Display.innerHTML = ""; // Xóa hiển thị giá trị trung bình  
    updatespo2List(); // Cập nhật lại danh sách hiển thị  
}  

// Hàm tự động gửi dữ liệu sau 10 giây  
function autoSubmitData() {  
    // Gọi hàm gửi dữ liệu  
    document.getElementById("form").dispatchEvent(new Event('submit'));  
}  

// Hàm để tính và cập nhật giá trị trung bình vào ô nhập nhịp tim  
function updateHeartRateInput() {  
    if (BPM.length > 0 && spo22.length > 0) {  
        const total = BPM.reduce((acc, val) => acc + val, 0);  
        const total1 = spo22.reduce((acc, val) => acc + val, 0); 
        const average = total / BPM.length;  
        const average1 = total1 / spo22.length; 
        // Chuyển đổi giá trị trung bình thành số nguyên  
        const integerAverage = Math.trunc(average); // Hoặc Math.floor(average) nếu bạn muốn làm tròn xuống  
        const integerAverage1 = Math.trunc(average1); // Hoặc Math.floor(average1) 
         
        data.value = integerAverage.toFixed(0); // Cập nhật giá trị trung bình vào ô nhập  
        data1.value = integerAverage1.toFixed(0); // Cập nhật giá trị trung bình vào ô nhập 
        averageBPMDisplay.innerHTML = `Trung bình: ${integerAverage.toFixed(0)}`; // Cập nhật hiển thị trung bình  
        averagespo2Display.innerHTML = `Trung bình: ${integerAverage1.toFixed(0)}`; // Cập nhật hiển thị trung bình
        //console.log(`Giá trị trung bình nhịp tim đã được cập nhật: ${average.toFixed(2)}`);   
        // Kiểm tra nhịp tim và tự động nhập kết luận  
        const conclusionInput = document.querySelector('input[name="Result"]'); // Lấy ô nhập kết luận  
        if (integerAverage >= 60 && integerAverage <= 120) {  
            conclusionInput.value = "Bình thường"; // Nhập "Bình thường" vào ô kết luận  
             // Hiển thị thông báo "Đo thành công"  
        alert("Đo thành công !!!\nBpm & SpO2 Trong ngưỡng bình thường.");   
        } else {  
            conclusionInput.value = "Kiểm tra lại"; // Xóa ô kết luận nếu không nằm trong khoảng  
            alert("Đo thành công !!!\nBpm & SpO2 Bất thường vui lòng đo lại đặt tay chính xác lên cảm biến MAX30102. Xin cảm ơn!!!.");   
        }  
        
        // Gửi dữ liệu và xóa mảng sau 10 giây  
        setTimeout(() => {  
            autoSubmitData(); // Gửi dữ liệu  
            clearBPMData(); // Xóa dữ liệu  
        }, 1000);  
    }     
 
}  
////
const den1 = document.getElementById("den1");  
const den2 = document.getElementById("den2");  
const hd1 = document.getElementById("denbao1");  
const hd2 = document.getElementById("denbao2");



const heart = document.querySelector('.heart');  
// Giả sử bạn đã có biến để lưu trữ animation ECG  
const dashAnimate = document.getElementById('dashAnimate');  
const lineAnimate = document.getElementById('lineAnimate'); 

database.ref("Nhanbiet").on("value", function(snapshot) {  
    let NN = snapshot.val(); // Lấy dữ liệu  
    if (NN) {  
        // Kiểm tra trạng thái của nhan1  
        if (NN["Nhan1"] === 'OFF') {  
            cancelAnimationFrame(drawSOP2WaveId);  
            ctx.clearRect(0, 0, canvas.width, canvas.height);  
            //den1.src = "./img/nutkhonghoatdong.png";  
            //den1.classList.remove("blinking"); // Xóa lớp chớp tắt              
            //hd1.innerHTML = "KHÔNG HOẠT ĐỘNG"; // Hiển thị thông điệp khi ON  
            //hd1.parentNode.classList.remove("active"); // Xóa lớp màu xanh 
            //hd1.parentNode.classList.remove("blinking"); // Xóa lớp chớp tắt  
            
            // Dừng animation ECG  
             dashAnimate.endElement(); // Dừng animation đường ECG  
            lineAnimate.endElement(); // Dừng animation đường thẳng 
            // ngừng đập
            heart.style.animation = 'none';  
            
            // Thay đổi màu nền của data box về màu mặc định (nguyên trạng) và xóa lớp chớp tắt  
            //const dataBoxes2 = document.querySelectorAll('.data-box2');  
            //dataBoxes2.forEach(box => {  
                //box.style.backgroundColor = '#f2f6f8'; // Màu nền mặc định  
                //box.classList.remove("blinking-fast"); // Xóa lớp chớp tắt  
                // Nếu có timeout đang chạy, xóa nó  
         
            //});
            if (timeout) {  
                clearTimeout(timeout);  
            }  
                    // Thiết lập timeout để cập nhật nhịp tim và gửi dữ liệu sau 10 giây  
                timeout = setTimeout(function() {  
                    updateHeartRateInput(); // Cập nhật nhịp tim  
                }, 2000);

        } else {  
            drawSOP2Wave(); // Bắt đầu vẽ sóng khi nhấn nút
            //den1.src = "./img/nuthoatdong.png";  
            //den1.classList.add("blinking"); // Thêm lớp chớp tắt 
            //hd1.innerHTML = "ĐANG ĐO BWM & SOP2"; // Hiển thị thông điệp khi ON 
            //hd1.parentNode.classList.add("active"); // Thêm lớp màu xanh   
            //hd1.parentNode.classList.add("blinking"); 

            // Bắt đầu animation ECG  
            dashAnimate.beginElement(); // Bắt đầu animation đường ECG  
            lineAnimate.beginElement(); // Bắt đầu animation đường thẳng 
            // trái tim đập
            heart.style.animation = 'heartbeat 1s infinite';  
            // Thay đổi màu nền của data box thành màu xanh và thêm lớp chớp tắt  
            const dataBoxes2 = document.querySelectorAll('.data-box2');  
            dataBoxes2.forEach(box => {  
                box.style.backgroundColor = 'lightgreen'; // Thay đổi màu nền thành xanh  
                box.classList.add("blinking-fast"); // Thêm lớp chớp tắt  
            }); 
            // Lắng nghe thay đổi dữ liệu từ Firebase  
database.ref("Suckhoe/BPW").on("value", function(snapshot) {  
    let C = snapshot.val();  
    
    // Nếu có giá trị mới và giá trị lớn hơn 60  
    if (typeof C === 'number' && C > 40) {   
        BPM.push(C); // Thêm giá trị vào mảng  
        console.log(`Giá trị nhịp tim nhận được: ${C}`);  

        // Hiển thị giá trị nhịp tim hiện tại  
        data.value = `${C}`;  

        // Hiển thị toàn bộ mảng nhịp tim lên HTML  
        updateBPMList();         
         
    }  
});
             // Lắng nghe thay đổi dữ liệu từ Firebase  
database.ref("Suckhoe/SPO2").on("value", function(snapshot) {  
    let G = snapshot.val();  
    
    // Nếu có giá trị mới và giá trị lớn hơn 60  
    if (typeof G === 'number' && G > 60) {   
        spo22.push(G); // Thêm giá trị vào mảng  
        console.log(`Giá trị nhịp tim nhận được: ${G}`);  

        // Hiển thị giá trị nhịp tim hiện tại  
        data1.value = `${G}`;  

        // Hiển thị toàn bộ mảng nhịp tim lên HTML  
        updatespo2List();         
         
    }  
});
            
        }  

        // Kiểm tra trạng thái của nhan2  
        if (NN["Nhan2"] === 'OFF') {  
            // Thay đổi màu nền của data box về màu mặc định (nguyên trạng) và xóa lớp chớp tắt  
            const dataBoxes3 = document.querySelectorAll('.data-box3');  
            dataBoxes3.forEach(box => {  
                box.style.backgroundColor = '#f2f6f8'; // Màu nền mặc định  
                box.classList.remove("blinking-fast"); // Xóa lớp chớp tắt  
            });
        } else {   
            const dataBoxes3 = document.querySelectorAll('.data-box3');  
            dataBoxes3.forEach(box => {  
                box.style.backgroundColor = 'lightgreen'; // Thay đổi màu nền thành xanh  
                box.classList.add("blinking-fast"); // Thêm lớp chớp tắt  
            });
        }  
    } else {  
        console.error("Dữ liệu không tồn tại.");  
    }  
});  

function initialize() {  
    updateExaminationDate();  
    loadInfo();  
}  

window.onload = initialize;



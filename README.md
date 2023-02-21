## Cái gì đây?
Đây là 1 thư viện chứa các công cụ nhỏ hỗ trợ xử lý javascript được thuận tiện. Hiện tại thư viện mới chỉ có 2 công cụ: EventEmitter và Queue

### 1. EventEmitter  
  #### EventEmitter là gì? 
  Chúng ta không còn xa lạ với xử lý events DOM ở javascript nữa phải không? 
  Nếu chúng ta lắng nghe event 'click' bằng onClick hoặc addEventListener thì: Khi Button A bị người dùng click, event 'click' sẽ được trigger, callback trong eventListener sẽ được thực hiện.
  tools EventEmitter này cũng có tác dụng tương tự. Nhưng nó không phải dùng để xử lý events DOM mà là để tạo, quản lý và xử lý các events riêng của chúng ta trong javascript (Hoạt động trên cả Node.JS và JS browser)
  #### Các trường hợp sử dụng?
  - Giả dụ chúng ta có 2 function nằm ở 2 module js khác nhau trong cùng 1 project. Giả dụ function B đang chạy, đến 1 bước nào đó, cần đợi 1 global variable được khởi tạo bởi function A có giá trị thì mới thực hiện tiếp. Trong trường hợp này chúng ta xử lý thế nào? 
  Ex:
  * Function A ở module 1.js:`
    var x = undefined;
    (function A() {
      console.log("start A");
      setInterval(() => {
        const timestamp = new Date().getTime();

        if(timestamp % 5 === 0) {
          x = timestamp;
        }
      }, 2000);
    })();
    `

  * Function B ở module 2.js:`
  (function B() {
    console.log("start B");
    /* 
      Xử lý abcdxyz gì đó ở chỗ này
    */

    // Sau đó làm thế nào để đợi có giá trị của biến x để thực thi
    console.log("end B", x);
  })();
  `

  Tất nhiên là chúng ta có thể sử dụng callback để xử lý vấn đề này. Tuy nhiên, chúng ta sẽ phải đối mặt với một số vấn đề:
  - phải export function B ở module 2.js và import lại ở module 1.js hoặc phải tạo thêm biến global để lưu callback
  - Giả sử như muốn function B chỉ được thực thi 2 lần khi timestamp chia hết cho 5 rồi thôi thì xử lý thế nào? Tất nhiên là có thể chọc vào và sửa code function A tuy nhiên nó sẽ làm đoạn code trở nên cồng kềnh hơn
  - Và một cái vấn đề quan trọng nhất là khi bê function B vào trong vị trí module 1.js nó sẽ làm mất đi tính rõ ràng, minh bạch và riêng biệt giữa các module
  Tất cả những vấn đề trên có thể giải quyết dễ dàng bằng thư viện EventEmitter này. Tất nhiên mình không nói đây là phương pháp duy nhất, nhưng đối với mình thì đây là giải pháp tối ưu để giải quyết những vấn đề được nêu trên
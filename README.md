## Cái gì đây?
Đây là 1 thư viện chứa các công cụ nhỏ hỗ trợ xử lý javascript được thuận tiện. Hiện tại thư viện mới chỉ có 2 công cụ:

### 1. EventEmitter  
  #### EventEmitter là gì? 
  Chúng ta không còn xa lạ với xử lý events DOM ở javascript nữa phải không? 
  Nếu chúng ta lắng nghe event 'click' bằng onClick hoặc addEventListener thì: Khi Button A bị người dùng click, event 'click' sẽ được trigger, callback trong eventListener sẽ được thực hiện.
  tools EventEmitter này cũng có tác dụng tương tự. Nhưng nó không phải dùng để xử lý events DOM mà là để tạo, quản lý và xử lý các events riêng của chúng ta trong javascript (Hoạt động trên cả Node.JS và JS browser)
  #### Các trường hợp sử dụng?
  - Giả dụ chúng ta có 2 function nằm ở 2 file js khác nhau trong cùng 1 project. Giả dụ function B đang chạy, đến 1 bước nào đó, cần đợi 1 global variable được khởi tạo bởi function A có giá trị thì mới thực hiện tiếp. Trong trường hợp này chúng ta xử lý thế nào?